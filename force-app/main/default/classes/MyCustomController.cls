public class MyCustomController 
{
     private final Account account;

    public MyCustomController() {
        //account = [SELECT Id, Name FROM Account WHERE Id = :ApexPages.currentPage().getParameters().get('id')];
        account = [SELECT Id, Name FROM Account LIMIT 30];
    }

    public Account getAccount() {
        return account;
    }

   /* public PageReference save() {
        update account;
        return null;
    } */
}