public with sharing class SurveyController {
 @AuraEnabled(cacheable=true)
  public static List<Advanced_Survey_Question__c> getSurveyQuestions(String surveyId){
      String qry ='SELECT Id,Display_Type__c,Options__c,Option_Other__c,Next_Question__c,Active__c,Order__c,Order_Text__c,Question_Text__c,Advanced_Survey__c,Section_Name__c,PRO_Intructions__c,Transition_Message__c FROM Advanced_Survey_Question__c Where Advanced_Survey__c=:surveyId AND Active__c = true ORDER BY Order__c';
        List<Advanced_Survey_Question__c> qList = Database.query(qry);
      return qList;
  }
  @AuraEnabled
  public static void updateMddDiagnosis(){
    User user = [Select Id,AccountId from User where id=:userinfo.getuserId()];
    Account acc= [SELECT id,confirmMddDiagnosis__c from Account WHERE ID=:user.AccountId];
    acc.confirmMddDiagnosis__c =true;
    update acc;
  }
  @AuraEnabled
  public static string updateAccountConsent(){
    User user = [Select Id,AccountId from User where id=:userinfo.getuserId()];
     Account acc= [SELECT id,Study_Consent__c from Account WHERE ID=:user.AccountId];
     System.debug('acc '+acc);
    Study_Consent__c consent = [SELECT id from Study_Consent__c WHERE ID=:acc.Study_Consent__c];
    consent.Existing_Record__c = TRUE;
    update consent;
    return user.AccountId+' '+acc.Study_Consent__c;
    }
    @AuraEnabled
    public static Boolean insertSurveyAnswer(List<Advanced_Survey_Answer__c> answerList,String surveyId,String accountId,String currentSection,String week,Double progressBarValue){
      System.debug('answerList from js'+answerList);
      System.debug('protestbar'+progressBarValue);
      try {
        Map<Id,Advanced_Survey_Answer__c> questionsMap = new  Map<Id,Advanced_Survey_Answer__c>();
        List<Advanced_Survey_Answer__c> newAnswerList = new List<Advanced_Survey_Answer__c>();
        List<Advanced_Survey_Answer__c> listToInsert = new List<Advanced_Survey_Answer__c>();
        for( Advanced_Survey_Answer__c answer: answerList){
        questionsMap.put(answer.Advanced_Survey_Question__c,answer);
  
      }   
       List<Advanced_Survey_Answer__c> existingAnswerList= [SELECT id,Question_Order__c,Advanced_Survey_Question__c FROM Advanced_Survey_Answer__c 
                                                   WHERE Advanced_Survey_Question__c In : questionsMap.keySet()  AND PLM_User__c=:accountId];
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
                               
        List<Advanced_Survey_Question__c> questionList = [select id,Advanced_Survey__c from Advanced_Survey_Question__c where Week_Number__c=:week and Active__c =true];
         List<Advanced_Survey_Answer__c> answersList =  [select id from Advanced_Survey_Answer__c where Week__c=:week and Advanced_Survey_Response__c =:answerList[0].Advanced_Survey_Response__c];
         system.debug('questionList'+questionList.size());
         system.debug('answersList'+answersList.size());
         User user = [Select Id,AccountId from User where id=:userinfo.getuserId()];
         Account acc= [SELECT id,completeWeek1__c,completeWeek2__c,completeWeek6__c,
                       completeWeek12__c,completeWeek13__c,completeWeek18__c,
                      completeWeek23__c,completeWeek24__c,completeweekstatus1__c,completeweekstatus2__c,
                      completeweekstatus6__c,completeweekstatus12__c,completeweekstatus13__c,
                      completeweekstatus18__c,Survey1Completion_Date__c,
                      completeweekstatus23__c,completeweekstatus24__c,progressBarValuewk1pt1__c,progressBarValuewk2pt2__c,
                      phq9wk6__c,progressBarValuewk12pt1__c,progressBarValuewk13pt2__c,phq9wk18__c,
                      progressBarValuewk23pt1__c,progressBarValuewk24pt2__c from Account WHERE ID=:user.AccountId]; 
                      if(week=='Week0'){                
                        acc.progressBarValuewk1pt1__c=String.valueOf(progressBarValue);                      
                       }
                        else if(week=='Week1'){
                        acc.progressBarValuewk2pt2__c=String.valueOf(progressBarValue);
                      }else if(week=='Week6'){
                        acc.phq9wk6__c=String.valueOf(progressBarValue);      
                      }else if(week=='Week12'){
                        acc.progressBarValuewk12pt1__c=String.valueOf(progressBarValue);
                      }else if(week=='Week13'){
                        acc.progressBarValuewk13pt2__c=String.valueOf(progressBarValue); 
                      }else if(week=='Week18'){
                        acc.phq9wk18__c =String.valueOf(progressBarValue);
                     }else if(week=='Week23'){
                        acc.progressBarValuewk23pt1__c =String.valueOf(progressBarValue);
                     }else if(week=='Week24'){
                        acc.progressBarValuewk24pt2__c=String.valueOf(progressBarValue); 
                     }

         if(questionList.size()==answersList.size()){
          
         
            system.debug('test if');            
                 if(week=='Week0'){
                  acc.completeWeek1__c=true;
                  acc.completeweekstatus1__c='Completed';
      
                system.debug('Survey1Completion_Date'+acc.Survey1Completion_Date__c+'date'+system.today());

                  //if( acc.Survey1Completion_Date__c != null){
                  
                    acc.Survey1Completion_Date__c = system.today();
                    system.debug('test one'+acc.Survey1Completion_Date__c);
                 // }
                }else if(week=='Week1'){
                  acc.completeWeek2__c=true;
                  acc.completeweekstatus2__c='Completed';
                }else if(week=='Week6'){
                  acc.completeWeek6__c=true;
                  acc.completeweekstatus6__c='Completed';

                }else if(week=='Week12'){
                  acc.completeWeek12__c=true;
                  acc.completeweekstatus12__c='Completed'; 
                }else if(week=='Week13'){
                  acc.completeWeek13__c=true;
                  acc.completeweekstatus13__c='Completed'; 
                }else if(week=='Week18'){
                  acc.completeWeek18__c=true;
                  acc.completeweekstatus18__c='Completed'; 
               }else if(week=='Week23'){
                  acc.completeWeek23__c=true;
                  acc.completeweekstatus23__c='Completed'; 
               }else if(week=='Week24'){
                  acc.completeWeek24__c=true;
                  acc.completeweekstatus24__c='Completed'; 
               }
             
          }
          update acc;
         return true;
      } catch (Exception e) {
        //System.debug('exception we encountered in insertSurveyAnswer is '+JSON.serializePretty(e));
        throw new AuraHandledException(e.getMessage());
      }
    }
    @AuraEnabled
    public static Account fetchStatus(){
      User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
     return  [SELECT completeweekstatus1__c,completeweekstatus2__c,completeweekstatus6__c,
               completeweekstatus12__c,completeweekstatus13__c,completeweekstatus18__c,Survey1Completion_Date__c,
               completeweekstatus23__c,completeweekstatus24__c,Current_Wk__c,Current_Wk_Session2__c  FROM Account WHERE Id =:user.AccountId ];
  
    }
    @AuraEnabled
    public static Boolean getConsentStatus(){
        User user = [Select Id,AccountId from User where id=:userinfo.getuserId()];
        Account acc= [SELECT id,Study_Consent__r.Existing_Record__c from Account WHERE ID=:user.AccountId];
        return acc.Study_Consent__r.Existing_Record__c;
    }
//     @AuraEnabled
//     public static void progressBarValueInsert(String accountId){//,String progressBarValue){
    
//       String accId=accountId;
//       system.debug('accIdtest'+accId);
//       if(accId!=null){
//       Account acc =  [SELECT id,progressBarValue__c FROM Account WHERE Id =:accountId ];
      
//       update acc;
//     }
// }

  @AuraEnabled
    public static List<Section> getQuestionsWithSections(string surveyId, String week){
        Map<String,List<Advanced_Survey_Question__c>> sectionMap = new Map<String, List<Advanced_Survey_Question__c>>();
        User user = [Select Id,AccountId from User where id=:userinfo.getuserId()];
        System.debug('surveyId:::::::'+surveyId);
        System.debug('user.AccountId'+user.AccountId);
        System.debug('week::::::::::'+week);
  
        Account acc = [Select id,progressBarValuewk1pt1__c,progressBarValuewk2pt2__c,phq9wk6__c,progressBarValuewk12pt1__c,
                       progressBarValuewk13pt2__c,phq9wk18__c,progressBarValuewk23pt1__c,progressBarValuewk24pt2__c 
                       from account where id=:user.AccountId];
           decimal progressValue;
                       if(week=='Week0' && acc.progressBarValuewk1pt1__c!=null){                
                        progressValue=Decimal.valueOf(acc.progressBarValuewk1pt1__c);
                       }
                        else if(week=='Week1' && acc.progressBarValuewk2pt2__c!=null){                    
                   progressValue=Decimal.valueOf(acc.progressBarValuewk2pt2__c);
                      }
                      else if(week=='Week6' && acc.phq9wk6__c!=null){                  
                    progressValue=Decimal.valueOf(acc.phq9wk6__c);      
                      }
                      else if(week=='Week12'  && acc.progressBarValuewk12pt1__c!=null){                  
                    progressValue=Decimal.valueOf(acc.progressBarValuewk12pt1__c); 
                      }
                      else if(week=='Week13' && acc.progressBarValuewk13pt2__c!=null){            
                    progressValue=Decimal.valueOf(acc.progressBarValuewk13pt2__c); 
                      }
                      else if(week=='Week18' && acc.phq9wk18__c!=null){                    
                    progressValue=Decimal.valueOf(acc.phq9wk18__c); 
                     }
                     else if(week=='Week23' && acc.progressBarValuewk23pt1__c!=null){           
                    progressValue=Decimal.valueOf(acc.progressBarValuewk23pt1__c); 
                     }
                     else if(week=='Week24' && acc.progressBarValuewk24pt2__c!=null){        
                    progressValue=Decimal.valueOf(acc.progressBarValuewk24pt2__c); 
                     }

  
        Advanced_Survey_Response__c advancedSurveyResponse =   [SELECT id,Current_Section__c 
                                                              FROM Advanced_Survey_Response__c 
                                                              WHERE Advanced_Survey__c=:surveyId 
                                                              AND PLM_User__c=:user.AccountId];
        for(Advanced_Survey_Question__c question: [SELECT Id,Display_Type__c,Options__c,modelContent__c,Option_Other__c,Next_Question__c,Active__c,Order__c,Order_Text__c,Week_Number__c,Question_Text__c,Advanced_Survey__c,Section_Name__c,PRO_Intructions__c,Transition_Message__c 
                                                  FROM Advanced_Survey_Question__c Where Advanced_Survey__c=:surveyId AND Active__c = true AND Week_Number__c=:week
                                                  ORDER BY Order__c]){
            
                if(!sectionMap.containsKey(question.Section_Name__c)){
                    List<Advanced_Survey_Question__c> newquestionsList = new List<Advanced_Survey_Question__c>();
                    newquestionsList.add(question);
                    sectionMap.put(question.Section_Name__c,newquestionsList);
                    }
                  else if(sectionMap.containsKey(question.Section_Name__c)){
                      List<Advanced_Survey_Question__c> existingquestionsList =sectionMap.get(question.Section_Name__c);
                      existingquestionsList.add(question);
          }
            
        }
        System.debug('sectionMap '+sectionMap);
        List<SurveyController.Section> sectionList = new List<SurveyController.Section>();
        integer questionSize =[select id from Advanced_Survey_Question__c where Week_Number__c=:week].size();
        for(String sec:sectionMap.keySet()){
            SurveyController.Section section = new SurveyController.Section();
            section.section = sec;
            section.currentSection = advancedSurveyResponse.Current_Section__c;
            List<surveyInformation> infoList = new List<surveyInformation>();
          for( Advanced_Survey_Question__c question:sectionMap.get(sec)){
          Boolean flag = false;
          for(Advanced_Survey_Answer__c answer:[SELECT id,Question_Order__c,Week__c,Text_Response_Value__c,Number_Response_Value__c,Other_Response_Value__c,Date_Response_Value__c 
                                                              FROM Advanced_Survey_Answer__c 
                                                              WHERE PLM_User__c=:user.AccountId AND Advanced_Survey_Response__c =:advancedSurveyResponse.id AND Week__c=:week]){
              
              
              if(question.Order__c == answer.Question_Order__c){
                flag = true;
                SurveyController.surveyInformation info = new SurveyController.surveyInformation();
                info.questions = question;
                info.answers = answer;
                infoList.add(info);
                section.surveyInformation = infoList;
                section.noOfQuestionsWithSection=questionSize;
                section.progressBarValue=progressValue;
              }
  
          }
          if(!flag){
            SurveyController.surveyInformation info = new SurveyController.surveyInformation();
            info.questions = question;
            info.answers = null;
            infoList.add(info);
            section.surveyInformation = infoList;
            section.noOfQuestionsWithSection=questionSize;
            section.progressBarValue=progressValue;
          }
          }
          sectionList.add(section);
        }
            
            
        System.debug('data in apex class '+sectionList);
  
        return sectionList;
    }
  
  @AuraEnabled
  public static List<Advanced_Survey_Answer__c> getQuestionsandAnswers(){
  
   User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
    List<String> surVariable=new  List<String>();
    List<Advanced_Survey_Response__c> advancedSurveyResponse =   [SELECT id,Advanced_Survey_Name__c 
                                                              FROM Advanced_Survey_Response__c 
                                                              WHERE Advanced_Survey_Name__c LIKE 'MDD%'  
                                                              AND PLM_User__c=:user.AccountId ];
  
  for(Advanced_Survey_Response__c surveyResult:advancedSurveyResponse){
          surVariable.add(surveyResult.id);
          
      }
  
  List<Advanced_Survey_Answer__c> answersList=[SELECT id,Question_Order__c,Text_Response_Value__c,Advanced_Survey_Question__r.Question_Text__c,
                                                      Advanced_Survey_Question__r.Week_Number__c,Number_Response_Value__c,Advanced_Survey_Question__r.IsPRO__c,
                                                      Other_Response_Value__c,Date_Response_Value__c 
                                                        FROM Advanced_Survey_Answer__c 
                                                      WHERE PLM_User__c =: user.AccountId  AND Advanced_Survey_Response__c in :surVariable];
  return answersList;
  
  
  }
  
  
      @AuraEnabled
    public static List<ProData>  getSurveyGoals(){
    User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
    List<String> surVariable=new  List<String>();
    List<Advanced_Survey_Response__c> advancedSurveyResponse =   [SELECT id,Advanced_Survey_Name__c 
                                                              FROM Advanced_Survey_Response__c 
                                                              WHERE Advanced_Survey_Name__c LIKE 'MDD%'  
                                                              AND PLM_User__c=:user.AccountId ];
      if(advancedSurveyResponse.size() == 0){
            return getStaticPros();
      } 
      for(Advanced_Survey_Response__c surveyResult:advancedSurveyResponse){
          surVariable.add(surveyResult.id);
          
      }
    List<Advanced_Survey_Answer__c> answersList=[SELECT id,Question_Order__c,Text_Response_Value__c,Advanced_Survey_Question__r.Question_Text__c,
                                                      Advanced_Survey_Question__r.Week_Number__c,Number_Response_Value__c,Advanced_Survey_Question__r.IsPRO__c,
                                                      Other_Response_Value__c,Date_Response_Value__c 
                                                        FROM Advanced_Survey_Answer__c 
                                                        WHERE PLM_User__c =: user.AccountId  AND Advanced_Survey_Response__c in :surVariable];
    Map<String,List<WeekData>> resultMap = new Map<String, List<WeekData>>();
    for(Advanced_Survey_Answer__c answer:answersList){
        if(answer.Advanced_Survey_Question__r.IsPRO__c){
          if(!resultMap.containsKey(answer.Advanced_Survey_Question__r.Question_Text__c))
          {
            List<WeekData> weekDataList =new List<WeekData>();
          weekData wedata = new weekData();
          wedata.weeks = answer.Advanced_Survey_Question__r.Week_Number__c;
          wedata.value = answer.Text_Response_Value__c;
          wedata.severity = '';
          weekDataList.add(wedata);
          resultMap.put(answer.Advanced_Survey_Question__r.Question_Text__c,weekDataList);
          }
          else{
          List<WeekData> weekDataList = resultMap.get(answer.Advanced_Survey_Question__r.Question_Text__c);
          weekData wedata = new weekData();
          wedata.weeks = answer.Advanced_Survey_Question__r.Week_Number__c;
          wedata.value = answer.Text_Response_Value__c;
          wedata.severity = '';
          weekDataList.add(wedata);
          }
        }
    }
  
    
  for(ProQuestions__mdt question: [select Pro_Name__c,Weeks__c from ProQuestions__mdt]){
  System.debug('in metadata==>'+question.Pro_Name__c);
  if(!resultMap.containsKey(question.Pro_Name__c)){
    List<WeekData> weekDataList =new List<WeekData>();
    for(String week:question.Weeks__c.split(',')){
          weekData wedata = new weekData();
          wedata.weeks = week;
          wedata.value = '0';
          wedata.severity = '--';
          weekDataList.add(wedata);
    }
    System.debug('PROs not ansewered===>'+question.Pro_Name__c);
    resultMap.put(question.Pro_Name__c,weekDataList);
  }
  else{
    
    
      for(String weekFromMetadata:question.Weeks__c.split(',')){
          Boolean flag = false;
        List<WeekData> weekDataList  =resultMap.get(question.Pro_Name__c);
        for(WeekData weekFromSurvey:weekDataList){
            if(weekFromMetadata == weekFromSurvey.weeks){
              flag = true;
            }
        }
        if(!flag){
            weekData wedata = new weekData();
          wedata.weeks = weekFromMetadata;
          wedata.value = '0';
          wedata.severity = '--';
          weekDataList.add(wedata);
        }
          resultMap.put(question.Pro_Name__c,weekDataList);
      }
    }
  } 
      System.debug('final answer'+resultMap);
  
      List<ProData>  proDataList = new List<ProData>();
      for(String questionName:resultMap.keySet()){
        ProData data = new ProData();
        
        data.proQuestion=questionName;
          if(data.proQuestion == 'Patient Health Questionnaire - 9 (PHQ-9)' || data.proQuestion == 'Snaith - Hamilton Pleasure Scale (SHAPS)'){
            data.severityDisplay='display:block;display:contents';
             }else{
               data.severityDisplay='display:none';
             }
          
        data.prodataAnswer=resultMap.get(questionName);
          proDataList.add(data);
    }
  
    
    return proDataList;
    
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
        /*if(!Test.isRunningTest()){
            listOfSurveys = new List<string>{'MDD-Survey-1','MDD-Survey-2','MDD-Survey-3'};
          }
        if(Test.isRunningTest()){
            listOfSurveys = new List<string>{'MDD Test Survey 1'};
        }*/
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
    
    public static List<ProData> getStaticPros(){
  
    List<ProData> proDataList = new List<ProData>();
    for(ProQuestions__mdt question: [select Pro_Name__c,Weeks__c from ProQuestions__mdt]){
      if(question.Weeks__c.contains(',')){
        List<WeekData> weekDataList = new List<WeekData>();
      for(String week:question.Weeks__c.split(',')){
          WeekData weekData =new WeekData(); 
          weekData.weeks  = week;
          weekData.value = '0';
          weekData.severity = '--';
          weekDataList.add(weekData);
      }
        ProData proData=new ProData();
        proData.proQuestion = question.Pro_Name__c;
        proData.prodataAnswer = weekDataList;
        proDataList.add(proData);
      }
    }
  
    return proDataList;
    }
  
    @AuraEnabled
    public static Account getExistingSurvey(){
  
      User user = [Select Id,AccountId from User where id=:userinfo.getuserId()];
      return [SELECT id,completeWeek1__c,completeWeek2__c,completeWeek6__c,
                      completeWeek12__c,completeWeek13__c,completeWeek18__c,
                      completeWeek23__c,completeWeek24__c,Current_Wk__c,Current_Wk_Session2__c from Account WHERE ID=:user.AccountId]; 
  
       /* List<Advanced_Survey_Response__c> responsesList=[SELECT id from Advanced_Survey_Response__c 
                                                      WHERE PLM_User__c=:user.AccountId 
                                                      AND Advanced_Survey_Name__c LIKE 'MDD%' ]; 
      if(responsesList.size()>0){
      return false;
      }
      else{
        return true;
      } */
      
    }
  
     @AuraEnabled
    public static ChecklistData  getCheckListDetails(){
      User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
      Map<id,List<Goal_Response__c>> goalResponseMap = new Map<id,List<Goal_Response__c>>();
      Map<Id,List<Goals_Set__c>> goalSetMap = new Map<Id,List<Goals_Set__c>>();
      List<Goal_Response__c> goalResponseCount = new List<Goal_Response__c>();
      List<Id> responseIdList = new List<Id>();
      ChecklistData checkList = new ChecklistData();
      
         Account accountDetails = [Select name, confirmMddDiagnosis__c,completeweekstatus6__c,completeWeek6__c,completeweekstatus2__c,completeweekstatus24__c,completeweekstatus12__c,completeweekstatus13__c,phq9wk6__c,completeweekstatus1__c,GoalStartDate__c,GoalStartDate_Session2__c,completeWeek24__c,completeWeek18__c,completeWeek13__c,
                                  (select id from Goal_Responses__r) FROM Account WHERE id=:user.AccountId];
          checkList.account =  accountDetails;
          List<Goal_Response__c>  goalRes = [Select id,Name from Goal_Response__c where Account__c=:user.AccountId];
          checkList.responseList = goalRes;
          for(Goal_Response__c res:goalRes) {
            responseIdList.add(res.Id);
          }
          List<Goal_Tracking__c> goalTrack = [Select id,WK__c,Goal_Response_Period_Type__c from Goal_Tracking__c WHERE Goal_Response__c=:responseIdList AND Account_ID__c=:user.AccountId ];     
         checkList.trackingList = goalTrack; 
         return checkList;
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

    @AuraEnabled

    public static Boolean getGoalsCount(){
      User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
     Account  acc= [SELECT id,(Select id from Goal_Responses__r) FROM Account 
                                  WHERE Id=:user.accountId];
      if(acc.Goal_Responses__r.size()>0){
        return true;
    }
    return false;
    } 



   @AuraEnabled
  public static Account getPROCount(){
     User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
    Account  acc= [SELECT id,(Select id from Advanced_Survey_Responses__r) FROM Account WHERE Id=:user.accountId];                                  
    // if(acc.Advanced_Survey_Responses__r.size()>0){
    //     return true;
    // }
    // return false;
    return acc;
    
  } 



  @AuraEnabled
  public static Boolean fetchConsentData(){
    
     User user = [Select Id,AccountId from User where id=:userinfo.getuserId()];
      Account acc= [SELECT id,Study_Consent__c from Account WHERE ID=:user.AccountId];
      System.debug('acc '+acc.Study_Consent__c);

     Study_Consent__c consent = [SELECT id,Exisiting_Record_Dup__c   from Study_Consent__c WHERE ID=:acc.Study_Consent__c];
      return consent.Exisiting_Record_Dup__c    ;
  }
  

    public class ProData{
  
      @AuraEnabled Public String proQuestion;  
      @AuraEnabled Public List<WeekData> prodataAnswer;
      @AuraEnabled Public String severityDisplay;
  
    }
  
    public class WeekData{
      @AuraEnabled Public String weeks;  
      @AuraEnabled Public String value;
      @AuraEnabled Public String severity;
       
  
    }
    
    public class surveyInformation{
      @AuraEnabled Public Advanced_Survey_Question__c questions;
      @AuraEnabled Public Advanced_Survey_Answer__c answers;
    }
    public class Section{
      @AuraEnabled Public Decimal progressBarValue;
      @AuraEnabled Public String section;
      @AuraEnabled Public String currentSection;  
      @AuraEnabled Public integer noOfQuestionsWithSection;  
      @AuraEnabled Public List<surveyInformation> surveyInformation;
    }
    
     public class surveyVariables{
      @AuraEnabled Public String surveyId;
      @AuraEnabled Public String message;
      @AuraEnabled Public String responseId;
      @AuraEnabled Public String accountId;  
    }

    public class ChecklistData{
        @AuraEnabled Public Account account;
        @AuraEnabled Public List<Goal_Response__c> responseList;
        @AuraEnabled Public List<Goal_Tracking__c> trackingList;
    } 
    }