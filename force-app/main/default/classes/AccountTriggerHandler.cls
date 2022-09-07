public without sharing class AccountTriggerHandler {

    /*public static void updateContacts(List<Account> scope) {
        String indiRTId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        Map<String, Account> individualMap = new Map<String, Account>();
        for(Account a : scope) {
            if(a.RecordTypeId == indiRTId) {
                individualMap.put(a.HealthCloudGA__IndividualId__c, a);
            }
        }

        List<Contact> relatedContacts = [SELECT Id, HealthCloudGA__IndividualId__c FROM Contact WHERE AccountId IN :individualMap.values()];
        for(Contact c : relatedContacts) {
            Account scopeAccount = individualMap.get(c.HealthCloudGA__IndividualId__c);
            if(scopeAccount != null){
                c.Birthdate = scopeAccount.Date_of_Birth__c;
                c.Email = scopeAccount.Email__c;
                c.HomePhone = scopeAccount.Phone;
            }
        }

        if(relatedContacts.size() > 0) {
            update relatedContacts;
        }
    }*/

    public static void updateHealthChangeStatus(List<Account> scope) {

        List<Id> caseIds = new List<Id>();
        List<Id> hcIds = new List<Id>();

        List<Case> cases = [SELECT Id FROM Case WHERE AccountId IN :scope];
        List<Health_Change__c> healthChanges = [SELECT Id, 
            Health_Change_Source__c, 
            Case__c, 
            Date_of_Health_Change__c, 
            Detected_ID__c,
            Status__c 
            FROM Health_Change__c WHERE Case__c IN :cases];

        List<Health_Change__c> detected = new List<Health_Change__c>();
        List<Health_Change__c> requested = new List<Health_Change__c>();

        for(Health_Change__c hc : healthChanges) {
            if(hc.Health_Change_Source__c.equalsIgnoreCase('Detected')) {
                detected.add(hc);
            }
            else if(hc.Health_Change_Source__c.equalsIgnoreCase('Requested')) {
                requested.add(hc);
            }
        }

        HealthChangeTriggerHandler.updateStatusDetected(detected, false);
        HealthChangeTriggerHandler.updateStatusRequested(requested, false);

    }

    public static void updateRoutineDraw(List<Account> scope, Map<Id, Account> oldMap) {

        Id patientRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Patient').getRecordTypeId();
        List<Account> updated = new List<Account>();
        // Determine which last draw dates have been updated 
        for(Account acct : scope) {
             if(acct.RecordTypeId==patientRecordTypeId && acct.Last_Draw_Date__c != oldMap.get(acct.Id).Last_Draw_Date__c
             && acct.Date_Withdrawn__c == null) {
                updated.add(acct);
            }
        }      

        if(updated.size() > 0) {
            List<Request__c> draws = [SELECT Id, 
                Draw_type__c, 
                Patient__c, 
                Request_Status__c,
                Requested_At__c 
                FROM Request__c 
                WHERE Draw_type__c='Routine' AND Request_Status__c='Not Sent' AND Patient__c IN :updated];

            // Map all draws for a patient to that patient (account)
            Map<Id, List<Request__c>> patientRoutineDraws = new Map<Id, List<Request__c>>();
            for(Request__c draw : draws) {
                if(patientRoutineDraws.get(draw.Patient__c) == null) {
                    patientRoutineDraws.put(draw.Patient__c, new List<Request__c>{draw});
                }
                else {
                    patientRoutineDraws.get(draw.Patient__c).add(draw);
                }           
            }

            // Update patient's routing draw or create a new one if it does not exist
            List<Request__c> newRoutineDraws = new List<Request__c>();
            List<Request__c> updatedRoutineDraws = new List<Request__c>();
            for(Account patient : updated) {
                if(patient != null && patient.Last_Draw_Date__c != null) {
                    Date requestedAt = patient.Last_Draw_Date__c.addDays(99);
                    Date drawBy = patient.Last_Draw_Date__c.addDays(120);
                    String name = patient.FirstName == null || patient.LastName == null ? patient.Name : patient.FirstName + ' ' + patient.LastName;
                    String requestName = name + ' - Routine - ' + requestedAt.format();
                    List<Request__c> routineDraws = patientRoutineDraws.get(patient.Id);
                    if(routineDraws == null) {
                        Request__c routineDraw = new Request__c(
                           Draw_type__c = 'Routine',
                           Patient__c = patient.Id,
                           Request_Status__c = 'Not Sent',
                           Name = requestName,
                           Requested_At__c = requestedAt,
                           Draw_By_Date__c = drawBy,
                           Vendor_Sent_To__c = 'EMSI'
                        );
                        newRoutineDraws.add(routineDraw);
                    }
                    else {
                        // Update if there is only one routine draw
                        if(routineDraws.size() == 1) {
                            Request__c routineDraw = routineDraws[0];
                            routineDraw.Requested_At__c = requestedAt;
                            routineDraw.Draw_By_Date__c = drawBy;
                            routineDraw.Name = requestName;
                            updatedRoutineDraws.add(routineDraw);
                        }
                        // If there is more than one, update the most recent and close the others
                        else {
                            Request__c mostRecentRequest = routineDraws[0];
                            Integer mostRecentIndex = 0;
                            // Find the most recent routine draw
                            for(Request__c draw : routineDraws) {
                                if(draw.Requested_At__c < mostRecentRequest.Requested_At__c) {
                                    mostRecentIndex = routineDraws.indexOf(draw);
                                    mostRecentRequest = draw;
                                }
                            }
                            routineDraws.remove(mostRecentIndex);
                            mostRecentRequest.Requested_At__c = requestedAt;
                            mostRecentRequest.Draw_By_Date__c = drawBy;
                            mostRecentRequest.Name = requestName;
                            updatedRoutineDraws.add(mostRecentRequest);

                            // Close any additional routine draws
                            for(Request__c draw : routineDraws) {
                                draw.Request_Status__c = 'Closed - No Draw';
                                updatedRoutineDraws.add(draw);
                            }
                        }
                    }
                }
                
            }
            insert newRoutineDraws;
            update updatedRoutineDraws;

        }
    }
    
}