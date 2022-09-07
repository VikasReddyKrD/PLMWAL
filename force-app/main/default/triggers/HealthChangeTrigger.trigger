trigger HealthChangeTrigger on Health_Change__c (before insert, after insert, before update, after update) {

    if(Trigger.isInsert) {
        if(Trigger.isBefore) {
            HealthChangeTriggerHandler.populatePatient(Trigger.new);

            List<Health_Change__c> detected = new List<Health_Change__c>();
            List<Health_Change__c> requested = new List<Health_Change__c>();
            for(Health_Change__c hc : Trigger.new) {
                if(hc.Health_Change_Source__c.equalsIgnoreCase('Detected')) {
                    detected.add(hc);
                }
                else if(hc.Health_Change_Source__c.equalsIgnoreCase('Requested')) {
                    requested.add(hc);
                }
            }
            HealthChangeTriggerHandler.updateStatusDetected(detected, true);
            HealthChangeTriggerHandler.updateStatusRequested(requested, true);
        }
    }

    if(Trigger.isUpdate) {
        if(Trigger.isAfter) {
            HealthChangeTriggerHandler.updateParentCaseQueue(Trigger.new, Trigger.oldMap);
        }
    }
}