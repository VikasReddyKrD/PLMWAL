@isTest
public class UserTriggerHandlerTest {
    @Istest
    public Static void taskCreationForGoalsTest()    {
        account acc=MddTestDataFactory.getTestPersonAccount();
        insert acc;
        user comuser=MddTestDataFactory.getTestCommunityUser(acc);
        Test.startTest();
        insert comuser;
        Test.stopTest();
        List<Goal_Tasks__mdt> gTasks=[select id,Task_key__c,Task_Subject__c from Goal_Tasks__mdt];
        List<Task> tasks=[select id from Task where ownerid=:comuser.id];
        system.assertEquals(gTasks.size(),tasks.size(),'No of Tasks are not matching');
    }
}