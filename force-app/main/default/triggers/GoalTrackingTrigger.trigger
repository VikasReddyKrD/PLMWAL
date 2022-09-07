trigger GoalTrackingTrigger on Goal_Tracking__c (after Insert) {
 if(trigger.Isinsert){
      if(!RecursiveUtilityClass.isRecursive_updateTaskForGoalTrackings)
        GoalTrackingTriggerHelper.updateTaskForGoalTrackings(trigger.new);
         RecursiveUtilityClass.isRecursive_updateTaskForGoalTrackings=true;
    }
}