@isTest
public with sharing class GoalsControllerTest {
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
    static void getGoalsChartDataTest()	{
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        String chartString;
        System.runAs(users[0])	{
            String acctStr= AccountsController.getAccountOfUser(users[0].id);
            Account acct  = (Account)JSON.deserialize(acctStr, Account.class);
            Test.startTest();
            chartString = GoalsController.getGoalsChartData(acct.id, 'Session 1','6');
            Test.stopTest();
            
        }
        List<GoalsController.ChartDataInput> chartInputs = (List<GoalsController.ChartDataInput>) JSON.deserialize(chartString, List<GoalsController.ChartDataInput>.class);
        System.assertEquals(1, chartInputs.size(), 'no of goals are not matching');
        //System.assertEquals('Keep my appointments with the clinic',chartInputs[0].performance, 'performance values are not matching');
        //performance field is not accessible
    }

}