trigger EventTrigger on Event (before insert) {

    if(Trigger.isBefore) {
        if(Trigger.isInsert) {
            EventTriggerHandler.updateCollectionBData(Trigger.new);
            EventTriggerHandler.updateCollectionCData(Trigger.new);
        }
    }
}