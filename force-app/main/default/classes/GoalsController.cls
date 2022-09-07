public with sharing class GoalsController {
    public Class GoalsControllerException extends Exception{}
    public class ChartDataInput	{
        String id;
        String title;
        //String target;
        String goalNum;
        String Performance;
        String Condition;
        String baseline;
        String criterion;
        //String goalName;
        List<Integer> chartData;
        List<Integer> targetLineData;
        List<String> bgColor;
        Set<Integer> missingWks;
        ChartDataInput()	{
            chartData = new List<Integer>();
            bgcolor = new List<String>();
            missingWks = new Set<Integer>();
            targetLineData = new List<Integer>();
        }
    }
    
    @AuraEnabled (cacheable = true)
    public static String getGoalsChartData(String accountId, String period, String currentWk)	{
        List<ChartDataInput> chartDataList;
        Integer currentWkInt = Integer.valueOf(currentWk);
        final String GRAY_COLOR= 'rgb(169,169,169)';
        final String CYAN_COLOR_DARK = 'rgb(8,166,145)';
        
        
        if(String.isBlank(period) || String.isBlank(accountId))
            throw new GoalsControllerException('Either of the parameters accountId, period to GoalsController are null');
        
        List<Goal_Response__c> goalResponses = [SELECT Id, Goal_Seq__c, performance__c,condition__c,
                                                criterion__c,Criterion_Value__c, difficulty__c,Period_Type__c,baseline_Value__c
                                                FROM goal_response__c 
                                                WHERE Account__c=:accountId 
                                                AND Period_Type__c= :period                                 
                                                WITH SECURITY_ENFORCED
                                                ORDER BY Goal_Seq__c
                                                LIMIT 3];
        Map<Id, Goal_Response__c> goalRespMap = new Map<Id, Goal_Response__c> (goalResponses);
        List<Goal_Tracking__c> goalTrackings = [SELECT goal_response__c,wk__c, progress_value__c
                                                FROM goal_tracking__c
                                                WHERE goal_response__c IN :goalRespMap.keySet()
                                                WITH SECURITY_ENFORCED
                                                ORDER BY goal_response__c, wk__c];
        Map<Id, List<Goal_Tracking__c>> goalTrackMap = new Map<Id, List<Goal_Tracking__c>>();
        for(Goal_Tracking__c goalTrack:goalTrackings){
            List<Goal_Tracking__c> goalTrackList;
            if(goalTrackMap.containsKey(goalTrack.goal_response__c))    
                goalTrackList = goalTrackMap.get(goalTrack.goal_response__c);
            else
                goalTrackList = new List<Goal_Tracking__c>();
            goalTrackList.add(goalTrack);
            goalTrackMap.put(goalTrack.goal_response__c, goalTrackList);
        }
        
        List<ChartDataInput> goalChartsList = new List<ChartDataInput>();
        
        for(Goal_Response__c goalResp: goalResponses)   {
            ChartDataInput cData  = new ChartDataInput();
            Integer baselinevalue = goalResp.baseline_Value__c != null ? Integer.valueOf(goalResp.baseline_Value__c) : 0;
            Integer criterionvalue = goalResp.Criterion_Value__c != null ? Integer.valueOf(goalResp.Criterion_Value__c) : 0;
            
            
            Set<Integer> missingWksSet = new Set<Integer>();
            for(Integer i=1;i<currentWkInt; i++)
                missingWksSet.add(i);
            
            cData.id = String.valueOf(goalResp.Id);
            cData.title = goalResp.performance__c+ ' '+goalResp.condition__c.toLowerCase() +' '+goalResp.criterion__c.toLowerCase()+' ('+goalResp.difficulty__c+')';
            //cData.target = String.valueOf(criterionvalue);
            for (Integer i=0; i<=12;i++) //13 times = 12wks+ baseline
                cData.targetLineData.add(criterionvalue);
            cData.chartData.add(baselinevalue);
            cData.bgColor.add(GRAY_COLOR);
            cData.Performance = goalResp.performance__c;
            cData.Condition = goalResp.condition__c;
            cData.criterion = String.valueOf(criterionvalue);
            cData.baseline = String.valueOf(baselinevalue);
            cData.goalNum = String.valueOf(goalResp.Goal_Seq__c);
            
            List<Goal_Tracking__c> relatedGoalTrackings = goalTrackMap.get(goalResp.Id);
            if(relatedGoalTrackings != null && relatedGoalTrackings.size()>0)   {
                for(Goal_Tracking__c track : relatedGoalTrackings)  {
                    Integer progressvalue = track.progress_value__c != null ? Integer.valueOf(track.progress_value__c) : 0;
                    Integer wk = track.wk__c != null? Integer.valueOf(track.wk__c) :0;
                    cData.chartData.add(progressvalue);
                    cData.bgColor.add(CYAN_COLOR_DARK);
                    missingWksSet.remove(wk);
                }
            }
            cData.missingWks = missingWksSet;
            goalChartsList.add(cData);
            
        }       
        
        String returnStr =JSON.serialize(goalChartsList);
        System.debug('returndata is '+JSON.serializePretty(goalChartsList));
        return returnStr;
        
    }
    
    
    /*
        // since the requirement is changed to have only 2 colors, commenting out this function
        public static String getColor(Integer score)	{
            Integer scoreValue = Integer.valueOf(score);
            String color = 'rgb(0,0,255)';
            switch on scoreValue	{
            //when 0: { color = 'rgb()'}    //not needed I guess as we do not show any bar
            when 1 { color = 'rgb(0,0,255)';}   //blue
            when 2 { color = 'rgb(255,0,0)';}  //red
            when 3 { color = 'rgb(169,169,169)';}  //grey
            when 4 { color = 'rgb(255,255,0)';}  //yellow
            when 5 { color = 'rgb(0,255,0)';}  //green
            }
            return color;
        }
    */
}