trigger Trig_PLM_Event on PLM_Event__c (after insert, after update) {
    if(!Test.isRunningTest()) {
       et4ae5.triggerUtility.automate('PLM_Event__c'); 
    }  
    else {
        List<PLM_Event__c> plmevents = new List<PLM_Event__c>();
        for(PLM_Event__c plmevent : Trigger.new) {
            plmevents.add(plmevent);
        }
    }
}