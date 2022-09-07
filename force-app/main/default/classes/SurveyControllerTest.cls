@isTest
public with sharing class SurveyControllerTest {
    @testSetup
    static void testDataSetup() {
        User adminUser =MddTestDataFactory.getAdminUser();
        Account acct;
        User commUser;
        System.runAs(adminUser)    {
            acct = MddTestDataFactory.getTestPersonAccount();
            //acct.GoalStartDate__c = System.Today();
            Insert acct;
            commUser = MddTestDataFactory.getTestCommunityUser(acct);
            Insert commUser;
            //create survey1 and questions
            Advanced_Survey__c  survey =  MddTestDataFactory.getSurvey('MDD Test Survey 1');
            Insert survey;
            List<Advanced_Survey_Question__c> surveyquestions = MddTestDataFactory.getSurveyQuestions(survey.id);
            Insert surveyquestions;
            //create survey2 and questions
            Advanced_Survey__c  survey2 =  MddTestDataFactory.getSurvey('MDD Test Survey 2');
            Insert survey2;
            List<Advanced_Survey_Question__c> surveyquestions2 = MddTestDataFactory.getSurveyQuestions(survey2.id);
            Insert surveyquestions2;
            
        }
    }
    
    @isTest
    static void getSurveyQuestionsTest() {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        
        list<Advanced_Survey_Question__c> surveyquestions;
        System.runAs(users[0])	{
            List<Advanced_Survey__c>  surveys =  [select id,name,survey_number__c from Advanced_Survey__c where survey_number__c='MDD Test Survey 1'];
            
            String acctStr= AccountsController.getAccountOfUser(users[0].id);
            Account acct  = (Account)JSON.deserialize(acctStr, Account.class);
            Test.startTest();
            surveyquestions = SurveyController.getSurveyQuestions(surveys[0].id);
            Test.stopTest();
            
        }
        System.assertEquals(8, surveyquestions.size(), 'No of questions did not match');
        
    }
    @isTest
    static void getSurveyResponseTest() {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        
        list<Advanced_Survey_Response__c> surveyresponses;
        System.runAs(users[0])	{
            List<Advanced_Survey__c>  surveys =  [select id,name,survey_number__c from Advanced_Survey__c where survey_number__c in ('MDD Test Survey 1','MDD Test Survey 2')];
            String acctStr= AccountsController.getAccountOfUser(users[0].id);
            Account acct  = (Account)JSON.deserialize(acctStr, Account.class);
            List<Advanced_Survey_Response__c> responses = new List<Advanced_Survey_Response__c>();
            responses.add(MddTestDataFactory.getSurveyResponse(acct.id,surveys[0].id));
            responses.add(MddTestDataFactory.getSurveyResponse(acct.id,surveys[1].id));
            insert responses;
            List<String> surveyNumbers  = new list<string>();
            surveyNumbers.add('MDD Test Survey 1'); 
            surveyNumbers.add('MDD Test Survey 2');  
            
            Test.startTest();
            surveyresponses = SurveyController.getSurveyResponse(acct.id,surveyNumbers);
            Test.stopTest();
            System.assertEquals(2, surveyresponses.size(), 'No of responses did not match');
        }
        
    }
    @isTest
    static void insertSurveyAnswerTest_TextResponse() {
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        
        System.runAs(users[0])	{
            String acctStr= AccountsController.getAccountOfUser(users[0].id);
            Account acct  = (Account)JSON.deserialize(acctStr, Account.class);
            List<Advanced_Survey__c>  surveys =  [select id,name,survey_number__c from Advanced_Survey__c where survey_number__c='MDD Test Survey 1'];
            Advanced_Survey_Response__c response =MddTestDataFactory.getSurveyResponse(acct.id,surveys[0].id);
            insert response;
            
            //List<Advanced_Survey_Response__c>  responses =  [select id,name from Advanced_Survey_Response__c where advanced_survey__c=:surveys[0].id];
            List<Advanced_Survey_Question__c> surveyquestions = [select id,name,question_text__c,display_type__c from Advanced_Survey_Question__c where advanced_survey__c=:surveys[0].id AND display_type__c='Text' LIMIT 1];
            
            Advanced_Survey_Response__c  SurveyRes = MddTestDataFactory.getSurveyResponse(acct.id,surveys[0].id);
            
            Advanced_Survey_Answer__c answer = new Advanced_Survey_Answer__c();
            answer.Advanced_Survey_Response__c =response.id;
            answer.PLM_User__c =acct.id;
            answer.Date_Response_Value__c = System.Today();
            answer.Text_Response_Value__c='Test 123';
           	answer.Number_Response_Value__c =decimal.valueof('9876543210');
            answer.Other_Response_Value__c='Test Other';
            answer.Advanced_Survey_Question__c= surveyquestions[0].Id;            
            
            Test.startTest();            
            SurveyController.insertSurveyAnswer(answer);            
            Test.stopTest();
            List<Advanced_Survey_Answer__c> answersAssert = [select id,name,Text_Response_Value__c,Date_Response_Value__c,Other_Response_Value__c,Number_Response_Value__c from Advanced_Survey_Answer__c where PLM_User__c=:acct.id AND Advanced_Survey_Response__c=:response.id AND Advanced_Survey_Question__c=:surveyquestions[0].id];
            System.assertEquals('Test 123', answersAssert[0].Text_Response_Value__c, 'Text fields are not matching'); 
            System.assertEquals(System.Today(), answersAssert[0].Date_Response_Value__c, 'Date fields are not matching');
            System.assertEquals('Test Other', answersAssert[0].Other_Response_Value__c, 'Other fields are not matching');
          	System.assertEquals(decimal.valueof('9876543210'), answersAssert[0].Number_Response_Value__c, 'Number fields are not matching');
        }        
    }
    @isTest
    static void getStatusOfSurveysTest(){
        List<User> users = [SELECT Id,Name FROM User Where Profile.name ='Customer Community Plus Login User Custom' AND username='Smurf.TestAccount.wal.plm@gmail.com'];
        System.runAs(users[0])	{
            String acctStr= AccountsController.getAccountOfUser(users[0].id);
            Account acct  = (Account)JSON.deserialize(acctStr, Account.class);
            List<Advanced_Survey__c>  surveys =  [select id,name,survey_number__c from Advanced_Survey__c where survey_number__c='MDD Test Survey 1'];
            Advanced_Survey_Response__c response =MddTestDataFactory.getSurveyResponse(acct.id,surveys[0].id);
            response.status__c = 'Complete';
            insert response;
            Map<string,boolean> surveyStatus = new Map<string,boolean>();
            test.startTest();
            surveyStatus=SurveyController.getStatusOfSurveys(users[0].id);
            test.stopTest();
            system.assertEquals(surveyStatus.get('MDD Test Survey 1'),true,'Should be equal to true');
    }
    }
}