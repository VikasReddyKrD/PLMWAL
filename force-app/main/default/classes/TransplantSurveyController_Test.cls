@isTest
private class TransplantSurveyController_Test {
    
    private  static testMethod void createTest(){
        EmailTemplate em = new EmailTemplate();
        em.DeveloperName ='Test';
        em.Body='Hello';
        em.TemplateType='custom';
        em.FolderId='00De0000005XLa8EAG';
        em.Subject='TODAY AT 11 AM: Tune in to Hear Double Lung Transplant Patient Bret Ambrose Share His Remarkable Story';
        em.Name='Thank You Email [Patients and Care Partner]';
        insert em;
        
        Account acc= new Account();
       // acc.Person_Contact_ID__c = '';
        acc.Transplant_Patient_Type__c ='Patient';
        acc.Study_Consent__c = 'a2Te00000035bEYEAY';
        insert acc;
        
        
        
        user ur = [select id,name,UserRole.name,Email,profile.name  from User where profile.name='System Administrator' and name='Vinay'];
        System.runAs(new User(Id=UserInfo.getUserId())) {
          ur = new user();
          ur.lastname = 'New Role';
          //ur.id=acc.id;
          insert ur;
        }
       
        Test.startTest();
        TransplantSurveyController.TransplantTankYouEmailAlert();
        Test.stopTest();           
        
    }
   /* public static testMethod void createTestOne(){
           
        Account acc= new Account();
        acc.Transplant_Patient_Type__c ='Patient';
        acc.Study_Consent__c = 'a2Te00000035bEYEAY';
        insert acc;
        
        user ur = new user();
        ur.Id=acc.id;
        insert ur;
        
        Advanced_Survey__c as = new Advanced_Survey__c();
        
    }*/

}