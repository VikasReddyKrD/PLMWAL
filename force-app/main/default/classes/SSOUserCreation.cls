@RestResource(urlMapping='/insertuser')
global class SSOUserCreation {
    @HttpPost
	global static void insertAccount(){
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        String inputJson = req.requestBody.toString();
        Wrapper wrapper =(Wrapper)JSON.deserializeStrict(
                            inputJson,
                            Wrapper.class);
        Study_Consent__c consent = new Study_Consent__c();
        consent.Collaborator__c = 'Takeda Pharmaceuticals';
        consent.Investigator__c = 'Mary C. Burke, MD / Subhara Raveendran';
        consent.Existing_Record__c = false;
        consent.Title_of_Study__c = 'Alpha-1 Insight Study: Patient Experience with alpha-1-antitrypsin deficiency (AATD): Diagnostic Journey and Patient Insights';
        consent.Phone_Number__c = '(857) 663-7576';
        insert consent;

        RecordType personAccountRecordType =  [SELECT Id FROM RecordType WHERE Name = 'Person Account' and SObjectType = 'Account'];
        Account newPersonAccount = new Account();
        
        //newPersonAccount.FirstName = wrapper.firstname;
        newPersonAccount.LastName = wrapper.lastname;
        newPersonAccount.RecordType = personAccountRecordType;
        newPersonAccount.Study_Consent__c = consent.id;
        newPersonAccount.PersonEmail = wrapper.email;
        insert newPersonAccount;
        System.debug('newPersonAccount '+newPersonAccount);
        Account acc = [Select FirstName,LastName,Study_Consent__c,PersonEmail,PersonContactId FROM Account WHERE id=:newPersonAccount.id];

        insertUser(inputJson,acc.PersonContactId); 
    }
  
    public static void insertUser(String inputJson,Id contactId){
		
        ID jobID = System.enqueueJob(new PortalUserCreation(inputJson,contactId));
        
    }
    @AuraEnabled
    public static string getAdvanceSurvey(){
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        List<Available_Survey__c> avaiList = [select id,Advanced_Survey__r.Survey_Number__c from Available_Survey__c where Account__c =:user.AccountId];
        // return userinfo.getuserId();
        return avaiList[0].Advanced_Survey__r.Survey_Number__c;
    }
    
   
   
    public class Wrapper{
        public String firstname;
        public String lastname;
        public String email;
        public String salutation;
    }
}