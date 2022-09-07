@isTest
public with sharing class TaskControllerTest {
    @testSetup
    static void testDataSetup() {
        User adminUser =MddTestDataFactory.getAdminUser();
        Account acct;
        User commUser;
        System.runAs(adminUser)    {
            acct = MddTestDataFactory.getTestPersonAccount();
            acct.GoalStartDate__c = System.Today();
            Insert acct;
            commUser = MddTestDataFactory.getTestCommunityUser(acct);
            Insert commUser;
        }
        System.runAs(commUser)  {
            Goal_Response__c gr = MddTestDataFactory.getTestGoalResponses(acct, 'Session 1', 1, 'Keep my appointments with the clinic','By recording appointments in a calendar');
            Insert gr;
            List<Goal_Tracking__c> gtrackings = MddTestDataFactory.getTestGoalTrackings(gr.Id, 3);
            Insert gtrackings;
        }
    }
    
    @isTest
    static void getTasksTest_week2()	{
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        String chartString;
        List<Task> tasks;
        List<Task> tasks1;
        System.runAs(users[0])	{
            String acctStr= AccountsController.getAccountOfUser(users[0].id);
            Account acct  = (Account)JSON.deserialize(acctStr, Account.class);
            Test.startTest();
            tasks= TaskController.getTasks(acct.id, 2, 1);
            tasks1 = TaskController.getTasks(acct.id, 2, 2);
            Test.stopTest();            
        }
        System.assertEquals(4, tasks.size(), 'no of Tasks are not matching');
        System.assertEquals('Not Started', tasks[0].status, 'Status is not matching');
    }
    @isTest
    static void getTasksTest_week0()	{
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        String chartString;
        List<Task> tasks;
        List<Task> tasks1;
        System.runAs(users[0])	{
            String acctStr= AccountsController.getAccountOfUser(users[0].id);
            Account acct  = (Account)JSON.deserialize(acctStr, Account.class);
            Test.startTest();
            tasks= TaskController.getTasks(acct.id, 0, 1);
            tasks1= TaskController.getTasks(acct.id, 0, 2);
            Test.stopTest();            
        }
        system.debug('size is '+tasks1.size());
        System.assertEquals(4, tasks.size(), 'no of Tasks are not matching');
        System.assertEquals('Not Started', tasks[0].status, 'Status is not matching');
    }
     @isTest
    static void getTasksMetadataTest() {
        List<string> taskKeys = new List<String>{'1-0-Video-1'};
            List<Goal_Tasks__mdt> mData = new List<Goal_Tasks__mdt>();
        Test.startTest();
        	mData = TaskController.getTasksMetadata(taskKeys);
        Test.stopTest();
    }
}