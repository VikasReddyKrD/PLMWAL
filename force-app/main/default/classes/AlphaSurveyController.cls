public without sharing class AlphaSurveyController {
    @AuraEnabled
    public static String getSurveyQuestions(String surveyId){
        String qry ='SELECT Id,Display_Type__c,Options__c,Option_Other__c,label__c,Next_Question__c,Active__c,Order__c,Order_Text__c,Question_Text__c,Advanced_Survey__c,Section_Name__c,Transition_Message__c FROM Advanced_Survey_Question__c Where Advanced_Survey__c=:surveyId AND Active__c = true ORDER BY Order__c';
          List<Advanced_Survey_Question__c> qList = Database.query(qry);
          User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
          System.debug('surveyId ==========>'+surveyId);
          Advanced_Survey_Response__c advancedSurveyResponse =   [SELECT id 
                                                              FROM Advanced_Survey_Response__c 
                                                              WHERE Advanced_Survey__c=:surveyId 
                                                              AND PLM_User__c=:user.AccountId];
        System.debug('advancedSurveyResponse'+advancedSurveyResponse);
          List<Advanced_Survey_Answer__c> answersList=[SELECT id,Question_Order__c,Text_Response_Value__c,Number_Response_Value__c,Other_Response_Value__c,Date_Response_Value__c 
                                                        FROM Advanced_Survey_Answer__c 
                                                        WHERE PLM_User__c=:user.AccountId AND Advanced_Survey_Response__c =:advancedSurveyResponse.id];
          List<Wrapper> wrapperList = new List<Wrapper>();
          for(Advanced_Survey_Question__c question:qList){
            Wrapper wrap = new Wrapper();
            wrap.question = question;
            for(Advanced_Survey_Answer__c answer:answersList){
              if(question.Order__c == answer.Question_Order__c){
                  wrap.answer = answer;
              }
            }
            wrapperList.add(wrap);
          }
         return JSON.serialize(wrapperList);
    }
     
    @AuraEnabled
    public static Boolean insertSurveyAnswer(Advanced_Survey_Answer__c answer){
      // List<Advanced_Survey_Answer__c> advancedSurveyAnswer = new List<Advanced_Survey_Answer__c>();
      try {
        Advanced_Survey_Question__c question = [SELECT id,Order__c,Section_Name__c,Transition_Message__c
                                                FROM Advanced_Survey_Question__c
                                                WHERE id=:answer.Advanced_Survey_Question__c];
        system.debug('Advanced survey question'+ question);
        List<Advanced_Survey_Answer__c> answerViewList =[SELECT id,Question_Order__C,PLM_User__c
        FROM Advanced_Survey_Answer__c
        WHERE PLM_User__c=:answer.PLM_User__c];
        boolean flag= false;
        for(Advanced_Survey_Answer__c answers:answerViewList){
          if(answers.Question_Order__C == question.Order__c){
            flag = true;
          }
        }
        if(flag){
          for(Advanced_Survey_Answer__c answers:answerViewList){
            if(answers.Question_Order__C == question.Order__c){
              if(Date.valueOf(answer.Date_Response_Value__c)!=Null){
                answers.Date_Response_Value__c = answer.Date_Response_Value__c;
              }
              else if(Integer.valueOf(answer.Number_Response_Value__c)!=Null){
                answers.Number_Response_Value__c = answer.Number_Response_Value__c;
              }
              else if(String.valueOf(answer.Text_Response_Value__c)!=Null){
                answers.Text_Response_Value__c = answer.Text_Response_Value__c;
              }
              if(String.valueOf(answer.Other_Response_Value__c)!=Null){
                answers.Other_Response_Value__c = answer.Other_Response_Value__c;
              }
              //advancedSurveyAnswer.add(answers);if()
            }
          }
          update answerViewList;
          //delete advancedSurveyAnswer;
          return true;
        }
        else{
          system.debug('answer object that we received is '+JSON.serializePretty(answer));
          Insert answer;
          return true;
        }
      }
      catch (Exception e) {
        //System.debug('exception we encountered in insertSurveyAnswer is '+JSON.serializePretty(e));
        System.debug('error in apex'+e.getMessage()+' '+e.getLineNumber());
        return null;
      }
      
      }
      @AuraEnabled
      public static List<Advanced_Survey_Answer__c> getExistingSurveyResponse(){
        String surveyId ='a1ee000000fSWlAAAW';//If we want to make this available to all the surveys
                                                // we need to make it dynamic
      User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
       Advanced_Survey_Response__c advancedSurveyResponse =   [SELECT id 
                                                              FROM Advanced_Survey_Response__c 
                                                               WHERE Advanced_Survey__c=:surveyId 
                                                              AND PLM_User__c=:user.AccountId];
        return [SELECT id,Question_Order__c,Text_Response_Value__c,Number_Response_Value__c,Other_Response_Value__c,Date_Response_Value__c 
                FROM Advanced_Survey_Answer__c 
                 WHERE PLM_User__c=:user.AccountId AND Advanced_Survey_Response__c =:advancedSurveyResponse.id];
      } 
      @AuraEnabled
      public static List<Advanced_Survey_Response__c> getSurveyResponse(String accountId , List<String> surveylist) {
          List<Advanced_Survey_Response__c> surveys;
          surveys = [SELECT id,Status__c,Advanced_Survey__c,End_Date__c, advanced_survey__r.name,Advanced_Survey__r.Survey_Number__c ,Advanced_Survey_Name__c,PLM_User__r.GoalStartDate__c, PLM_User__c,PLM_User__r.name FROM Advanced_Survey_Response__c WHERE PLM_User__c=:accountId  AND Advanced_Survey__r.Survey_Number__c =:surveylist];
          return surveys;   
          
  
         }
  
      @AuraEnabled
      public static Map<string,boolean> getStatusOfSurveys(String userId){
        system.debug('class is called');
          List<string> listOfSurveys;
          if(!test.isRunningTest()){
              listOfSurveys = new List<string>{'MDD-Survey-1','MDD-Survey-2','MDD-Survey-3'};
            }
          if(test.isRunningTest()){
              listOfSurveys = new List<string>{'MDD Test Survey 1'};
          }
        Map<string,boolean> surveyStatus = new Map<string,boolean>();
        List<User> users = [SELECT Id,contactId,AccountId FROM User WHERE id = :userId];
          if(users != null)   {
              /*string accId = [SELECT Id, AccountId,Account.CreatedDate, Account.Name,Account.Current_wk__c,Account.Current_Wk_Session2__c,Account.GoalStartDate__c,Account.GoalStartDate_Session2__c FROM Contact WHERE id=:users[0].contactId]?.AccountId;*/
          // if(accId != null){
            if(users[0].AccountId != null){
            for( Advanced_Survey_Response__c surveyResponses : [SELECT id,PLM_User__c,Status__c,Advanced_Survey__r.Survey_Number__c FROM Advanced_Survey_Response__c WHERE PLM_User__c =: users[0].AccountId AND Advanced_Survey__r.Survey_Number__c IN: listOfSurveys]){ 
              boolean status = (surveyResponses.Status__c == 'Complete') ? True : False;
              surveyStatus.put(surveyResponses.Advanced_Survey__r.Survey_Number__c,status);
            }
          }     
      }
      return surveyStatus;
      }
      public class Wrapper{
        public Advanced_Survey_Question__c  question;
        public Advanced_Survey_Answer__c answer;
      }
    }