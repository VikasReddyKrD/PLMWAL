public with sharing class TaskController {
    @AuraEnabled(cacheable=true)
    public static List<Task> getTasks(String accountId, Integer currentWk, Integer sessionNo ) {
        system.debug('Account id is '+accountId);
        system.debug('Current week is '+currentWk);
        system.debug('Session: '+sessionNo);
        try {
            List<Task> tasks;
            // if(currentWk ==0 || currentWk == 1)
            //     tasks = [SELECT Task_key__c,Subject,Display_Sequence__c, Priority, Status, Session_Number__c FROM Task Where accountId= :accountId  
            //     AND  (WeekNumber__c = 0 OR WeekNumber__c = 1)
            //     AND Session_Number__c =: sessionNo
            //     ORDER BY WeekNumber__c, Display_Sequence__c
            //     ];
            // else 
            //     tasks = [SELECT Task_key__c,Subject,Display_Sequence__c, Priority, Status, Session_Number__c FROM Task Where accountId= :accountId  
            //         AND  ((WeekNumber__c < :currentWk AND (Status != 'Completed' OR SystemModStamp = TODAY)) OR WeekNumber__c = :currentWk) 
            //         AND Session_Number__c =: sessionNo
            //         ORDER BY WeekNumber__c, Display_Sequence__c
            //         ];  

            string query = 'SELECT Task_key__c,Subject,Display_Sequence__c, Priority, Status, Session_Number__c, Optional__c FROM Task Where accountId= :accountId ' ;

            if(sessionNo == 1){
                if(currentWk ==0 || currentWk == 1){
                    system.debug('Inside 1');
                    query += 'AND  (WeekNumber__c = 0 OR WeekNumber__c = 1)AND Session_Number__c = 1 ORDER BY WeekNumber__c, Display_Sequence__c';
                }
                else{
                    system.debug('Inside 2');
                    query += 'AND (((WeekNumber__c < :currentWk AND (Status != \'Completed\' OR SystemModStamp = TODAY)AND Optional__c != true) OR WeekNumber__c = :currentWk) AND Session_Number__c = 1) ORDER BY WeekNumber__c, Display_Sequence__c'; 
                }
            }
            else if(sessionNo ==2){
                system.debug('Inside 5');
                if(currentWk ==0 || currentWk ==1 ){
                    system.debug('Inside 3');
                    query += 'And (((Session_Number__c = 1 AND (WeekNumber__c <= 13 AND (Status != \'Completed\' OR SystemModStamp = TODAY))) AND Optional__c != TRUE) OR (Session_Number__c = 2 AND (WeekNumber__c = 0 OR WeekNumber__c = 1))) ORDER BY Session_Number__c,WeekNumber__c, Display_Sequence__c'; 
                }
                else{
                    system.debug('Inside 4');
                query += 'AND ((Session_Number__c = 1 AND (WeekNumber__c <= 13 AND (Status != \'Completed\' OR SystemModStamp = TODAY)) AND Optional__c != TRUE ) OR ( Session_Number__c = 2 AND ((WeekNumber__c < :currentWk AND (Status != \'Completed\' OR SystemModStamp = TODAY) AND Optional__c != TRUE) OR WeekNumber__c = :currentWk)) ) ORDER BY Session_Number__c,WeekNumber__c, Display_Sequence__c';
                }
            }
            tasks = Database.query(query);
            system.debug('Task is '+tasks);
            return tasks; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }   
    }

    @AuraEnabled
    public static List<Goal_Tasks__mdt> getTasksMetadata(List<String> taskKeys){
        try {
            System.debug('the taskKeys are '+ taskKeys);
            List<Goal_Tasks__mdt> gTasks=[select id,Task_key__c,video__c,Optional__c from Goal_Tasks__mdt WHERE Task_key__c  in :taskKeys];
            return gTasks;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}