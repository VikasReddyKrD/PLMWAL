@isTest
private class TriggeredSendTests {
    
    @isTest 
    static void testAccountTrigger() {
        Id patientRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Patient').getRecordTypeId();
        
        Account patient = new Account(FirstName='Test', LastName='Account', RecordTypeId=patientRecordTypeId);
        insert patient;

        Test.startTest();

            patient.FirstName = 'Testing';
            update patient;

        Test.stopTest();

        patient = [SELECT FirstName FROM Account WHERE Id=:patient.Id];
        System.assertEquals('Testing', patient.FirstName);
    }

    @isTest 
    static void testAppointmentTrigger() {

        Id patientRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Patient').getRecordTypeId();
        
        Account patient = new Account(FirstName='Test', LastName='Account', RecordTypeId=patientRecordTypeId);
        insert patient;
        
        Appointment__c appt = new Appointment__c(Patient__c=patient.Id);
        insert appt;

        Test.startTest();

            appt.Reviewed__c = true;
            update appt;

        Test.stopTest();

        appt = [SELECT Reviewed__c FROM Appointment__c WHERE Id=:appt.Id];
        System.assertEquals(true, appt.Reviewed__c);
    }

    @isTest 
    static void testRequestTrigger() {
        
        Request__c req = new Request__c();
        insert req;

        Test.startTest();

            req.Name = 'Testing';
            update req;

        Test.stopTest();

        req = [SELECT Name FROM Request__c WHERE Id=:req.Id];
        System.assertEquals('Testing', req.Name);
    }
    
    @isTest 
    static void testPLM_EventTrigger() {
    
        Id patientRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Patient').getRecordTypeId();
        
        Account patient = new Account(FirstName='Test', LastName='Account', RecordTypeId=patientRecordTypeId);
        insert patient;
        
        PLM_Event__c plmevent = new PLM_Event__c(Patient__c=patient.id,Subject__c='revoked_consent');
        insert plmevent;

        Test.startTest();

            plmevent.subject__c = 'revoked_consent';
            update plmevent;

        Test.stopTest();

        plmevent = [SELECT Subject__c FROM PLM_Event__c WHERE Id=:plmevent.Id];
        System.assertEquals('revoked_consent', plmevent.Subject__c);
    }
    
}