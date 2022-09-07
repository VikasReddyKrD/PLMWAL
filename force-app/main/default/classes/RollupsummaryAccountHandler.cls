public class RollupsummaryAccountHandler {
    //after insert
    public void afterInsert(map<Id,contact> newmap){
        //account to update
        set<Id>accids=new set<Id>();
        //iterate to get account ids
        for(Contact con : newmap.values()){
            //check contact have account id
            if(con.AccountId !=null){
                //adding account id to the set<id>
                accids.add(con.AccountId);
                
            }
        }
        
    }
    //accounts to be updated
    private void updateAccounts(set<Id> accountids){
        //getting account records based on accountids
        List<Account> accList =[Select Id, No_Of_Contacts__c,(Select Id FROM Contacts)From Account Where Id IN:accountids];
        //iterating accounts to update total contacts from child to parent query
        for(Account acc:accList)
            acc.No_Of_Contacts__c = acc.Contacts.size();
        
    }

}