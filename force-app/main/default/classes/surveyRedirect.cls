public with sharing class surveyRedirect {
    @AuraEnabled
    public static List<Advanced_Survey_Response__c> surveyRedirectMethod() {
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        system.debug('hjwdbjvhwv'+user.AccountId);
        // Account  acc= [SELECT id,(Select id from Advanced_Survey_Responses__r) FROM Account WHERE Id=:user.accountId]; 
       List<Advanced_Survey_Response__c> resList = [Select id,Advanced_Survey__c from Advanced_Survey_Response__c WHERE 
       PLM_User__c = '001e000001eA2qJAAS'];
        return resList;
    }
}