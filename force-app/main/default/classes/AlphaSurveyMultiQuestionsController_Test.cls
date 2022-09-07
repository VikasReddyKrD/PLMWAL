@isTest
public class AlphaSurveyMultiQuestionsController_Test {
    
    public static testMethod  void createAlphaSurveyMultiQuestions(){
        
        Test.startTest();        
        Study_Consent__c consent = new Study_Consent__c();
        insert consent;
        User user = AlphaSurveyMultiQuestionTestFactory.createUser();
        Account acc=AlphaSurveyMultiQuestionTestFactory.createAccount(consent.id);
        Advanced_Survey__c survey = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurvey();
        Advanced_Survey_Question__c question = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyQuestion(survey);
        Advanced_Survey_Response__c response = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyResponse(survey, acc);
        Advanced_Survey_Answer__c answer = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyAnswer(question.Id, response.Id, acc.Id);        
        AlphaSurveyMultiQuestionsController.QuestionWrapper wrapper = new AlphaSurveyMultiQuestionsController.QuestionWrapper();
        List<AlphaSurveyMultiQuestionsController.QuestionInnerWrapper> innerWrapperList = new List<AlphaSurveyMultiQuestionsController.QuestionInnerWrapper>();
        AlphaSurveyMultiQuestionsController.QuestionInnerWrapper innerWrapper = new AlphaSurveyMultiQuestionsController.QuestionInnerWrapper();
        innerWrapper.question = question;
        innerWrapper.answer = answer;
        innerWrapperList.add(innerWrapper);
        wrapper.currentSection='1';
        wrapper.questions = innerWrapperList;
        AlphaSurveyMultiQuestionsController.surveyVariables sv = new AlphaSurveyMultiQuestionsController.surveyVariables();
        sv.surveyId='123';
        sv.message = 'test';
        sv.responseId = '123';
        sv.accountId='bcjds';
        System.runAs(user) {
            AlphaSurveyMultiQuestionsController.getQuestionsWithSections(survey.Id);
        }
        Test.stopTest();
    }
    
    @isTest static void test1() {
        Study_Consent__c consent = new Study_Consent__c();
        insert consent;
        User user = AlphaSurveyMultiQuestionTestFactory.createUser();
        Account acc=AlphaSurveyMultiQuestionTestFactory.createAccount(consent.id);
        Advanced_Survey__c survey = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurvey();
        Advanced_Survey_Question__c question = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyQuestion(survey);
        Advanced_Survey_Response__c response = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyResponse(survey, acc);
        Advanced_Survey_Answer__c answer = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyAnswer(question.Id, response.Id, acc.Id);        
        System.debug('testzz '+acc.Study_Consent__c);
        System.runAs(user) {
            AlphaSurveyMultiQuestionsController.fetchCheckedRecord();
        }
    }
    
    @isTest static void test2() {
        Study_Consent__c consent = new Study_Consent__c();
        insert consent;
        User user = AlphaSurveyMultiQuestionTestFactory.createUser();
        Account acc=AlphaSurveyMultiQuestionTestFactory.createAccount(consent.id);
        Advanced_Survey__c survey = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurvey();
        Advanced_Survey_Question__c question = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyQuestion(survey);
        Advanced_Survey_Response__c response = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyResponse(survey, acc);
        Advanced_Survey_Answer__c answer = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyAnswer(question.Id, response.Id, acc.Id);        
        
        System.runAs(user) {
            AlphaSurveyMultiQuestionsController.surveyFlow(survey.Survey_Number__c);
        }
    }
    
    @isTest static void test3() {
    	Study_Consent__c consent = new Study_Consent__c();
        insert consent;
        User user = AlphaSurveyMultiQuestionTestFactory.createUser();
        Account acc=AlphaSurveyMultiQuestionTestFactory.createAccount(consent.id);
        Advanced_Survey__c survey = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurvey();
        Advanced_Survey_Question__c question = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyQuestion(survey);
        Advanced_Survey_Response__c response = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyResponse(survey, acc);
        Advanced_Survey_Answer__c answer = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyAnswer(question.Id, response.Id, acc.Id);        
        System.runAs(user) {
            AlphaSurveyMultiQuestionsController.insertMulitipleSurveyAnswers(new List<Advanced_Survey_Answer__c>{answer},survey.Id,acc.Id,'1');
        }
    }
    
}