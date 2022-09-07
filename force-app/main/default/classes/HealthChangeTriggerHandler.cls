public without sharing class HealthChangeTriggerHandler {

    public static void updateStatusDetected(List<Health_Change__c> scope, Boolean isBefore) {

        List<Health_Change__c> toUpdate = new List<Health_Change__c>();
        List<Case> casesToUpdate = new List<Case>();

        Map<Id, Id> casePatientMap = new Map<Id, Id>();
        List<Id> parentCaseIds = new List<Id>();

        Group allCaseQueue;
        Group ignoreCaseQueue;
        Group reviewCaseQueue;

        List<Group> caseQueues = [SELECT Id, DeveloperNAME FROM Group WHERE Type = 'Queue' AND DeveloperNAME IN('All_Cases', 'Ignored_State_Change_Queue', 'State_Change_Review')];
        for(Group queue : caseQueues) {
            if(queue.DeveloperNAME == 'All_Cases') {
                allCaseQueue = queue;
            }
            else if(queue.DeveloperNAME == 'Ignored_State_Change_Queue') {
                ignoreCaseQueue = queue;
            }
            else if(queue.DeveloperNAME == 'State_Change_Review') {
                reviewCaseQueue = queue;
            }
        }

        // Map Health change to its parent case
        for(Health_Change__c hc : scope) {
            parentCaseIds.add(hc.Case__c);
        }

        // Retrieve all parent cases
        List<Case> parentCases = [SELECT Id, Origin, Status, Type, AccountId, 
            (SELECT Id, Status__c FROM Health_Changes__r), 
            of_Needs_Review_Health_Changes__c,
            OwnerId
            FROM Case WHERE Id IN :parentCaseIds];
        Map<Id, Case> caseMap = new Map<Id, Case>(parentCases);

        // Map parent case to its patient(account)
        for(Case c : parentCases) {
            casePatientMap.put(c.Id, c.AccountId);
        }

        Id collectionDataRecordTypeId = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection A').getRecordTypeId();

        // Retrieve all patient accounts
        List<Account> patientAccounts = [SELECT Id, Name,
            (SELECT Id, Draw_Type__c, Status__c FROM Appointment_Data__r WHERE Draw_Type__c='Baseline' AND (Status__c='Completed' OR Status__c='Partial Draw Sufficient')),
            (SELECT Id FROM Collection_Data__r WHERE Completed__c=true AND RecordTypeId=:collectionDataRecordTypeId),
            Eligible_for_Draw__c,
            Ideal_date_for_your_next_draw__c
            FROM Account WHERE Id IN :casePatientMap.values()];

        Map<Id, Account> accountMap = new Map<Id, Account>(patientAccounts);

        // Determine status that needs to be set for Health Change
        for(Health_Change__c hc : scope) {
            Case parent = hc.Case__c != null ? caseMap.get(hc.Case__c) : null;
            Account patient = (parent != null && parent.AccountId != null) ? accountMap.get(parent.AccountId) : null;

            List<Appointment__c> baselineDraws = new List<Appointment__c>();
            List<Appointment__c> totalDraws = new List<Appointment__c>();

            if(patient != null && parent != null) {
                // Add appointments of each type to their lists
                for(Appointment__c apptData : patient.Appointment_Data__r) {
                    if(apptData.Draw_Type__c=='Baseline' && apptData.Status__c=='Completed') {
                        baselineDraws.add(apptData);
                    }
                    else if(apptData.Status__c=='Completed' || apptData.Status__c=='Partial Draw Sufficient') {
                        totalDraws.add(apptData);
                    }
                }

                List<Health_Change__c> ignoredHC = new List<Health_Change__c>();
                List<Health_Change__c> deferredHC = new List<Health_Change__c>();
                List<Health_Change__c> needReviewHC = new List<Health_Change__c>();
                List<Health_Change__c> reviewedHC = new List<Health_Change__c>();

                // Count each type of Health change for parent case to see if case status needs to be updated 
                for(Health_Change__c caseHC : parent.Health_Changes__r) {
                    if(caseHC.Status__c == 'Ignored') {
                        ignoredHC.add(caseHC);
                    }
                    else if(caseHC.Status__c == 'Deferred') {
                        deferredHC.add(caseHC);                   
                    }
                    else if(caseHC.Status__c == 'Reviewed') {
                        reviewedHC.add(caseHC);                   
                    }
                    else if(caseHC.Status__c == 'Needs Review') {
                        needReviewHC.add(caseHC);                   
                    }
                }

                Integer countBaselineDraws = baselineDraws.size();
                Integer countTotalDraws = totalDraws.size();
                Integer completedBaselineSurvey = patient.Collection_Data__r.size();

                Date today = Date.today();
                Boolean olderThan1Week = hc.Date_of_Health_Change__c < today.addDays(-7);
                Boolean greaterThan21Days = hc.Date_of_Health_Change__c > today.addDays(21);
                Boolean idealDateInRange = patient.Ideal_date_for_your_next_draw__c > today.addDays(21);
                Boolean reviewed = hc.Status__c == 'Reviewed';

                // Deferred
                if(((parent.of_Needs_Review_Health_Changes__c==0 || parent.of_Needs_Review_Health_Changes__c==null) || !isBefore) 
                    && !olderThan1Week 
                    && !reviewed
                    && ((completedBaselineSurvey==0 || completedBaselineSurvey==null) 
                        || !patient.Eligible_for_Draw__c 
                        || (countBaselineDraws==0 || countBaselineDraws==null))
                    ) {
                    hc.Status__c = 'Deferred';
                    toUpdate.add(hc);
                }

                // Ignored
                else if(!reviewed && !patient.Eligible_for_Draw__c || 
                    (countBaselineDraws==0 || countBaselineDraws==null) || 
                    (completedBaselineSurvey==0 || completedBaselineSurvey==null) || 
                    olderThan1Week
                ) {
                    hc.Status__c = 'Ignored';
                    toUpdate.add(hc);
                }                   

                // Needs Review           
                else if(!reviewed && patient.Eligible_for_Draw__c && countBaselineDraws>0 && completedBaselineSurvey>0 && !greaterThan21Days) {
                    hc.Status__c = 'Needs Review';
                    toUpdate.add(hc);
                }

                // Set parent case status 
                if(needReviewHC.size() == 0 && hc.Status__c == 'Deferred') {
                    parent.Status = 'Pending';
                    parent.Pending_Reason__c = 'Deferred Health Change';
                    if(!casesToUpdate.contains(parent)) {
                        casesToUpdate.add(parent);
                    }              
                }

                // Set case owner if it is not already assigned to a user
                if(parent.OwnerId == ignoreCaseQueue.Id || parent.OwnerId == allCaseQueue.Id) {
                    if(hc.Status__c == 'Needs Review') {
                        parent.OwnerId = reviewCaseQueue.Id;
                        parent.Status = 'Open';
                        parent.Pending_Reason__c = '';
                        if(!casesToUpdate.contains(parent)) {
                            casesToUpdate.add(parent);
                        }     
                    }
                    else if(hc.Status__c == 'Ignored') {
                        parent.OwnerId = ignoreCaseQueue.Id;

                        // Set parent case status 
                        if(needReviewHC.size()==0 && reviewedHC.size()==0 && deferredHC.size()==0){
                           parent.Status = 'Closed'; 
                        }
                        if(!casesToUpdate.contains(parent)) {
                            casesToUpdate.add(parent);
                        } 
                    }
                    else {
                        parent.OwnerId = allCaseQueue.Id;
                        if(!casesToUpdate.contains(parent)) {
                            casesToUpdate.add(parent);
                        } 
                    }
                }

            }
        }

        if(!isBefore) {
            update toUpdate;
        }

        System.debug('Cases to update: ' + casesToUpdate);
        update casesToUpdate;
    }

    public static void updateStatusRequested(List<Health_Change__c> scope, Boolean isBefore) {

        List<Health_Change__c> toUpdate = new List<Health_Change__c>();
        List<Case> casesToUpdate = new List<Case>();

        Map<Id, Id> casePatientMap = new Map<Id, Id>();
        List<Id> parentCaseIds = new List<Id>();

        Group allCaseQueue;
        Group ignoreCaseQueue;
        Group reviewCaseQueue;

        List<Group> caseQueues = [SELECT Id, DeveloperNAME FROM Group WHERE Type = 'Queue' AND DeveloperNAME IN('All_Cases', 'Ignored_State_Change_Queue', 'State_Change_Review')];
        for(Group queue : caseQueues) {
            if(queue.DeveloperNAME == 'All_Cases') {
                allCaseQueue = queue;
            }
            else if(queue.DeveloperNAME == 'Ignored_State_Change_Queue') {
                ignoreCaseQueue = queue;
            }
            else if(queue.DeveloperNAME == 'State_Change_Review') {
                reviewCaseQueue = queue;
            }
        }

        // Map Health change to its parent case
        for(Health_Change__c hc : scope) {
            parentCaseIds.add(hc.Case__c);
        }

        // Retrieve all parent cases
        List<Case> parentCases = [SELECT Id, Origin, Status, Type, AccountId, 
            (SELECT Id, Status__c FROM Health_Changes__r),
            OwnerId 
            FROM Case WHERE Id IN :parentCaseIds];
        Map<Id, Case> caseMap = new Map<Id, Case>(parentCases);

        // Map parent case to its patient(account)
        for(Case c : parentCases) {
            casePatientMap.put(c.Id, c.AccountId);
        }

        // Retrieve all patient accounts
        List<Account> patientAccounts = [SELECT Id, Name,
            Eligible_for_Draw__c
            FROM Account WHERE Id IN :casePatientMap.values()];

        Map<Id, Account> accountMap = new Map<Id, Account>(patientAccounts);

        // Determine status that needs to be set for Health Change
        for(Health_Change__c hc : scope) {
            Case parent = hc.Case__c != null ? caseMap.get(hc.Case__c) : null;
            Account patient = (parent != null && parent.AccountId != null) != null ? accountMap.get(parent.AccountId) : null;

            List<Health_Change__c> ignoredHC = new List<Health_Change__c>();
            List<Health_Change__c> deferredHC = new List<Health_Change__c>();
            List<Health_Change__c> needReviewHC = new List<Health_Change__c>();
            List<Health_Change__c> reviewedHC = new List<Health_Change__c>();

            if(patient != null && parent != null) {
                // Count each type of Health change for parent case to see if case status needs to be updated 
                for(Health_Change__c caseHC : parent.Health_Changes__r) {
                    if(caseHC.Status__c == 'Ignored') {
                        ignoredHC.add(caseHC);
                    }
                    else if(caseHC.Status__c == 'Deferred') {
                        deferredHC.add(caseHC);                   
                    }
                    else if(caseHC.Status__c == 'Reviewed') {
                        reviewedHC.add(caseHC);                   
                    }
                    else if(caseHC.Status__c == 'Needs Review') {
                        needReviewHC.add(caseHC);                   
                    }
                }

                Integer nonIgnoredHealthChanges = deferredHC.size() + needReviewHC.size();
                Boolean reviewed = hc.Status__c == 'Reviewed';

                // Ignored
                if(!reviewed && !patient.Eligible_for_Draw__c && ((nonIgnoredHealthChanges==0 || nonIgnoredHealthChanges==null) || !isBefore)) {
                    hc.Status__c = 'Ignored';
                    toUpdate.add(hc);
                }

                // Needs Review
                else if(!reviewed && patient.Eligible_for_Draw__c && nonIgnoredHealthChanges>=0) {
                    hc.Status__c = 'Needs Review';
                    toUpdate.add(hc);                
                }

                // Set case owner if it is not already assigned to a user
                if(parent.OwnerId == ignoreCaseQueue.Id || parent.OwnerId == allCaseQueue.Id) {
                    if(!casesToUpdate.contains(parent)) {
                        if(hc.Status__c == 'Needs Review') {
                            parent.OwnerId = reviewCaseQueue.Id;
                            parent.Status = 'Open';
                            parent.Pending_Reason__c = '';
                            if(!casesToUpdate.contains(parent)) {
                                casesToUpdate.add(parent);
                            } 
                        }
                        else if(hc.Status__c == 'Ignored') {
                            parent.OwnerId = ignoreCaseQueue.Id;
                            if(!casesToUpdate.contains(parent)) {
                                casesToUpdate.add(parent);
                            } 
                        }
                        else {
                            parent.OwnerId = allCaseQueue.Id;
                            if(!casesToUpdate.contains(parent)) {
                                casesToUpdate.add(parent);
                            } 
                        }
                    }               
                }

                // Set parent case status 
                if(hc.Status__c =='Ignored' && needReviewHC.size()==0 && reviewedHC.size()==0 && deferredHC.size()==0) {
                    parent.Status = 'Send Communication';
                    if(casesToUpdate.contains(parent)) {
                        casesToUpdate.remove(casesToUpdate.indexOf(parent));
                        casesToUpdate.add(parent);
                    }               
                }
            }         
        }

        if(!isBefore) {
            update toUpdate;
        }

        update casesToUpdate;
    }

    public static void updateParentCaseQueue(List<Health_Change__c> scope, Map<Id, Health_Change__c> oldMap) {

        List<Health_Change__c> updated = new List<Health_Change__c>();
        List<Case> casesToUpdate = new List<Case>();

        for(Health_Change__c hc : scope) {
            if(hc.Status__c != 'Reviewed' && hc.Status__c != oldMap.get(hc.Id).Status__c) {
                Health_Change__c healthChange = new Health_Change__c(Id=hc.Id, Case__c=hc.Case__c);
                updated.add(healthChange);
            }
        }

        Group allCaseQueue;
        Group ignoreCaseQueue;
        Group reviewCaseQueue;

        List<Group> caseQueues = [SELECT Id, DeveloperNAME FROM Group WHERE Type = 'Queue' AND DeveloperNAME IN('All_Cases', 'Ignored_State_Change_Queue', 'State_Change_Review')];
        for(Group queue : caseQueues) {
            if(queue.DeveloperNAME == 'All_Cases') {
                allCaseQueue = queue;
            }
            else if(queue.DeveloperNAME == 'Ignored_State_Change_Queue') {
                ignoreCaseQueue = queue;
            }
            else if(queue.DeveloperNAME == 'State_Change_Review') {
                reviewCaseQueue = queue;
            }
        }

        List<Id> parentCaseIds = new List<Id>();

        // Map Health change to its parent case
        for(Health_Change__c hc : scope) {
            parentCaseIds.add(hc.Case__c);
        }

        List<Case> parentCases = [SELECT Id, Origin, Status, Type, AccountId, 
            (SELECT Id, Status__c FROM Health_Changes__r),
            OwnerId 
            FROM Case WHERE Id IN :parentCaseIds];
        Map<Id, Case> caseMap = new Map<Id, Case>(parentCases);

        for(Health_Change__c hc : updated) {
            Case parent = hc.Case__c != null ? caseMap.get(hc.Case__c) : null;

            List<Health_Change__c> ignoredHC = new List<Health_Change__c>();
            List<Health_Change__c> deferredHC = new List<Health_Change__c>();
            List<Health_Change__c> needReviewHC = new List<Health_Change__c>();
            List<Health_Change__c> reviewedHC = new List<Health_Change__c>();

            if(parent != null) {
                // Count each type of Health change for parent case to see if case status needs to be updated 
                for(Health_Change__c caseHC : parent.Health_Changes__r) {
                    if(caseHC.Status__c == 'Ignored') {
                        ignoredHC.add(caseHC);
                    }
                    else if(caseHC.Status__c == 'Deferred') {
                        deferredHC.add(caseHC);                   
                    }
                    else if(caseHC.Status__c == 'Reviewed') {
                        reviewedHC.add(caseHC);                   
                    }
                    else if(caseHC.Status__c == 'Needs Review') {
                        needReviewHC.add(caseHC);                   
                    }
                }

                if(parent.Health_Changes__r.size() == 1) {
                    // If it is the only case - check reassignment even if it is owned by needs review
                    if(parent.OwnerId == ignoreCaseQueue.Id || parent.OwnerId == allCaseQueue.Id || parent.OwnerId == reviewCaseQueue.Id) {
                        if(!casesToUpdate.contains(parent)) {
                            if(hc.Status__c == 'Needs Review') {
                                parent.OwnerId = reviewCaseQueue.Id;
                                parent.Status = 'Open';
                                parent.Pending_Reason__c = '';
                                casesToUpdate.add(parent);
                            }
                            else if(hc.Status__c == 'Ignored') {
                                parent.OwnerId = ignoreCaseQueue.Id;
                                parent.Status = 'Send Communication';
                                casesToUpdate.add(parent);
                            }
                            else {
                                parent.OwnerId = allCaseQueue.Id;
                                casesToUpdate.add(parent);
                            }
                        } 

                    }
                }
                // Otherwise do not reassign if another case exists that needs review/is already owned by needs review queue
                else {
                    if(parent.OwnerId == ignoreCaseQueue.Id || parent.OwnerId == allCaseQueue.Id ) {
                        if(!casesToUpdate.contains(parent)) {
                            if(hc.Status__c == 'Needs Review') {
                                parent.OwnerId = reviewCaseQueue.Id;
                                parent.Status = 'Open';
                                parent.Pending_Reason__c = '';
                                casesToUpdate.add(parent);
                            }
                            else if(hc.Status__c == 'Ignored') {
                                parent.OwnerId = ignoreCaseQueue.Id;
                                casesToUpdate.add(parent);
                            }
                            else {
                                parent.OwnerId = allCaseQueue.Id;
                                casesToUpdate.add(parent);
                            }
                        } 

                    }
                }

            }
        }

        update casesToUpdate;
    }

    public static void populatePatient(List<Health_Change__c> scope) {

        List<Id> parentCaseIds = new List<Id>();

        // Map Health change to its parent case
        for(Health_Change__c hc : scope) {
            parentCaseIds.add(hc.Case__c);
        }

        // Retrieve all parent cases
        List<Case> parentCases = [SELECT Id, 
            AccountId, 
            OwnerId
            FROM Case WHERE Id IN :parentCaseIds];
        Map<Id, Case> caseMap = new Map<Id, Case>(parentCases);

        for(Health_Change__c hc : scope) {
            Case parent = caseMap.get(hc.Case__c);
            if(parent != null && parent.AccountId != null) {
                hc.Patient__c = parent.AccountId;
            }
        }
    }
}