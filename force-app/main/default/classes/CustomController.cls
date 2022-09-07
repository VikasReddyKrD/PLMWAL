public class CustomController {
 private final Account account;
 
    public CustomController() {
        account = [SELECT Id, Name, Site FROM Account 
                   WHERE Id = :ApexPages.currentPage().getParameters().get('id')];
    }
 
    public Account getAccount() {
        return account;
    }
 
    public PageReference save() {
        update account;
        return null;
    }
}