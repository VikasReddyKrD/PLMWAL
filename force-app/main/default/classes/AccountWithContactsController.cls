public class AccountWithContactsController {
	@AuraEnabled(cacheable=true)
    public static list<Account> getAccountAndContacts(String recordId){
        //string accountId
        List<Account> lstAccount = new List<Account>([SELECT Id, Name,(Select Id,Name From Contacts) FROM Account WHERE Id =:recordId]);
        return lstAccount;
    }
}