@isTest
private without sharing class TestCaseTrigger {

    private static final String ACCOUNT_NAME = 'Test Account';
    public static String ACCT_FNAME = 'John';
    public static String ACCT_LNAME = 'Doe';

    @TestSetup
    static void setupTest() {

        Id patientRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Patient').getRecordTypeId();
        
        Account patient = new Account(FirstName=ACCT_FNAME, LastName=ACCT_LNAME, RecordTypeId=patientRecordTypeId);
        insert patient;

        Account a  = new Account();
        a.Name = ACCOUNT_NAME;
        insert a;
    }

    @isTest
    static void testTrigger() {
        String accountId = [SELECT Id FROM Account WHERE FirstName = :ACCT_FNAME AND LastName = :ACCT_LNAME].Id;

        Id stateChangeRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName().get('State Change').getRecordTypeId();

        Case c = new Case();
        c.AccountId = accountId;
        c.Status = 'New';
        c.RecordTypeId = stateChangeRecordTypeId;
        insert c;

        Account referencedAccount = [SELECT Id, Open_State_Change_Case__c FROM Account WHERE Id = :accountId];

        System.assertEquals(false, referencedAccount.Open_State_Change_Case__c);
        
        Test.startTest();

            Group reviewCaseQueue = [SELECT Id FROM Group WHERE Type = 'Queue' AND DeveloperNAME = 'State_Change_Review' LIMIT 1];
            c.OwnerId = reviewCaseQueue.Id;
        
            update c;

        Test.stopTest();

        c = [SELECT Date_Entered_Review_Queue__c FROM Case WHERE Id=:c.Id];

        System.assertEquals(Date.today(), c.Date_Entered_Review_Queue__c);
        
    }
}