public without sharing class TransplantSurveyController {
    
    @AuraEnabled
    public static Boolean TransplantEmailscheduleJob() {
        
        String cronString = '0 0 1/7 * * ? *';
        String cronJobName = 'Transplant webinar2  is completed after one week it should through an email alert';
        try {
            PLMTransplantEmailSchedule scheduler = new PLMTransplantEmailSchedule();
            System.schedule(cronJobName, cronString, scheduler);
            return true;
        } catch (Exception e) {
            System.debug(e.getMessage());
            return false;
        }
    }
    
    
     @AuraEnabled
    public static Boolean TransplantRemainderEmailscheduleJob() {
        
        String cronString = '0 0 1/1 * * ? *';
        String cronJobName = 'When Webinar 2 is completed and Post webinar quetions is not completed then it should throw an email alert ';
        try {
            PLMTransplantRemainderEmailSchedule scheduler = new PLMTransplantRemainderEmailSchedule();
            System.schedule(cronJobName, cronString, scheduler);
            return true;
        } catch (Exception e) {
            System.debug(e.getMessage());
            return false;
        }
    }
    
    @AuraEnabled
    public static Boolean TransplantSurveyEmailSchedule() {
        
        String cronString = '0 0 1/2 * * ? *';
        String cronJobName = 'Transplant survey : 2 days after user started the survey and left it/did not complete it';
        try {
            PLMTransplantSurveyEmailSchedule scheduler = new PLMTransplantSurveyEmailSchedule();
            System.schedule(cronJobName, cronString, scheduler);
            return true;
        } catch (Exception e) {
            System.debug(e.getMessage());
            return false;
        }
    }
    
    @AuraEnabled
    
    Public static void TransplantTankYouEmailAlert(){
        
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account acc = [SELECT Id,Study_Consent__C,PersonContactId,Transplant_Patient_Type__c FROM Account WHERE Id =:user.AccountId];
        
        EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Thank_You_Email_Patients_and_Care_Partner'];
        
        list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setTemplateId(emailtemp.Id);
        mail.setTargetObjectId(acc.PersonContactId);
        mailList.add(mail);
        
        if(!mailList.isEmpty() ){
            Messaging.sendEmail(mailList);
        }
    }
    
    @AuraEnabled
    
    public static  QuestionWrapper getQuestionsWithSections (string type,string surveyId){
        system.debug('surveyId -----'+surveyId);
        List<ID> questinIdList = new List<Id>();
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        system.debug('UserData------'+user);
        Account acc= [SELECT id,Transplant_Patient_Type__c,transplantPatientLastvisit__c,Transplant_Current_Section__c from Account WHERE ID=:user.AccountId];
        system.debug('AccountData------'+acc);
        List<Advanced_Survey_Question__c> questions = new List<Advanced_Survey_Question__c>();
       Advanced_Survey__c survey =  [SELECT id,Survey_Number__c from Advanced_Survey__c WHERE id=:surveyId];
        if(survey.Survey_Number__c =='Transplant-Pre-webinar' || survey.Survey_Number__c =='Transplant-Post-webinar'){
        questions =[SELECT Id,Display_Type__c,Options__c,Option_Other__c,label__c,skipNumberTransplant__c,transplantNestedOptions__c,Next_Question__c,Active__c,Order__c,
                                                      Order_Text__c,modelContent__c,Question_Text__c,Advanced_Survey__c,Section_Name__c,Transition_Message__c,Transplant__c
                                                       FROM Advanced_Survey_Question__c 
                                                      Where Advanced_Survey__c=:surveyId AND Active__c = true  ORDER BY Order__c] ;
        }
        else{
            questions =[SELECT Id,Display_Type__c,Options__c,Option_Other__c,label__c,skipNumberTransplant__c,transplantNestedOptions__c,Next_Question__c,Active__c,Order__c,
                                                      Order_Text__c,modelContent__c,Question_Text__c,Advanced_Survey__c,Section_Name__c,Transition_Message__c,Transplant__c
                                                      FROM Advanced_Survey_Question__c 
                                                      Where Advanced_Survey__c=:surveyId AND Active__c = true AND Transplant__c =: acc.Transplant_Patient_Type__c ORDER BY Order__c] ;
        }
        
        for(Advanced_Survey_Question__c qtn : questions){
            questinIdList.add(qtn.Id);
            
        }
        List<Advanced_Survey_Answer__c> existingAnswers = [SELECT ID,Advanced_Survey_Question__c,NestedOptionsData__c,Text_Response_Value__c,Number_Response_Value__c,Date_Response_Value__c,Other_Response_Value__c FROM Advanced_Survey_Answer__c WHERE Advanced_Survey_Question__c IN:questinIdList AND PLM_User__c=:acc.id];//skippedQuestions__c
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
        system.debug('questionsWithoutAnswers'+questionsWithoutAnswers);
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
        qtnwrap.currentSection= acc.Transplant_Current_Section__c ;
        if(acc.transplantPatientLastvisit__c!='' || acc.transplantPatientLastvisit__c!=null){
            qtnwrap.lastStamp=acc.transplantPatientLastvisit__c;
         }
        String answer='';
        Advanced_Survey_Response__c advancedSurveyResponse =   [SELECT id FROM Advanced_Survey_Response__c WHERE Advanced_Survey__c=:surveyId AND PLM_User__c=:user.AccountId ];
        System.debug('acc.id'+acc.id);
        System.debug('surveyId'+advancedSurveyResponse.id);
        if(acc.Transplant_Patient_Type__c=='Patient' && [select Id,Advanced_Survey_Question__c,Text_Response_Value__c  from Advanced_Survey_Answer__c  WHERE Advanced_Survey_Question__r.Order__c =1 and PLM_User__c =:acc.id and Advanced_Survey_Response__c =:advancedSurveyResponse.id ].size()>0){
            answer = [select Id,Advanced_Survey_Question__c,Text_Response_Value__c,NestedOptionsData__c  from Advanced_Survey_Answer__c  WHERE Advanced_Survey_Question__r.Order__c =1 and PLM_User__c =:acc.id and Advanced_Survey_Response__c =:advancedSurveyResponse.id].Text_Response_Value__c;
            qtnwrap.skipSectionAnswer= answer ;
            System.debug('qtnwrap.skipSectionAnswer'+qtnwrap.skipSectionAnswer);
            System.debug('answer'+answer);
        }
        

        if(acc.Transplant_Patient_Type__c=='Caretaker' && [select Id,Advanced_Survey_Question__c,Text_Response_Value__c  from Advanced_Survey_Answer__c  WHERE Advanced_Survey_Question__r.Order__c =21 and PLM_User__c =:acc.id and Advanced_Survey_Response__c =:advancedSurveyResponse.id ].size()>0){
            answer = [select Id,Advanced_Survey_Question__c,Text_Response_Value__c,NestedOptionsData__c  from Advanced_Survey_Answer__c  WHERE Advanced_Survey_Question__r.Order__c =21 and PLM_User__c =:acc.id and Advanced_Survey_Response__c =:advancedSurveyResponse.id].Text_Response_Value__c;
            qtnwrap.skipSectionAnswer= answer ;
            System.debug('qtnwrap.skipSectionAnswer'+qtnwrap.skipSectionAnswer);
             System.debug('answer'+answer);
        }
        if(acc.Transplant_Patient_Type__c=='Caretaker' && [select Id,Advanced_Survey_Question__c,Text_Response_Value__c  from Advanced_Survey_Answer__c  WHERE Advanced_Survey_Question__r.Order__c =5 and PLM_User__c =:acc.id and Advanced_Survey_Response__c =:advancedSurveyResponse.id ].size()>0){
            answer = [select Id,Advanced_Survey_Question__c,Text_Response_Value__c,NestedOptionsData__c  from Advanced_Survey_Answer__c  WHERE Advanced_Survey_Question__r.Order__c =5 and PLM_User__c =:acc.id and Advanced_Survey_Response__c =:advancedSurveyResponse.id].Text_Response_Value__c;
            qtnwrap.sec1q5= answer ;
            System.debug('qtnwrap.skipSectionAnswer'+qtnwrap.skipSectionAnswer);
             System.debug('answer'+answer);
        }
        
        qtnwrap.userType= acc.Transplant_Patient_Type__c ;
        SkipSectionWrapper skipSectionWrapper = new SkipSectionWrapper();
        if(acc.Transplant_Patient_Type__c=='Patient'){
          String asqId =   [select id,isSectionSkip__c,Advanced_Survey__r.Name,Transplant__c from Advanced_Survey_Question__c where isSectionSkip__c=true and Transplant__c='Patient'].Id;
            
        skipSectionWrapper.skipSection='';
            }
        System.debug('  '+qtnwrap);
        
        return qtnwrap;
    }
    
    
    @AuraEnabled
    public static String getSurveyQuestions(String surveyId){
        String qry ='SELECT Id,Display_Type__c,Options__c,Option_Other__c,label__c,Next_Question__c,Active__c,Order__c,Order_Text__c,Question_Text__c,Advanced_Survey__c,Section_Name__c,modelContent__c,Transition_Message__c FROM Advanced_Survey_Question__c Where Advanced_Survey__c=:surveyId AND Active__c = true ORDER BY Order__c';
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
        String surveyId = 'a1ee000000fSWlAAAW';//If we want to make this available to all the surveys
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
    public static Boolean insertMulitipleSurveyAnswers(List<Advanced_Survey_Answer__c> answerList,String surveyId,String accountId,String currentSection,String surveyType){ 
        System.debug('answerList from js'+answerList);
        Map<Id,Advanced_Survey_Answer__c> questionsMap = new Map<Id,Advanced_Survey_Answer__c>();
        List<Advanced_Survey_Answer__c> newAnswerList = new List<Advanced_Survey_Answer__c>();
        List<Advanced_Survey_Answer__c> listToInsert = new List<Advanced_Survey_Answer__c>();
        Account acc= [Select id,Transplant_Current_Section__c,Transplant_Patient_Type__c from Account where id=:accountId];
        acc.Transplant_Current_Section__c = currentSection;
       // acc.Transplant_Patient_Type__c = surveyType;
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
                    answer.Text_Response_Value__c = questionsMap.get(questionId).Text_Response_Value__c;
                    answer.Date_Response_Value__c = questionsMap.get(questionId).Date_Response_Value__c;
                    answer.Number_Response_Value__c = questionsMap.get(questionId).Number_Response_Value__c;
                    answer.Other_Response_Value__c = questionsMap.get(questionId).Other_Response_Value__c;
                    answer.NestedOptionsData__c = questionsMap.get(questionId).NestedOptionsData__c;
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
    public static string getSurveyType() {
        User user = [Select Id,AccountId from User where id=:userinfo.getuserId()];
        Account acc= [SELECT id,Transplant_Patient_Type__c from Account WHERE ID=:user.AccountId];
        return acc.Transplant_Patient_Type__c;
        //return acc.id;
    } 
    @AuraEnabled
    public static Boolean updateSurveyType(String type) {
        User user = [Select Id,AccountId from User where id=:userinfo.getuserId()];
        Account acc= [SELECT id,Transplant_Patient_Type__c from Account WHERE ID=:user.AccountId];
        acc.Transplant_Patient_Type__c = type;
        update acc;
        return true;
    } 
    
    @AuraEnabled
    public static String transplantUserStamp(String lastStamp){
        User user = [SELECT id,accountId from User WHERE id=:UserInfo.getUserId()];
        Account acc = [SELECT id,transplantPatientLastvisit__c FROM Account WHERE  Id=:user.accountId]; 
        if(lastStamp!='' || lastStamp!=null)
            acc.transplantPatientLastvisit__c=lastStamp;
            update acc;        
        return 'updated page name is'+acc.transplantPatientLastvisit__c;
    }

    
    public class QuestionWrapper{
        @AuraEnabled public List<QuestionInnerWrapper>  questions;
        @AuraEnabled  public String currentSection;
        @AuraEnabled  public String lastStamp;
        @AuraEnabled  public String userType;
        @AuraEnabled  public String skipSectionAnswer;
        @AuraEnabled  public String sec1q5;
    }
    public class QuestionInnerWrapper{
        @AuraEnabled public Advanced_Survey_Question__c  question;
        @AuraEnabled public Advanced_Survey_Answer__c  answer;
        
    }
    
    
    public class Wrapper{
        public Advanced_Survey_Question__c  question;
        public Advanced_Survey_Answer__c answer;
    }
    
     public class SkipSectionWrapper{
       @AuraEnabled  public String skipSection;
    }
    
    @AuraEnabled
    public static  string getSurveyDetails (){
        List<ID> questinIdList = new List<Id>();
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account acc= [SELECT id,Transplant_Patient_Type__c,Transplant_Current_Section__c from Account WHERE ID=:user.AccountId];
        return acc.Transplant_Patient_Type__c;
    }
}