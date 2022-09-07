@isTest
private class EventTriggerTest {

    public static final String ACCT_FNAME = 'Jon';
    public static final String ACCT_LNAME = 'Doe';
    public static final String COLB_NAME = 'Collection B Data';
    public static final String COLB2_NAME = 'Collection B Data Number 2';
    public static final String COLC_NAME = 'Collection C Data';

    @testSetup
    static void testSetup() {
        Id patientRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Patient').getRecordTypeId();

        Account patient = new Account(RecordTypeId=patientRecordTypeId, FirstName=ACCT_FNAME, LastName=ACCT_LNAME, Most_Recent_Consent_Date__c=Date.today(), Paused_Draws__c=0, Requests_in_Progress__c=0, Draw_Last_15_Days__c=0);
        insert patient;

        Id colBRecordTypeId = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection B').getRecordTypeId();
        Id colCRecordTypeId = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection C').getRecordTypeId();

        Collection_Data__c cd = new Collection_Data__c(Name=COLB_NAME, Patient__c=patient.Id, RecordTypeId=colBRecordTypeId, Status__c='Completed', DOD_Survey_Completion_Date__c=Date.today().addDays(-21));
        Collection_Data__c cd2 = new Collection_Data__c(Name=COLB2_NAME, Patient__c=patient.Id, RecordTypeId=colBRecordTypeId, Status__c='Completed', DOD_Survey_Completion_Date__c=Date.today().addDays(-30));
        Collection_Data__c cd3 = new Collection_Data__c(Name=COLC_NAME, Patient__c=patient.Id, RecordTypeId=colCRecordTypeId, Status__c='Completed', Check_In_Survey_Completion_Date__c=Date.today().addDays(-12));
        insert new List<Collection_Data__c>{cd, cd2, cd3};
    }
	
	@isTest 
    static void testUpdateCollectionB() {
		Test.startTest();
            Account patient = [SELECT Id FROM Account WHERE FirstName=:ACCT_FNAME AND LastName=:ACCT_LNAME];

            Event evt = new Event(Subject='completed_treatments_page', WhatId=patient.Id, DurationInMinutes=15, ActivityDateTime=Datetime.newInstance(Date.today(), Time.newInstance(8, 0, 0, 0)));
            insert evt;

            Collection_Data__c colB = [SELECT DOD_Treatment_Page_Completion_Date__c FROM Collection_Data__c WHERE Name=:COLB_NAME];
            System.assertEquals(Date.today(), colB.DOD_Treatment_Page_Completion_Date__c);
        Test.stopTest();
	}
	
	@isTest 
    static void testUpdateCollectionC() {
		Test.startTest();
            Account patient = [SELECT Id FROM Account WHERE FirstName=:ACCT_FNAME AND LastName=:ACCT_LNAME];

            Event evt = new Event(Subject='completed_treatments_update', WhatId=patient.Id, DurationInMinutes=15, ActivityDateTime=Datetime.newInstance(Date.today(), Time.newInstance(8, 0, 0, 0)));
            insert evt;

            Collection_Data__c colC = [SELECT Check_Treatments_Completion_Date__c FROM Collection_Data__c WHERE Name=:COLC_NAME];
            System.assertEquals(Date.today(), colC.Check_Treatments_Completion_Date__c);
        Test.stopTest();
	}
	
}