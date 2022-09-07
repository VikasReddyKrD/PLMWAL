/*
* Developer Name : 
* Date			  : 14 April 2021
* Description	  : Test class.
*/
@isTest
public with sharing class GoalQuestionsTest {
    @testSetup
    static void testDataSetup() {
        User adminUser =MddTestDataFactory.getAdminUser();
        Account acct;
        User commUser;
        System.runAs(adminUser)    {
            acct = MddTestDataFactory.getTestPersonAccount();
            Insert acct;
            commUser = MddTestDataFactory.getTestCommunityUser(acct);
            Insert commUser;
        }
    }
    @isTest
    static void getQuestionsTest() {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
       	String gQuest ='';
        Test.startTest();
        System.runAs(users[0])	{
            gQuest = GoalQuestions.getQuestions();
        }
        Test.stopTest();
       	GoalQuestions.GoalSettingWrapper wrp = (GoalQuestions.GoalSettingWrapper) JSON.deserialize(gQuest, GoalQuestions.GoalSettingWrapper.class);
        System.AssertEquals(8,wrp.mdtFieldsList.size());
    }
    @isTest
    static void getOptionsettingTest_Performance() {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        List<Goal_Question__mdt> gQuestions = [SELECT id,DeveloperName,Options__c,MasterLabel,Display_Type__c,Field_Name__c,Question_Text__c,Sequence__c
                                               FROM Goal_Question__mdt Order by Sequence__c];
        List<GoalSettingOptions__mdt> goalSettingOptions = [Select Id,DeveloperName,MasterLabel,optionValue__c from GoalSettingOptions__mdt  ORDER BY DeveloperName ASC NULLS FIRST];
        List<Goal_Suggestion__mdt> goalSuggestions = [Select Id,Performance__c,Condition__c from Goal_Suggestion__mdt];
        String searchKeyWord = 'Performance';
        String searchKeyOption = 'Reduce screen time';
        String perfValue = '';
        String Out = '[{"value":"Reduce screen time","label":"Reduce screen time"}]';
        String gOptionPerformance;
        Test.startTest();
        System.runAs(users[0])	{
            //String gQuest = GoalQuestions.getQuestions();
            gOptionPerformance = GoalQuestions.getOptionsetting(searchKeyWord, searchKeyOption, perfValue);
        }
        Test.stopTest();
        System.AssertEquals(gOptionPerformance,out);
    }
    
    @isTest
    static void getOptionsettingTest_Condition() {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        List<Goal_Question__mdt> gQuestions = [SELECT id,DeveloperName,Options__c,MasterLabel,Display_Type__c,Field_Name__c,Question_Text__c,Sequence__c
                                               FROM Goal_Question__mdt Order by Sequence__c];
        List<GoalSettingOptions__mdt> goalSettingOptions = [Select Id,DeveloperName,MasterLabel,optionValue__c from GoalSettingOptions__mdt  ORDER BY DeveloperName ASC NULLS FIRST];
        List<Goal_Suggestion__mdt> goalSuggestions = [Select Id,Performance__c,Condition__c from Goal_Suggestion__mdt];
        Goal_Response__c goalResponse = new Goal_Response__c();
        String Out = '[{"value":"By reading before bed","label":"By reading before bed"}]';
        String gOptionCondition;
        Test.startTest();
        System.runAs(users[0])	{
           gOptionCondition  = GoalQuestions.getOptionsetting('Condition', 'By reading before bed', 'Reduce screen time');
            //GoalQuestions.insertGoalResponse(goalResponse);
        }
        Test.stopTest();
        System.AssertEquals(gOptionCondition,out);
    }
    
    @isTest
    static void insertGoalResponseTest() {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        String acctStr = AccountsController.getAccountOfUser(users[0].Id);
        Account acct = (Account)JSON.deserialize(acctStr, Account.class);
        Goal_Response__c goalResponse = MddTestDataFactory.getTestGoalResponses(acct, 'Session 1', 1, 'Reduce screen time', 'By reading before bed');
        Test.startTest();
        System.runAs(users[0])	{
            GoalQuestions.insertGoalResponse(goalResponse);
        }
        Test.stopTest();
        List<Goal_Response__c> goals = [Select id,name from Goal_Response__c Where Performance__c='Reduce screen time'];
        System.AssertEquals(1,goals.size(), 'Goal_response__c records not created properly');
    }
}