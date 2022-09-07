public class UserTriggerHandler {
    Public static void taskCreationForGoals(List<User> users){
        if(Trigger.isExecuting && Trigger.isInsert && Trigger.isAfter)	{
            set<id> uids=new set<Id>();
            Profile p=[select id from profile where name='Customer Community Plus Login User Custom' limit 1];
            for(User u:users){
                if(u.AccountId!=null && u.ProfileId==p.id){
                    uids.add(u.id);
                }
            }
            if(uids.size()>0){
                taskCreationForGoalsfuture(uids);
            }
        }
        
    }
    @future
    Public static void taskCreationForGoalsfuture(set<Id> userids){
        
        List<User> filteredusers=[select id,AccountId from user where id IN:userids];
        
        if(filteredusers.size()>0){
            List<Goal_Tasks__mdt> gTasks=[select id,Task_key__c,Display_Sequence__c,Task_Subject__c,Week_No__c,Session__c, Optional__c from Goal_Tasks__mdt];
            List<Task> insertTasks=new List<Task>();
            for(User u:filteredusers ){
                for(Goal_Tasks__mdt gt:gTasks){
                    Task tk=new Task();
                    tk.Subject=gt.Task_Subject__c;
                    tk.Status='Not Started';
                    tk.WeekNumber__c = gt.Week_No__c;
                    tk.Ownerid=u.id;
                    tk.whatid=u.AccountId;
                    tk.ActivityDate=System.today();
                    tk.Task_key__c=gt.Task_key__c;
                    tk.Display_Sequence__c=gt.Display_Sequence__c;
                    tk.Session_Number__c=gt.Session__c;
                    tk.Optional__c=gt.Optional__c;
                    insertTasks.add(tk);
                }
                
            }
            if(insertTasks.size()>0){
                insert insertTasks;
            }
        }
    }
}