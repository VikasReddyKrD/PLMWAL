@isTest
public class GoalTrackingTriggerHelperTest {
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
    }
    @isTest
    static void updateTaskForGoalTrackingsTest_DiffWeeks()	{
        
        List<User> users = [SELECT Id,Name,AccountId FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        Account acc=[select id from Account where id=:users[0].AccountId limit 1];
        System.runAs(users[0])	{
            List<Goal_Response__c> goals = new List<Goal_Response__c>();

            Goal_Response__c gr = MddTestDataFactory.getTestGoalResponses(acc, 'Session 1', 1, 'Keep my appointments with the clinic','By recording appointments in a calendar');
            goals.add(gr);
            Goal_Response__c gr1 = MddTestDataFactory.getTestGoalResponses(acc, 'Session 2', 1, 'Keep my appointments with the clinic','By recording appointments in a calendar');
            goals.add(gr1);
            Insert goals;
            List<Goal_Tracking__c> gtrackings = MddTestDataFactory.getTestGoalTrackings(gr.Id, 1); //only one goal tracking expected
            Insert gtrackings;
        }
        List<Task> tasks=[select id from Task where whatid=:acc.id and status='Completed'];
        System.assertEquals(3,tasks.size(),'goalTracking is not posted');
        
    }
    @isTest
    static void updateTaskForGoalTrackingsTest_SameWeek_Tracking1Goal()	{
        
        List<User> users = [SELECT Id,Name,AccountId FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        Account acc=[select id from Account where id=:users[0].AccountId limit 1];
        System.runAs(users[0])	{
            List<Goal_Response__c> goals = new List<Goal_Response__c>();

            Goal_Response__c gr = MddTestDataFactory.getTestGoalResponses(acc, 'Session 1', 1, 'Keep my appointments with the clinic','By recording appointments in a calendar');
            goals.add(gr);
            Goal_Response__c gr1 = MddTestDataFactory.getTestGoalResponses(acc, 'Session 1', 2, 'Reduce screen time','To 20 minutes before bed');
            goals.add(gr1);
            Insert goals;
            List<Goal_Tracking__c> gtrackings = MddTestDataFactory.getTestGoalTrackings(gr.Id, 1); //only one goal tracking expected
            Insert gtrackings;
        }
        List<Task> tasks=[select id from Task where whatid=:acc.id and status='Completed'];
        System.assertEquals(1,tasks.size(),'goalTracking is not posted');  
        //since we are tracking only one goal out of 2 goals, we should not be able to complete Task for "Track Goals for 1 Week"
        //The expected 1 is also for Creating Goals 1-3
        
    }
    
    @isTest
    static void updateTaskForGoalTrackingsTest_SameWeek_TrackingBothGoals()	{
        
        List<User> users = [SELECT Id,Name,AccountId FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        Account acc=[select id from Account where id=:users[0].AccountId limit 1];
        System.runAs(users[0])	{
            List<Goal_Response__c> goals = new List<Goal_Response__c>();

            Goal_Response__c gr = MddTestDataFactory.getTestGoalResponses(acc, 'Session 1', 1, 'Keep my appointments with the clinic','By recording appointments in a calendar');
            goals.add(gr);
            Goal_Response__c gr1 = MddTestDataFactory.getTestGoalResponses(acc, 'Session 1', 2, 'Reduce screen time','To 20 minutes before bed');
            goals.add(gr1);
            Insert goals;
            
            List<Goal_Tracking__c> gtrackings = MddTestDataFactory.getTestGoalTrackings(gr.Id, 1); //only one goal tracking expected
            
            
            gtrackings.addAll(MddTestDataFactory.getTestGoalTrackings(gr1.Id, 1));
            Insert gtrackings;
            
        }
        List<Task> tasks=[select id from Task where whatid=:acc.id and status='Completed'];
        System.assertEquals(2,tasks.size(),'goalTracking is not posted');  
        //since we are tracking both goals, we should be able to complete Task for "Track Goals for 1 Week"
        //1 is for Creating Goals 1-3 and another 1 for Tracking Goals for 1st week
        
    }
}