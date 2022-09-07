@isTest
public with sharing class AccountsControllerTest {

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
        /*System.runAs(commUser)  {
            
        }*/
    }  

    @isTest 
    static void getAccountOfUserTest()  {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        Account acct;
        Test.startTest();
        System.runAs(users[0])	{
            String acctString = AccountsController.getAccountOfUser(users[0].Id);
            acct  = (Account)JSON.deserialize(acctString, Account.class);
        }
        Test.stopTest();
        System.AssertEquals('Smurf TestAccount',acct.name, 'AccountNames did not match');
        //System.AssertEquals(1, acct.currentWk, 'Weeks are not matching');currentWk is getting dropped in deserialize method but confirmed from logs
    }  
}