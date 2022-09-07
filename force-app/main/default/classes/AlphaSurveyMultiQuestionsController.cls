public class AlphaSurveyMultiQuestionsController {

    @AuraEnabled
    public static  QuestionWrapper getQuestionsWithSections (string surveyId){
        List<ID> questinIdList = new List<Id>();
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account acc= [SELECT id,Alpha_Current_Section__c from Account WHERE ID=:user.AccountId];
       Advanced_Survey__c survey =  [SELECT id,Survey_Number__c from Advanced_Survey__c WHERE id=:surveyId];
        List<Advanced_Survey_Question__c> questions;
        questions =[SELECT Id,Display_Type__c,Options__c,Option_Other__c,label__c,skipNumberTransplant__c,transplantNestedOptions__c,Next_Question__c,Active__c,Order__c,
                                                      Order_Text__c,modelContent__c,Question_Text__c,Advanced_Survey__c,Section_Name__c,Transition_Message__c,Transplant__c,isDisplayqno__c
                                                      FROM Advanced_Survey_Question__c 
                                                      Where Advanced_Survey__c=:surveyId AND Active__c = true  ORDER BY Order__c] ;
        
        for(Advanced_Survey_Question__c qtn : questions){
            questinIdList.add(qtn.Id);
        }
        List<Advanced_Survey_Answer__c> existingAnswers = [SELECT ID,Advanced_Survey_Question__c,Text_Response_Value__c,Number_Response_Value__c,Date_Response_Value__c,Other_Response_Value__c FROM Advanced_Survey_Answer__c WHERE Advanced_Survey_Question__c IN:questinIdList AND PLM_User__c=:acc.id];
        List<Advanced_Survey_Question__c> questionsWithoutAnswers = new List<Advanced_Survey_Question__c>();
        for(Advanced_Survey_Question__c question : questions){
            Boolean flag = false;
            for(Advanced_Survey_Answer__c answer:existingAnswers){
                if(question.id == answer.Advanced_Survey_Question__c){
                    flag = true;
                }
                
            }
            if(!flag){
                questionsWithoutAnswers.add(question);
            }
        }
        List<QuestionInnerWrapper> innerWrapperList = new List<QuestionInnerWrapper>();
        for(Advanced_Survey_Question__c question :questions){
            for(Advanced_Survey_Answer__c answer:existingAnswers ){
                if(question.id == answer.Advanced_Survey_Question__c){
                    QuestionInnerWrapper innerWrapper = new QuestionInnerWrapper();
                    innerWrapper.question = question;
                    innerWrapper.answer = answer;
                    innerWrapperList.add(innerWrapper);
                }
            }
        }
        for(Advanced_Survey_Question__c question : questionsWithoutAnswers){
            QuestionInnerWrapper innerWrapper = new QuestionInnerWrapper();
            innerWrapper.question = question;
            innerWrapperList.add(innerWrapper);
        }
        QuestionWrapper qtnwrap = new QuestionWrapper();        
        qtnwrap.questions  = innerWrapperList;
        qtnwrap.currentSection= (acc.Alpha_Current_Section__c!=null)?acc.Alpha_Current_Section__c:'0' ;
        System.debug('qtnwrap '+qtnwrap);
        return qtnwrap;
    }
    @AuraEnabled
    public static void fetchCheckedRecord(){
        
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account acc = [SELECT Id,Study_Consent__C,PersonContactId FROM Account WHERE Id =:user.AccountId];
        Study_Consent__C consentExistingRecord;
        if(!Test.isRunningTest()){
        	 consentExistingRecord= [SELECT id,Title_of_Study__c,Investigator__c,Phone_Number__c,Collaborator__c,Existing_Record__c FROM Study_Consent__C WHERE id=:acc.Study_Consent__C LIMIT 1];
        }
        else{
            consentExistingRecord= [SELECT id,Title_of_Study__c,Investigator__c,Phone_Number__c,Collaborator__c,Existing_Record__c FROM Study_Consent__C LIMIT 1];
        }
        consentExistingRecord.Existing_Record__c=true;
        update consentExistingRecord;
        System.debug('consentExistingRecord '+consentExistingRecord);
        EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Sign_the_Informed_Consent_Usability_Testing'];

        list<Messaging.SingleEmailMessage> mailList = new list<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setTemplateId(emailtemp.Id);
        mail.setTargetObjectId(acc.PersonContactId);
        mailList.add(mail);
        if(!mailList.isEmpty()){
       // Messaging.sendEmail(mailList);
}
    }
    
    @AuraEnabled
    public static void updateEhrscreen(){
        User user = [SELECT id,accountId from User WHERE id=:UserInfo.getUserId()];
      Account acc = [SELECT id,ehrcontinuepage2__c FROM Account WHERE  Id=:user.accountId];
        
            acc.ehrcontinuepage2__c=true;
            update acc;
        
    }
    
     @AuraEnabled
    public static Boolean insertMulitipleSurveyAnswers(List<Advanced_Survey_Answer__c> answerList,String surveyId,String accountId,String currentSection){ 
        System.debug('answerList from js'+answerList);
        Map<Id,Advanced_Survey_Answer__c> questionsMap = new Map<Id,Advanced_Survey_Answer__c>();
        List<Advanced_Survey_Answer__c> newAnswerList = new List<Advanced_Survey_Answer__c>();
        List<Advanced_Survey_Answer__c> listToInsert = new List<Advanced_Survey_Answer__c>();
        Account acc= [Select id,Alpha_Current_Section__c from Account where id=:accountId];
        acc.Alpha_Current_Section__c = currentSection;
        update acc;
        for( Advanced_Survey_Answer__c answer: answerList){
            questionsMap.put(answer.Advanced_Survey_Question__c,answer);
        }
        List<Advanced_Survey_Answer__c> existingAnswerList= [SELECT id,Question_Order__c,Advanced_Survey_Question__c FROM Advanced_Survey_Answer__c
                                                             WHERE Advanced_Survey_Question__c In : questionsMap.keySet() AND PLM_User__c=:accountId];
        System.debug(questionsMap+' questionsMap '+accountId+' accountId');
        for(Id questionId:questionsMap.keySet()){
            Boolean flag = false;
            for (Advanced_Survey_Answer__c answer : existingAnswerList){
                if(answer.Advanced_Survey_Question__c == questionId ){
                    flag = true;
                    answer.Text_Response_Value__c = String.valueOf(questionsMap.get(questionId).Text_Response_Value__c);
                    answer.Date_Response_Value__c = questionsMap.get(questionId).Date_Response_Value__c;
                    answer.Number_Response_Value__c = questionsMap.get(questionId).Number_Response_Value__c;
                    answer.Other_Response_Value__c = questionsMap.get(questionId).Other_Response_Value__c;
                }
            }
            if(!flag){
                newAnswerList.add(questionsMap.get(questionId));
            }
        }
        Map<Id,Advanced_Survey_Answer__c> insertMap = new Map<Id,Advanced_Survey_Answer__c>();
        for(Advanced_Survey_Answer__c answer:newAnswerList){
            insertMap.put(answer.Advanced_Survey_Question__c,answer);
        }
        for(Advanced_Survey_Answer__c answer:insertMap.values()){
            listToInsert.add(answer);
        }
        system.debug('answerList[0].Advanced_Survey_Response__c'+answerList[0].Advanced_Survey_Response__c);
        Advanced_Survey_Response__c response = [SELECT id,Current_Section__c FROM Advanced_Survey_Response__c WHERE Id=:answerList[0].Advanced_Survey_Response__c];
        response.Current_Section__c = currentSection;
        update response;
        update existingAnswerList;
        insert listToInsert;
        return true;    
    } 
    @AuraEnabled
    public static surveyVariables  surveyFlow(String surveyNumber){
       
      User user = [SELECT id,ContactId from User WHERE id=:UserInfo.getUserId()];
      Contact con = [SELECT id,AccountId FROM Contact WHERE  Id=:user.ContactId];
      Id surveyId = [SELECT id,Survey_Number__c FROM Advanced_Survey__c WHERE Survey_Number__c=:surveyNumber].id;
       Advanced_Survey_Response__c response;
      Id advancedSurveyResponseId = null;
      surveyVariables wrapper = new surveyVariables();
      wrapper.surveyId = surveyId;
      if([SELECT id,PLM_User__c,Advanced_Survey__c,Status__c FROM Advanced_Survey_Response__c 
                                        WHERE PLM_User__c=:con.AccountId AND Advanced_Survey__c=:surveyId].size()>0){
          response= [SELECT id,PLM_User__c,Advanced_Survey__c,Status__c FROM Advanced_Survey_Response__c 
                                  WHERE PLM_User__c=:con.AccountId AND Advanced_Survey__c=:surveyId];
          if(response.status__c=='Complete'){
            wrapper.responseId=response.id;
            wrapper.accountId=con.AccountId;
            wrapper.message ='response updated as Complete';
            return wrapper;
          }
          else if(response.status__c=='Incomplete'){
            //advancedSurveyResponseId = response.Id;
             wrapper.message ='response updated as Incomplete';
             wrapper.responseId=response.id;
             wrapper.accountId=con.AccountId;
            return wrapper;
          }
      }
      else{
         Advanced_Survey_Response__c newResponse =  new Advanced_Survey_Response__c();
         newResponse.Advanced_Survey__c = surveyId;
         newResponse.PLM_User__c = con.AccountId;
         newResponse.Status__c = 'Incomplete';
         insert newResponse;
         advancedSurveyResponseId = newResponse.id;
         wrapper.message ='response created successfully';
         wrapper.responseId=newResponse.id;
         wrapper.accountId=con.AccountId;
            return wrapper;
      }
      return null;
    }
    public class surveyVariables{
        @AuraEnabled Public String surveyId;
        @AuraEnabled Public String message;
        @AuraEnabled Public String responseId;
        @AuraEnabled Public String accountId;  
      }
  
   

     public class QuestionWrapper{
        @AuraEnabled public List<QuestionInnerWrapper>  questions;
        @AuraEnabled  public String currentSection;
        
    }
    public class QuestionInnerWrapper{
        @AuraEnabled public Advanced_Survey_Question__c  question;
        @AuraEnabled public Advanced_Survey_Answer__c  answer;
        
    }
}