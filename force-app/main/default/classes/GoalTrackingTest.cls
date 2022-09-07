/*
* Developer Name : 
* Date			  : 14 April 2021
* Description	  : Test class.
*/
@isTest
public class GoalTrackingTest {
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
            //List<Goal_Tracking__c> gtrackings = MddTestDataFactory.getTestGoalTrackings(gr.Id, 3);
            //Insert gtrackings;
        }
    }
    
    @isTest
    static void createGoalTrackingTest()	{
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        List<Goal_Response__c> goals = [SELECT Id,name from Goal_Response__c WHERE ownerId= :users[0].Id];
        System.runAs(users[0])	{
            //{"sobjectType":"Goal_Tracking__c","WK__c":2,"Goal_Response__c":"a2Se0000000sM9WEAU","Progress__c":"3x per week","Progress_Value__c":"3"}
            String str = '{"sObjectType":"Goal_Tracking__c", "Wk__c":"1", "Goal_Response__c":"'+goals[0].Id+'", "Progress__c":"2x per week", "Progress_Value__c":"2"}';
            Goal_Tracking__c gt = (Goal_Tracking__c) JSON.deserialize(str, Goal_Tracking__c.class);
            Test.startTest();
            GoalTracking.createGoalTracking(gt);
            Test.stopTest();
        }
        List<Goal_Tracking__c> goalTrackings =[SELECT Id, name from Goal_Tracking__c where goal_response__c=:goals[0].id];
        System.assertEquals(1, goalTrackings.size(), 'No of Tracking records did not match');

    }
    
    
    /*
    @isTest
    static void getGoalsTrackingTest()	{
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        String chartString;
        System.runAs(users[0])	{
            String acctStr= AccountsController.getAccountOfUser(users[0].id);
            Account acct  = (Account)JSON.deserialize(acctStr, Account.class);
            Test.startTest();
            chartString = GoalTracking.getGoals(acct.id, '1-12','6');
            Test.stopTest();
            
        }
        
    }*/

}