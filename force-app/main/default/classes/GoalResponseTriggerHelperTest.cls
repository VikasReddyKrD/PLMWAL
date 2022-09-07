@isTest
public class GoalResponseTriggerHelperTest {
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
    static void updateTaskForGoalResponsesTest_diffWeeks()	{
           
            List<User> users = [SELECT Id,Name,AccountId FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
            Account acc=[select id from Account where id=:users[0].AccountId limit 1];
        	System.runAs(users[0])	{
                List<Goal_Response__c> goals = new List<Goal_Response__c>();
            	Goal_Response__c gr = MddTestDataFactory.getTestGoalResponses(acc, 'Session 1', 1, 'Keep my appointments with the clinic','By recording appointments in a calendar');
            	goals.add(gr);
            	Goal_Response__c gr1 = MddTestDataFactory.getTestGoalResponses(acc, 'Session 2', 1, 'Keep my appointments with the clinic','By recording appointments in a calendar');
            	goals.add(gr1);
                Insert goals;
            }
        	List<Task> tasks=[select id from Task where whatid=:acc.id and status='Completed'];
             System.assertEquals(2,tasks.size(),'Tasks are not posted as completed for different weeks');
        }
    
    @isTest
    static void updateTaskForGoalResponsesTest_sameWeek()	{
           
            List<User> users = [SELECT Id,Name,AccountId FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
            Account acc=[select id from Account where id=:users[0].AccountId limit 1];
        	System.runAs(users[0])	{
                List<Goal_Response__c> goals = new List<Goal_Response__c>();
            	Goal_Response__c gr = MddTestDataFactory.getTestGoalResponses(acc, 'Session 1', 1, 'Keep my appointments with the clinic','By recording appointments in a calendar');
            	goals.add(gr);
            	Goal_Response__c gr1 = MddTestDataFactory.getTestGoalResponses(acc, 'Session 1', 2, 'Reduce screen time','To 20 minutes before bed');
            	goals.add(gr1);
                Insert goals;
            }
        	List<Task> tasks=[select id from Task where whatid=:acc.id and status='Completed'];
             System.assertEquals(1,tasks.size(),'Tasks are not posted as completed for same week');
        }
    }