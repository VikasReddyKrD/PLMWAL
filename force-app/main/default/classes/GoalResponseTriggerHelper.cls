public class GoalResponseTriggerHelper {
    Public Static void updateTaskForGoalResponses(List<Goal_Response__c> goalResponses){
        Map<Id,List<TaskProcessHelper.TaskWrapper>> accidwrapMap =new  Map<Id,List<TaskProcessHelper.TaskWrapper>>();
        Map<string,string> periodTypeMapping = new Map<string,string>{'Session 1' => '1','Session 2'=> '2'};
        if(Trigger.isExecuting && Trigger.isInsert && Trigger.isAfter)	{
            for(Goal_Response__c gr:goalResponses){
                string sessionNumber = periodTypeMapping.get(gr.Period_Type__c);
                List<TaskProcessHelper.TaskWrapper> teaswraps;
                Integer week=0;
                // if( gr.Period_Type__c=='Session 1')
                //     week=0;
                // else if( gr.Period_Type__c=='Session 2')
                //     week=13;
                
                if(accidwrapMap.containsKey(gr.Account__c))
                    teaswraps=accidwrapMap.get(gr.Account__c);                    
                else
                    teaswraps=new  List<TaskProcessHelper.TaskWrapper>();
                        
                teaswraps.add(new TaskProcessHelper.TaskWrapper(gr.Account__c,week,'Goal','1',sessionNumber));
                accidwrapMap.put(gr.Account__c,teaswraps);
            } 
            if(accidwrapMap.keyset().size()>0){
                TaskProcessHelper.updateTaskAsCompleted(accidwrapMap);
            }
        }
    }  
}