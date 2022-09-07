public class DeleteRelatedRecords {
    public static void realtedRecords(Id recIds){
        List<Account> accList = [select id from Account where ID =: recIds];
        system.debug('del'+accList);
        delete acclist;
        
    }
}