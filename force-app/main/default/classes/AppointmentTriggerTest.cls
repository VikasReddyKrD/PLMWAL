@isTest
private class AppointmentTriggerTest {
    public static String ACCT_FNAME = 'John';
    public static String ACCT_LNAME = 'Doe';
    
    @testSetup
    static void testSetup() {
        Id patientRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Patient').getRecordTypeId();
        Account patient = new Account(FirstName=ACCT_FNAME, LastName=ACCT_LNAME, RecordTypeId=patientRecordTypeId);
        insert patient;

        Request__c routineDraw = new Request__c(
            Draw_type__c = 'Routine',
            Patient__c = patient.Id,
            Request_Status__c = 'Not Sent',
            Name = patient.Name + ' - Routine',
            Requested_At__c = Date.today().addDays(-45),
            Draw_By_Date__c = Date.today().addDays(-24),
            Vendor_Sent_To__c = 'EMSI'
        );
        insert routineDraw;
    }
    
    @isTest
    static void testUpdateRequests() {
        Test.startTest();
            Account patient = [SELECT Id, Last_Draw_Date__c, FirstName, LastName FROM Account WHERE FirstName=:ACCT_FNAME AND LastName=:ACCT_LNAME];
            Request__c request = [SELECT Id FROM Request__c WHERE Patient__C=:patient.Id];
            Appointment__c appt = new Appointment__c(Status__c='Completed', Request__c=request.Id, Patient__c=patient.Id, Scheduled_Date__c=Date.today());
            insert appt;
            request = [SELECT Id, Request_Status__c FROM Request__c WHERE Patient__C=:patient.Id LIMIT 1];
        Test.stopTest();

        appt.Completed_Date__c = Date.today();
        update appt;
        
        System.assertEquals('Closed - Completed Draw', request.Request_Status__c);

        System.debug('Appt Test Completed');
    }
}