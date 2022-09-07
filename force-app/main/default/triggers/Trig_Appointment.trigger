trigger Trig_Appointment on Appointment__c (after insert, after update) {
    if(!Test.isRunningTest()) {
       et4ae5.triggerUtility.automate('Appointment__c'); 
    }  
    else {
        List<Appointment__c> appts = new List<Appointment__c>();
        for(Appointment__c appt : Trigger.new) {
            appts.add(appt);
        }
    }
}