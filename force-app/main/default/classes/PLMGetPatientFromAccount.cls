public class PLMGetPatientFromAccount {
    @AuraEnabled
    public static list<Account> getAccountDetails(){
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];  
        list<Account> acc =[select id,Transplant_Patient_Type__c from Account WHERE ID=:user.AccountId];
        return acc;
    }
}