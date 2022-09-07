trigger AppointmentTrigger on Appointment__c (before insert, after insert, before update, after update) {

    if(Trigger.isInsert) {
        if(Trigger.isBefore) {
            AppointmentTriggerHandler.updateStatus(Trigger.new);
            AppointmentTriggerHandler.setAppointmentDrawTypeFromRequest(Trigger.new);
        }
        if(Trigger.isAfter) {
            AppointmentTriggerHandler.updateAccounts(Trigger.new);
            AppointmentTriggerHandler.updateRequests(Trigger.new, Trigger.oldMap);
        }
    }

    if(Trigger.isUpdate) {
        if(Trigger.isBefore) {
            List<Appointment__c> scope = new List<Appointment__c>();
            for(Appointment__c a : Trigger.new) {
                //If the status changed then we continue with that record
                if(a.Scheduling_Status__c != Trigger.oldMap.get(a.Id).Scheduling_Status__c || a.Scheduling_Disposition__c != Trigger.oldMap.get(a.Id).Scheduling_Disposition__c) {
                    scope.add(a);
                }
            }
            AppointmentTriggerHandler.updateStatus(scope);
        }
        if(Trigger.isAfter) {
            AppointmentTriggerHandler.updateAccounts(Trigger.new);
            AppointmentTriggerHandler.updateRequests(Trigger.new, Trigger.oldMap);
        }
    }
}