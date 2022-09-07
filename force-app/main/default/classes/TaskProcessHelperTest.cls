@isTest
public class TaskProcessHelperTest {
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
 
    
    
    @istest
    static void updateTaskAscompletedTest()	{
        List<User> users = [SELECT Id,Name,AccountId FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        Account acc=[select id from Account where id=:users[0].AccountId limit 1];
        System.runAs(users[0])	{
            List<TaskProcessHelper.TaskWrapper> tasks = new List<TaskProcessHelper.TaskWrapper>();
			tasks.add(new TaskProcessHelper.TaskWrapper(acc.Id, 0, 'Goal','1','1'));  
            tasks.add(new TaskProcessHelper.TaskWrapper(acc.Id, 0, 'Link','1','1'));   
            Map<Id,List<TaskProcessHelper.TaskWrapper>> taskMap = new Map<Id,List<TaskProcessHelper.TaskWrapper>>();
            taskMap.put(acc.Id, tasks);
            Test.startTest();
            TaskProcessHelper.updateTaskAsCompleted(taskMap);
            Test.stopTest();
        }
        List<Task> tasks=[select id,Subject,weekNumber__c from Task where whatid=:acc.id and status='Completed'];
        //System.debug('closed tasks are'+ JSON.serializePretty(tasks));
        System.assertEquals(1,tasks.size(),'Incorrect number of tasks got updated');
    }
    @istest
    static void completeTaskFromLWCTest()	{
        List<User> users = [SELECT Id,Name,AccountId FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        Account acc=[select id from Account where id=:users[0].AccountId limit 1];
        System.runAs(users[0])	{
            List<TaskProcessHelper.TaskWrapper> tasks = new List<TaskProcessHelper.TaskWrapper>();
			tasks.add(new TaskProcessHelper.TaskWrapper(acc.Id, 0, 'Goal','1','1'));  
            //Map<Id,List<TaskProcessHelper.TaskWrapper>> taskMap = new Map<Id,List<TaskProcessHelper.TaskWrapper>>();
            //taskMap.put(acc.Id, tasks);
            Test.startTest();
            TaskProcessHelper.completeTaskFromLWC((String)acc.Id, JSON.serialize(tasks));
            Test.stopTest();
        }
        List<Task> tasks=[select id,Subject,weekNumber__c from Task where whatid=:acc.id and status='Completed'];
        //System.debug('closed tasks are'+ JSON.serializePretty(tasks));
        System.assertEquals(1,tasks.size(),'Incorrect number of tasks got updated');
    }
}