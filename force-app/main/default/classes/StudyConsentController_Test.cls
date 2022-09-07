@isTest
public class StudyConsentController_Test {
    public static testmethod void createUserData(){
        Account acc= new Account();
        acc.Salutation='Mr';
        acc.lastname='AlphaTestUser';
        acc.Alpha_Current_Section__c ='8';
        acc.RecordTypeId=system.label.PersonAccount;
        insert acc;
        
    
        Profile portalProfile = [SELECT Id FROM Profile WHERE Name='Customer Community Plus Login User Custom' Limit 1];
        User user1 = new User(
            UserName = 'test'+acc.PersonEmail,
            FirstName = acc.FirstName+'345',
            LastName = acc.LastName,
            Alias = 'test123',
            email = acc.PersonEmail,
            ContactId = acc.PersonContactId,
            ProfileId = portalProfile.Id,
            EmailEncodingKey = 'UTF-8',
            CommunityNickname = acc.LastName,
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            LanguageLocaleKey = 'en_US'
        );
        insert user1;
        
    }

}