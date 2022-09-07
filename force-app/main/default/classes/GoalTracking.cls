public with sharing class GoalTracking {
    /*public class goalTrackingWrapper{
        List<GoalQuestionWrapper> GoalQuestionWrapper;
    }
    class GoalQuestionWrapper{
        String question;
        String displayOrder;
        String goalResponseId;
        Decimal criterion_value;
        Decimal baseline_value;
        String periodType;
        
    }*/		
    
    @AuraEnabled
    public static Goal_Tracking__c createGoalTracking(Goal_Tracking__c goalTracking){
        system.debug('System DateTime is ' + DateTime.now());
        system.debug('System DateTime is ' + System.now());
        system.debug('User DateTime is ' + DateTime.now().format());
        system.debug('User DateTime is ' + System.now().format());
      	goalTracking.Submitted_Date__c = DateTime.now();
        
        insert goalTracking;
        return goalTracking;
    }
    
    /*
    @AuraEnabled(cacheable=true)
    public static String getGoals(String accountId, String period, String currentWk, String responseId){
        Integer currentWkInt = Integer.valueOf(currentWk);
        List<Goal_Response__c> goalResponses = [SELECT Id, Goal_Seq__c, performance__c,condition__c,
                                                criterion__c,Criterion_Value__c, difficulty__c,Period_Type__c,baseline_Value__c
                                                FROM goal_response__c 
                                                WHERE Account__c=:accountId 
                                                AND Period_Type__c= :period 
                                                AND id =: responseId
                                                WITH SECURITY_ENFORCED
                                                ORDER BY Goal_Seq__c
                                                LIMIT 3];
        Map<Id, Goal_Response__c> goalRespMap = new Map<Id, Goal_Response__c> (goalResponses);
        List<Goal_Tracking__c> goalTrackings = [SELECT goal_response__c,goal_response__r.Goal_Seq__c,wk__c, progress_value__c
                                                FROM goal_tracking__c
                                                WHERE goal_response__c IN :goalRespMap.keySet()
                                                WITH SECURITY_ENFORCED
                                                ORDER BY goal_response__c, wk__c];
        Map<Id, List<Goal_Tracking__c>> goalTrackMap = new Map<Id, List<Goal_Tracking__c>>();
        Map<String,String> quesRef = new Map<String,String>();
        for(Goal_Tracking__c goalTrack:goalTrackings){
            List<Goal_Tracking__c> goalTrackList;
            if(goalTrackMap.containsKey(goalTrack.goal_response__c))    
                goalTrackList = goalTrackMap.get(goalTrack.goal_response__c);
            else
                goalTrackList = new List<Goal_Tracking__c>();
            goalTrackList.add(goalTrack);
            goalTrackMap.put(goalTrack.goal_response__c, goalTrackList);
        }
        System.debug('goalTrackMap'+goalTrackMap);
        integer goalresponseCount = goalResponses.size();
        Set<Decimal> missingWksSet = new Set<Decimal>();
        for(Integer i=1;i<currentWkInt; i++){
           // for(Integer j=1;j<=goalresponseCount;j++){
           Goal_Response__c goalResponse = goalResponses.get(0);
           string[] splitted = String.valueOf(goalResponse.Goal_Seq__c).split('\\.');
                    missingWksSet.add(i+(Integer.valueOf(splitted[0])*0.1));
               // }
        }
        System.debug('MissingWeeks initial'+missingWksSet);
        for(Goal_Response__c goalResp: goalResponses){
            String quesFrame = 'How many times did you ' + goalResp.Performance__c + ' ' + goalResp.Condition__c + ' this week ?';
            quesRef.put(String.valueOf(goalResp.Goal_Seq__c),quesFrame);
            List<Goal_Tracking__c> relatedGoalTrackings = goalTrackMap.get(goalResp.Id);
            if(relatedGoalTrackings != null && relatedGoalTrackings.size()>0)   {
                for(Goal_Tracking__c track : relatedGoalTrackings)  {
                    //string[] splitted = String.valueOf(track.goal_response__r.Goal_Seq__c).split('\\.');
                    missingWksSet.remove(track.wk__c+(track.goal_response__r.Goal_Seq__c * 0.1));
                }
            }
        }
        List<GoalQuestionWrapper> GoalQuestionWrapper = new List<GoalQuestionWrapper>();
        List<goalTrackingWrapper>  goalTrackWrapList = new List<goalTrackingWrapper>();
        for(Decimal missweeks : missingWksSet){
            GoalQuestionWrapper goalquestionwrap = new GoalQuestionWrapper();
            string[] splitted = String.valueOf(missweeks).split('\\.');
            Goal_Response__c goalResponse = goalResponses.get(0);
            goalquestionwrap.question = quesRef.get(splitted[1]);
            goalquestionwrap.displayOrder = String.valueOf(missweeks);
            goalquestionwrap.goalResponseId = goalResponse.id;
            goalquestionwrap.criterion_value = goalResponse.Criterion_Value__c;
            goalquestionwrap.baseline_value = goalResponse.Baseline_Value__c;
            goalquestionwrap.periodType = goalResponse.Period_Type__c;
            
            GoalQuestionWrapper.add(goalquestionwrap);
        }
        goalTrackingWrapper goaltrackWrap = new goalTrackingWrapper();
        goaltrackWrap.GoalQuestionWrapper = GoalQuestionWrapper;
        if(goaltrackWrap.GoalQuestionWrapper.size()>0)
            goalTrackWrapList.add(goaltrackWrap);
        
        System.debug('MissingWeeks After removal'+missingWksSet);
        System.debug('JSON.serialize(goalTrackWrapList)->'+JSON.serialize(goalTrackWrapList));
        return JSON.serialize(goalTrackWrapList);
    }
    */
}