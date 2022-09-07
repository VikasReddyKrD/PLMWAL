trigger UserTrigger on User (after Insert) {
    if(trigger.Isinsert){
        if(!RecursiveUtilityClass.isRecursive_taskCreationForGoals){
            UserTriggerHandler.taskCreationForGoals(trigger.new);
            RecursiveUtilityClass.isRecursive_taskCreationForGoals=true;
        }
    }
}