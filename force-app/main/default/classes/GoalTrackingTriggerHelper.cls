public class GoalTrackingTriggerHelper {
    Public Static void updateTaskForGoalTrackings(List<Goal_Tracking__c> goaltracks){
        Set<id> acountids=new set<id>();
        //Set<id> goalsids=new set<id>();
        Map<id,integer> accountGoalCountmap=new Map<id,integer>();
        Map<id,integer> accountGoalCountmap_2=new Map<id,integer>();
        Map<id,Map<string,integer>> goalweekTrackcountMap=new Map<id,Map<string,integer>>(); //C
        Map<string,string> periodTypeMapping = new Map<string,string>{'Session 1' => '1','Session 2'=> '2'}; //C
        for(Goal_Tracking__c gt:goaltracks){
            acountids.add(gt.Account_ID__c);
            //goalsids.add(gt.Goal_Response__c);
        }
        if(Trigger.isExecuting && Trigger.isInsert && Trigger.isAfter)	{
            //Get the count of Goals for each account split by PeriodType
            for(AggregateResult aggr:[SELECT count(id) con,Account__c accid,Period_Type__c pt  FROM Goal_Response__c where Account__c IN:acountids group by Account__c,Period_Type__c]){
                string period=(string)aggr.get('pt');
                if(period=='Session 1') //C
                    accountGoalCountmap.put((Id)aggr.get('accid'),(Integer)aggr.get('con'));
                else if(period=='Session 2') //C
                    accountGoalCountmap_2.put((Id)aggr.get('accid'),(Integer)aggr.get('con'));   
            }

            //Get the count of Goals for each week in the account
            for(Goal_Response__c gr:[select id,Account__c,(select id,WK__c,Goal_Response_Period_Type__c from Goal_Trackings__r) from Goal_Response__c where Account__c IN:acountids]){
                for(Goal_Tracking__c gtrack:gr.Goal_Trackings__r){
                    string sessionWeek;
                    if(gtrack.Goal_Response_Period_Type__c != null &&  gtrack.WK__c != null)
                        sessionWeek = periodTypeMapping.get(gtrack.Goal_Response_Period_Type__c) + '-' + gtrack.WK__c;

                    Map<string,integer> weektrackmap;//=goalweekTrackcountMap.get(gr.Account__c);
                    if(goalweekTrackcountMap.containsKey(gr.Account__c)){
                        weektrackmap=goalweekTrackcountMap.get(gr.Account__c);
                    }else{
                        weektrackmap=new Map<string,integer>();
                    }
                    //if first entry then put  1 else increment
                    if(weektrackmap.containsKey(sessionWeek)){
                        weektrackmap.put(sessionWeek,weektrackmap.get(sessionWeek)+1);
                    }else{
                        weektrackmap.put(sessionWeek,1);
                    }
                    goalweekTrackcountMap.put(gr.Account__c,weektrackmap);
                }
            }
            Map<Id,List<TaskProcessHelper.TaskWrapper>> accidwrapMap =new  Map<Id,List<TaskProcessHelper.TaskWrapper>>();
            for(Goal_Tracking__c gt:goaltracks){
                string sessionWeekFinal;
                if(gt.Goal_Response_Period_Type__c != null &&  gt.WK__c != null)
                     sessionWeekFinal = periodTypeMapping.get(gt.Goal_Response_Period_Type__c) + '-' + gt.WK__c;
                if(goalweekTrackcountMap.containsKey(gt.Account_ID__c) && (accountGoalCountmap.ContainsKey(gt.Account_ID__c) ||accountGoalCountmap_2.ContainsKey(gt.Account_ID__c))){
                    Map<string,integer> weektrackmap=goalweekTrackcountMap.get(gt.Account_ID__c);
                
                    Integer goalcount=accountGoalCountmap.containskey(gt.Account_ID__c)?accountGoalCountmap.get((gt.Account_ID__c)):null;
                    System.debug('goalcount===>'+goalcount);
                    Integer goalcount_2=accountGoalCountmap_2.containskey(gt.Account_ID__c)?accountGoalCountmap_2.get((gt.Account_ID__c)):null;
                    System.debug('goalcount_2===>'+goalcount_2);
                    integer trackcountbyweek=weektrackmap.containsKey(sessionWeekFinal)?weektrackmap.get(sessionWeekFinal):null;
                    System.debug('trackcountbyweek===>'+trackcountbyweek);
                    //add to the list of tasks to be completed if the no of tracking records in a week matches with no of goals
                    if((goalcount==trackcountbyweek && gt.Goal_Response_Period_Type__c=='Session 1') || (goalcount_2==trackcountbyweek && gt.Goal_Response_Period_Type__c=='Session 2') ){
                        List<TaskProcessHelper.TaskWrapper> teaswraps;
                        if(accidwrapMap.containsKey(gt.Account_ID__c)){
                            teaswraps=accidwrapMap.get(gt.Account_ID__c);
                        }else{
                            teaswraps=new  List<TaskProcessHelper.TaskWrapper>();
                        }
                        teaswraps.add(new TaskProcessHelper.TaskWrapper(gt.Account_ID__c,(Integer)gt.WK__c+1,'Track','1',periodTypeMapping.get(gt.Goal_Response_Period_Type__c)));
                        accidwrapMap.put(gt.Account_ID__c,teaswraps);
                        System.debug('goalcount===accidwrapMap===>'+accidwrapMap);
                    }
                }
            }
            if(accidwrapMap.keyset().size()>0){
                TaskProcessHelper.updateTaskAsCompleted(accidwrapMap);
            }
        }        
    }
}