@isTest
public with sharing class SSoUserCreation_Test {
    public SSoUserCreation_Test() {
     User user = AlphaSurveyMultiQuestionTestFactory.createUser();
        Advanced_Survey__c survey = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurvey();
        Advanced_Survey_Question__c question = AlphaSurveyMultiQuestionTestFactory.createAdvancedSurveyQuestion(survey);

    }
    @isTest
    static void makeData(){
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/insertuser';  //Request URL
    req.httpMethod = 'POST';//HTTP Request Type
    SSOUserCreation.Wrapper wrapper = new SSOUserCreation.Wrapper();
    wrapper.firstname = 'vinay';
    wrapper.lastname = 'praveen';
    wrapper.email = 'vinay@plm.com';
    wrapper.salutation = 'mr';
    req.requestBody = Blob.valueof(JSON.serialize(wrapper));
    RestContext.request = req;
    RestContext.response= res;
    SSOUserCreation.insertAccount();
    //SSOUserCreation.getAdvanceSurvey();
    }
    
    @isTest static void test(){
		SSOUserCreation.getAdvanceSurvey();
    }
}