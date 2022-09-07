@isTest
public with sharing class MddTestDataFactory {
    public MddTestDataFactory() {
        
    }
    public Static Account getTestPersonAccount() {
        Id personAccountId;
        List<RecordType> acctRecordTypes = [SELECT Id, name from RecordType where SObjectType='Account' and name='Person Account'];
        Account acct = new Account();
        //acct.Name ='UnitTest';
        acct.FirstName = 'Smurf';
        acct.LastName = 'TestAccount';
        acct.PersonEmail ='Smurf.TestAccount.wal.plm@gmail.com';
        acct.RecordTypeId=acctRecordTypes[0].Id;
        return acct;
    }
    public Static User getTestCommunityUser(Account acct)    {
        List<Contact> contacts = [SELECT Id,name from Contact where accountId = :acct.Id];
        Id cntctId = contacts[0].Id;
        List<Profile> profiles = [SELECT Id, name from Profile where name ='Customer Community Plus Login User Custom' LIMIT 1];
        Id communityProfId = profiles[0].Id;
        User communityUser = new User();
        communityUser.FirstName = acct.FirstName;
        communityUser.LastName = acct.LastName;
        communityUser.alias = acct.FirstName;
        communityUser.contactId = cntctId;
        communityUser.Email = acct.PersonEmail;
        communityUser.UserName = acct.PersonEmail;
        communityUser.CommunityNickname = acct.LastName;
        communityUser.LocaleSidKey = 'en_US';
        communityUser.TimeZoneSidKey = 'GMT';
        communityUser.ProfileID = communityProfId;
        communityUser.LanguageLocaleKey = 'en_US';
        communityUser.EmailEncodingKey = 'UTF-8';
        return communityUser;
    }
    public Static User getAdminUser()   {
        List<Profile> profiles = [SELECT Id,name from Profile where name ='System Administrator'];
        Id systemAdminProfId = profiles[0].Id;
        List<User> users = [SELECT Id,name, profileId, UserRoleId FROM User WHERE profileId=:systemAdminProfId AND userRoleId !='' AND isActive = true LIMIT 1];
        return users[0];
    }
    public Static Goal_Response__c getTestGoalResponses(Account acct,String PeriodType,Integer goalNum, String performance, String condition)   {
        Goal_Response__c gr = new Goal_Response__c();
        gr.Period_Type__c = PeriodType;
        gr.Account__c = acct.Id;
        gr.Goal_Seq__c  = goalNum;
        gr.performance__c =performance;
        gr.condition__c =condition;
        gr.criterion__c ='2x per week';
        gr.Criterion_Value__c =2;
        gr.baseline__c ='1x per week';
        gr.baseline_Value__c=1;
        gr.difficulty__c ='Hard';
        gr.Frequency_6_wks__c='1x per week';
        gr.Frequency_6_wks_value__c=1;
        gr.Frequency_Surp_12_wks__c='2x per week';
        gr.Frequency_Surp_12_wks_value__c=2;
        gr.Frequency_Significant_Surp_12_wks__c='3x per week';
        gr.Frequency_Significant_Surp_12_wks_value__c=3;
        return gr;
    }
    public static List<Goal_Tracking__c> getTestGoalTrackings(Id goalResponseId,Integer noOfWeeks)  {
        List<Goal_Tracking__c> goalTrackings = new List<Goal_Tracking__c>();
        for(Integer i=1;i<=noOfWeeks;i++)   {
            Goal_Tracking__c gt = new Goal_Tracking__c();
            gt.goal_response__c=goalResponseId;
            gt.wk__c = i;
            gt.progress__c= (i+1)+'x per week';
            gt.progress_value__c=i+1;
            //gt.Submitted_Date__c =System.Today() - ((noOfWeeks -i)*7);
            gt.Submitted_Date__c = DateTime.now();
            goalTrackings.add(gt);            
        }
        return goalTrackings;
    }

    public Static Goal_Question__mdt getGoalQuestion(){
        Goal_Question__mdt gQuestion = new Goal_Question__mdt();
        gQuestion.MasterLabel = 'Performance';
        gQuestion.Sequence__c = 1.0;
        gQuestion.Question_Text__c = 'What goal do you want to set';
        gQuestion.Field_Name__c = 'Performance__c';
        gQuestion.Display_Type__c = 'Searchable';
        return gQuestion;
    }
    
    public static Advanced_Survey__c getSurvey(String surveyName)	{
        Advanced_Survey__c survey = new Advanced_Survey__c();
        survey.Name = surveyName;
        survey.Survey_Number__c=surveyName;
        return survey;
    }
    
    public static List<Advanced_Survey_Question__c> getSurveyQuestions(Id surveyId)	{
        String jsonString = '[ {"Question_Text__c" : "Introduction","Order__c" : 1,"Options__c" : "Welcome to the UNCOVER Study Understanding the patient experience during the COVID-19 pandemic, effects on real world quality of life, symptom management and clinical outcomes in patients treated and untreated for ADHD. <br /> <br /> This survey is part of our research collaboration between PatientsLikeMe and Takeda. We appreciate your time and willingness to share your experiences with us.The goal of this study is to better understand your symptoms of ADHD and which ones are most troublesome and hardest to resolve. During this study we will ask a variety of questions related to your experience with ADHD.","Active__c" : true,"Display_Type__c" : "Intro","Next_Question__c" : "{\\\"isSkip\\":false, \\"navMap\\":{}, \\"nextQues\\": 2}","Option_Other__c" : "{\\"isApplicable\\": \\"false\\"}"}, {"Question_Text__c" : "What is your country of residence?","Order__c" : 2,"Options__c" : "[{\\"label\\": \\"United States of America\\", \\"value\\": \\"USA\\"}, {\\"label\\": \\"Other than USA\\", \\"value\\": \\"Other\\"}]","Active__c" : true,"Display_Type__c" : "Radio Button","Next_Question__c" : "{\\"isSkip\\":true, \\"navMap\\":{\\"USA\\":3,\\"Other\\":4}, \\"nextQues\\": 3}","Option_Other__c" : "{\\"isApplicable\\":\\"true\\", \\"forValue\\":\\"Other\\" ,\\"forlabel\\":\\"Enter other country here\\"}"}, {"Question_Text__c" : "What is your birthdate?","Order__c" : 3,"Active__c" : true,"Display_Type__c" : "Date","Next_Question__c" : "{\\"isSkip\\":false, \\"navMap\\":{}, \\"nextQues\\": 4}","Option_Other__c" : "{\\"isApplicable\\": \\"false\\"}"}, {"Question_Text__c" : "What state do you live in?","Order__c" : 4,"Options__c" : "[{\\"label\\": \\"--None--\\", \\"value\\": \\"None\\"},{\\"label\\": \\"Alabama\\", \\"value\\": \\"Alabama\\"},{\\"label\\": \\"Alaska\\", \\"value\\": \\"Alaska\\"},{\\"label\\": \\"California\\", \\"value\\": \\"California\\"},{\\"label\\": \\"Florida\\", \\"value\\": \\"Florida\\"},{\\"label\\": \\"Georgia\\", \\"value\\": \\"Georgia\\"} ,{\\"label\\": \\"New Jersey\\", \\"value\\": \\"New Jersey\\"}]","Active__c" : true,"Display_Type__c" : "Combo Box","Next_Question__c" : "{\\"isSkip\\":false, \\"navMap\\":{}, \\"nextQues\\": 5}","Option_Other__c" : "{\\"isApplicable\\": \\"false\\"}"}, {"Question_Text__c" : "The pandemic has impacted my child/dependent’s daily ADHD medication routine due to…","Order__c" : 5,"Options__c" : "[{\\"label\\": \\"None\\", \\"value\\": \\"None\\"},{\\"label\\": \\"His/her feelings of anxiety\\", \\"value\\": \\"His/her feelings of anxiety\\"},{\\"label\\": \\"Changes to his/her Structured routine\\", \\"value\\": \\"Changes to his/her Structured routine\\"},{\\"label\\": \\"Changes due to the virtual learning environment\\", \\"value\\": \\"Changes due to the virtual learning environment\\"},{\\"label\\": \\"Other\\", \\"value\\": \\"Other\\"}]","Active__c" : true,"Display_Type__c" : "Checkbox Group","Next_Question__c" : "{\\"isSkip\\":false, \\"navMap\\":{}, \\"nextQues\\": 6}","Option_Other__c" : "{\\"isApplicable\\":\\"true\\", \\"forValue\\":\\"Other\\" ,\\"forlabel\\":\\"If other, please specify:\\"}"}, {"Question_Text__c" : "Please describe the top goals (1-3) that matter most for your child/dependent.","Order__c" : 6,"Active__c" : true,"Display_Type__c" : "Text Area","Next_Question__c" : "{\\"isSkip\\":false, \\"navMap\\":{}, \\"nextQues\\": 7}","Option_Other__c" : "{\\"isApplicable\\": \\"false\\"}"}, {"Question_Text__c" : "What is your Mobile Number?","Order__c" : 7,"Active__c" : true,"Display_Type__c" : "Number","Next_Question__c" : "{\\"isSkip\\":false, \\"navMap\\":{}, \\"nextQues\\": 8}","Option_Other__c" : "{\\"isApplicable\\": \\"false\\"}"}, {"Question_Text__c" : "Have your ADHD symptoms changed during the pandemic or have new symptoms emerged?","Order__c" : 8,"Active__c" : true,"Display_Type__c" : "Text","Next_Question__c" : "{\\"isSkip\\":false, \\"navMap\\":{}, \\"nextQues\\": \\"End\\"}","Option_Other__c" : "{\\"isApplicable\\": \\"false\\"}"} ]';
        List<Advanced_Survey_Question__c> questions= (List<Advanced_Survey_Question__c>)JSON.deserialize(jsonString, List<Advanced_Survey_Question__c>.class);
       
        for(Advanced_Survey_Question__c qn : questions)	{
            qn.Advanced_Survey__c=surveyId;
        }
        return questions;
    }
    public static Advanced_Survey_Response__c getSurveyResponse(Id AccountId, Id surveyId)	{
        Advanced_Survey_Response__c response = new Advanced_Survey_Response__c();
        response.Advanced_Survey__c =surveyId;
        response.PLM_User__c = accountId;
        return response;
    }
    
     public static Advanced_Survey_Response__c getSurveyResponseWithStatus(Id AccountId, Id surveyId, string status)	{
        Advanced_Survey_Response__c response = new Advanced_Survey_Response__c();
        response.Advanced_Survey__c =surveyId;
        response.PLM_User__c = accountId;
        response.status__c = 'Complete';
        return response;
    }
}