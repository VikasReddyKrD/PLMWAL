@isTest
public with sharing class ListOfValuesControllerTest {
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
    static void getListOfValues_withblankcondition()    {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        List<MddListOfValue__mdt> listofvalues;
        system.runAs(users[0])  {
            Test.startTest();
            listofvalues = ListOfValuesController.getListOfValues('TreatmentEvaluation', '');
            Test.stopTest();
        }
        System.assertEquals(1, listofvalues.size(), 'No of records are not matching');
    }
    @isTest
    static void getListOfValues_withcondition()    {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        List<MddListOfValue__mdt> listofvalues1, listofvalues2;
        system.runAs(users[0])  {
            Test.startTest();
            listofvalues1 = ListOfValuesController.getListOfValues('StudyResource', '1-1');
            listofvalues2 = ListOfValuesController.getListOfValues('StudyResource', '1-2');
            Test.stopTest();
        }
        System.assertEquals(1, listofvalues1.size(), 'No of records are not matching for week1');
        System.assertEquals(1, listofvalues2.size(), 'No of records are not matching for week2');
        System.assertEquals(true, listofvalues1[0].Value__c != listofvalues2[0].Value__c, 'Values are matching, which should not be the case');
    }
    
    @isTest
    static void getVideosandDocsTest()    {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        List<MddListOfValue__mdt> videosLov, docsLov;
        Map<String, List<MddListOfValue__mdt>> resourcesMap;
        system.runAs(users[0])  {
            Test.startTest();
            resourcesMap = ListOfValuesController.getVideosandDocs('Resources','');
            Test.stopTest();
        }
        videosLov= resourcesMap.get('videos');
        docsLov = resourcesMap.get('docs');
        System.assertEquals(true, videosLov.size()>0, 'No of records are not matching for videos');
        System.assertEquals(true, docsLov.size()>0, 'No of records are not matching for docs');
        
    }

}