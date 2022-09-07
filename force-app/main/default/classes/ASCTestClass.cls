@isTest
public class ASCTestClass {
    @isTest
    public static void getSurveyQuestions_test(){
        
        Account acc  = new Account();
        acc.name = 'test account';
        insert acc;
        
        contact con = new contact();
        con.LastName = 'test contact';
        con.Phone = '9347357900';
        con.Email = 'testc@gmail.com';
        insert con;
        
        Profile prof = [select id from profile where name LIKE '%Customer Community Plus Login User Custom%' ];
        system.debug('profile'+prof);
        User user = new User();
        user.firstName = 'test1';
        user.lastName = 'test2';
        user.profileId = prof.id;
        user.username = 'test@test.com';
        user.email = 'test@test.com';
        user.contactId = con.Id;
        user.Alias = 'alias';
        user.TimeZoneSidKey = 'America/Los_Angeles';
        user.EmailEncodingKey = 'UTF-8';
        user.LanguageLocaleKey = 'en_US';
        user.LocaleSidKey = 'en_US';
        insert user;
        
        system.debug('user====>'+user);
        
        User u = [Select AccountId from user where Id=: user.Id];
        system.debug('u===>'+u);
        
        Advanced_Survey__c advancesurvey = new Advanced_Survey__c();
        advancesurvey.Name = 'advance survey 1';
        advancesurvey.Survey_Number__c = 'testsurveyName';
        insert advancesurvey;
        
        Advanced_Survey_Question__c surveyQuestions = new Advanced_Survey_Question__c();
        surveyQuestions.Question_Text__c = 'test question';
        surveyQuestions.Advanced_Survey__c = advancesurvey.Id;
        insert surveyQuestions;
        System.debug(surveyQuestions);
        
        Advanced_Survey_Response__c surveyResponse = new Advanced_Survey_Response__c();
        surveyResponse.PLM_User__c = u.AccountId;
        surveyResponse.Advanced_Survey__c = advancesurvey.Id;
        insert surveyResponse; 
       
        System.debug(surveyResponse);
        
        Advanced_Survey_Answer__c surveyAnswer = new Advanced_Survey_Answer__c();
        surveyAnswer.PLM_User__c = u.AccountId;
        surveyAnswer.Advanced_Survey_Response__c = surveyResponse.Id;
        insert surveyAnswer;
        
        System.debug(surveyAnswer);
        
        test.startTest();
        AlphaSurveyController.getExistingSurveyResponse();
        AlphaSurveyController.getStatusOfSurveys(u.Id);
        AlphaSurveyController.insertSurveyAnswer(surveyAnswer);
        AlphaSurveyController.getSurveyQuestions(advancesurvey.Id);
        
        test.stopTest();
    }
}