trigger Trig_Request on Request__c (after insert, after update) {
    if(!Test.isRunningTest()) {
       et4ae5.triggerUtility.automate('Request__c'); 
    }  
    else {
        List<Request__c> reqs = new List<Request__c>();
        for(Request__c req : Trigger.new) {
            reqs.add(req);
        }
    }
}