trigger GoalResponseTrigger on Goal_Response__c (after insert) {
    if(trigger.Isinsert){
        if(!RecursiveUtilityClass.isRecursive_updateTaskForGoalResponses){
            GoalResponseTriggerHelper.updateTaskForGoalResponses(trigger.new);
            RecursiveUtilityClass.isRecursive_updateTaskForGoalResponses=true;
        }
    }
}