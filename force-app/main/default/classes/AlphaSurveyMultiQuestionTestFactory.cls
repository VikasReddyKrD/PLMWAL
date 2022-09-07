@isTest
    public class AlphaSurveyMultiQuestionTestFactory {
    public static User createUser(){
        /* Account acc= new Account();
acc.Salutation='Mr';
acc.lastname='AlphaTestUser';
acc.Alpha_Current_Section__c ='8';
acc.RecordTypeId='0126A000000VISYQA4';
insert acc;
system.debug('AccountInsertion'+acc);
Contact con= new Contact();
con.Account.Id=acc.id;
con.RecordTypeId='0126A000000VISYQA4';
con.LastName='TestUser';
insert con;
system.debug('ContactInsertion'+con);
User user = new User();
user.LastName='TestUser';
user.Alias='test';
user.Email='ksudheer@dextara.com';
user.Username='sudheer@gmail.com';

user.ContactId=con.Id;

user.Title='title';
user.ProfileId=[SELECT Id FROM Profile WHERE Name ='Customer Community Plus Login User Custom'].Id;
//system.debug('profileId'+ProfileId);
return user;*/
        
        Account acc = new Account(
            RecordTypeID='0126A000000VISYQA4',
            FirstName='Test FName',
            LastName='Test LNames',
            PersonMailingStreet='test@yahoo.com',
            PersonMailingPostalCode='12345',
            PersonMailingCity='SFO',
            PersonEmail='test123@yahoo.com',
            PersonHomePhone='1234567',
            PersonMobilePhone='12345678'
            
        );
        insert acc;
        Account a = [Select Id,PersonContactId from Account where Id=: acc.Id LIMIT 1];
        
        Profile portalProfile = [SELECT Id FROM Profile WHERE Name='Customer Community Plus Login User Custom' Limit 1];
        User user1 = new User(
            UserName = 'test'+acc.PersonEmail,
            FirstName = acc.FirstName+'345',
            LastName = acc.LastName,
            Alias = 'test123',
            email = acc.PersonEmail,
            ContactId = a.PersonContactId,
            ProfileId = portalProfile.Id,
            EmailEncodingKey = 'UTF-8',
            CommunityNickname = acc.LastName,
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            LanguageLocaleKey = 'en_US'
        );
        insert user1;
        return user1;
        //system.debug('acc===>'+user1);
        
    }
    public static Account createAccount(id consentId){
        Account acc= new Account();
        acc.Salutation='Mr';
        acc.lastname='AlphaTestUser';
        acc.Alpha_Current_Section__c ='8';
        acc.RecordTypeId=system.label.PersonAccount;
        acc.Study_Consent__c = consentId;
        insert acc;
        return acc;
    }
    public static Advanced_Survey__c createAdvancedSurvey(){
        Advanced_Survey__c advs= new Advanced_Survey__c();
        advs.name='AlphaSurvey1';
        advs.Survey_Number__c='Alpha-Survey-1';
        insert advs;
        return advs;
       
    }
    public static Advanced_Survey_Question__c createAdvancedSurveyQuestion(Advanced_Survey__c advs){
        Advanced_Survey_Question__c adqs= new Advanced_Survey_Question__c();
        adqs.Advanced_Survey__c=advs.Id;
        adqs.Display_Type__c='Text';
        adqs.Options__c='TestLable';
        adqs.Label__c='10';
        adqs.skipNumberTransplant__c='TestSection';
        adqs.transplantNestedOptions__c='Testquestiontab';
        adqs.Next_Question__c='TestQuestion';
        adqs.Active__c=true;
        adqs.Order__c=23;
        adqs.Order_Text__c='testaccountorder';
        adqs.modelContent__c='testmodel';
        adqs.Question_Text__c='Testmessge';
        adqs.Section_Name__c='testpart';
        adqs.Transition_Message__c='Thankyouforresponce';
        adqs.Transplant__c='Patient';
        adqs.isDisplayqno__c=true;
        system.debug('adqsId'+adqs);
        insert adqs;
        return adqs;
        
    }
    public static Advanced_Survey_Answer__c createAdvancedSurveyAnswer(Id questionId,id advancedSurveyResponseId,id userId){
        Advanced_Survey_Answer__c adsa= new Advanced_Survey_Answer__c();
        adsa.Advanced_Survey_Question__c= questionId;
        adsa.Text_Response_Value__c='I am extremely anxious or depressed,I have moderate pain or discomfort,I have moderate problems doing my usual activities,I have moderate problems washing or dressing myself,I have severe problems walking-51';
        adsa.Number_Response_Value__c=23;
        adsa.Date_Response_Value__c=system.today();
        adsa.Other_Response_Value__c='Textareavalue';
        adsa.Advanced_Survey_Response__c=advancedSurveyResponseId;
        adsa.PLM_User__c=userId;
        insert adsa;
        return adsa;
        
    }
    public static Advanced_Survey_Response__c createAdvancedSurveyResponse(Advanced_Survey__c advs,Account acc){
        Advanced_Survey_Response__c adsr= new Advanced_Survey_Response__c();
        adsr.PLM_User__c=acc.Id;
        adsr.Advanced_Survey__c=advs.id;
        insert adsr;
        return adsr;
        
        
    }
    
}