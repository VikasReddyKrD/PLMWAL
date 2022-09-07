trigger AccountTrigger on Account (after update) {
    if(Trigger.isUpdate) {
        if(Trigger.isAfter) {
            AccountTriggerHandler.updateRoutineDraw(Trigger.new, Trigger.oldMap);                 
        }
    }
}