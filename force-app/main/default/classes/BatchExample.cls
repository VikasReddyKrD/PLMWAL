global class BatchExample implements Database.Batchable<sObject>{
    global Database.QueryLocator start(Database.BatchableContext bc){
        //collect the batches of records or objects to be passes to execute
        String q='select Id,Name from Account';
        return Database.getQueryLocator(q);
    }
    global void execute(Database.BatchableContext bc, List<Account> acList){
        //process each batch of records
        for(Account ac:acList)
        {
            ac.Name=ac.name+'Appended by batch job';
        }
        try
        {
            update acList;
        }
        Catch(Exception r)
        {
            system.debug(r.getMessage());
        }
    }
    global void Finish(Database.BatchableContext bc){
        System.debug('Batch execution finished');
    }
}