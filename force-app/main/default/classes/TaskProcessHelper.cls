public With sharing class TaskProcessHelper {
    
    Public static void updateTaskAsCompleted(Map<Id,List<TaskProcessHelper.TaskWrapper>> accidwrapMap){
        Set<String> taskKeys=new set<string>();
        List<Task> updatetasks=new List<Task> ();
        System.debug('the input for TaskProcessHelper.updateTaskAsCompleted is '+JSON.serializePretty(accidwrapMap));
    
        for(Id acctId:accidwrapMap.keyset()){  //get the task keys from task list related to the Account
            for(TaskProcessHelper.TaskWrapper tw:accidwrapMap.get(acctId) ){
                taskKeys.add(tw.task_key);
            }           
        }
        //we will compare database results against the input so that we will process only one update for a record.  There is a possibility that inputList(from the map) can contain same task record multiple times
        for(Task tsk:[select Id,Task_key__c,WhatId,Status  from Task where WhatId IN:accidwrapMap.keyset() AND Task_key__c IN:taskKeys and Status!='Completed']){
            for(TaskProcessHelper.TaskWrapper tskInwrap:accidwrapMap.get(tsk.whatId)){
                if(tskInwrap.task_key==tsk.Task_key__c){
                    tsk.Status='Completed';
                    updatetasks.add(tsk);
                    break;  //break the innerloop as it is already added to the processing list once
                }
            }
        }
        if(updatetasks.size()>0){
            update updatetasks;
        } 
    }
    
    

    @AuraEnabled
    public static void completeTaskFromLWC(String accountId, String tskwrpListStr){
        try {
            System.debug('inside the method of completeTaskFromLWC- accountId:'+accountId+' tskwrpListStr: '+tskwrpListStr);
            List<TaskProcessHelper.TaskWrapper> tskwrpList = (List<TaskProcessHelper.TaskWrapper>)JSON.deserialize(tskwrpListStr, List<TaskProcessHelper.TaskWrapper>.class);
            Map<Id,List<TaskProcessHelper.TaskWrapper>> acctwrp = new Map<Id,List<TaskProcessHelper.TaskWrapper>>();
            acctwrp.put((Id)accountId, tskwrpList);
            updateTaskAsCompleted(acctwrp);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class TaskWrapper{
        public id accid;
        public integer weekNo;
        public string task_key;
        public string session;
        public TaskWrapper(id accid,integer weekno,string typeofgoal,String identifier, string session){
            this.accid=accid;
            this.weekNo=weekno;
            this.session = session;
            this.task_key=session+'-'+weekno+'-'+typeofgoal+'-'+identifier;
        }
    }
       
    
}