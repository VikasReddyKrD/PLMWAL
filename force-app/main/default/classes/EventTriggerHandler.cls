public with sharing class EventTriggerHandler {
	
    public static void updateCollectionBData(List<Event> scope) {
        Map<Id, Id> eventToAccount = new Map<Id, Id>();
        // Get related patient accounts
        for(Event event : scope) {
            if(event.Subject == 'completed_treatments_page') {
                Id relatedRecordId = event.WhatId;
                SObjectType objType = relatedRecordId.getsobjecttype();
                String objTypeName = String.valueOf(objType);
                if(objTypeName.equalsIgnoreCase('Account')) {
                    eventToAccount.put(event.Id, relatedRecordId);
                }
            }
        }

        // Get Collection Data B records for the patients
        Id recordTypeId = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection B').getRecordTypeId();
        List<Collection_Data__c> collectionData = 
            [SELECT Id,
                DOD_Survey_Completion_Date__c,
                DOD_Treatment_Page_Completion_Date__c
                FROM Collection_Data__c 
                WHERE Patient__c IN :eventToAccount.values() AND RecordTypeId=:recordTypeId];

        // Map data to its date so it can be sorted to find the most recent date
        Map<Date, Collection_Data__c> dateToCollectionData = new Map<Date, Collection_Data__c>();
        List<Date> surveyCompletionDates = new List<Date>();

        for(Collection_Data__c data : collectionData) {
            if(data.DOD_Survey_Completion_Date__c != null) {
                surveyCompletionDates.add(data.DOD_Survey_Completion_Date__c);
                dateToCollectionData.put(data.DOD_Survey_Completion_Date__c, data);
            }
        }

        if(surveyCompletionDates.size() > 0) {
            surveyCompletionDates.sort();

            // Get most recent collection data from sorted list
            Collection_Data__c dataToUpdate = dateToCollectionData.get(surveyCompletionDates[surveyCompletionDates.size()-1]);
            dataToUpdate.DOD_Treatment_Page_Completion_Date__c = Date.today();
            update dataToUpdate;
        }
    }

    public static void updateCollectionCData(List<Event> scope) {
        Map<Id, Id> eventToAccount = new Map<Id, Id>();
        // Get related patient accounts
        for(Event event : scope) {
            if(event.Subject == 'completed_treatments_update') {
                Id relatedRecordId = event.WhatId;
                SObjectType objType = relatedRecordId.getsobjecttype();
                String objTypeName = String.valueOf(objType);
                if(objTypeName.equalsIgnoreCase('Account')) {
                    eventToAccount.put(event.Id, relatedRecordId);
                }
            }
        }

        // Get Collection Data C records for the patients
        Id recordTypeId = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection C').getRecordTypeId();
        List<Collection_Data__c> collectionData = 
            [SELECT Id,
                Check_In_Survey_Completion_Date__c,
                Check_Treatments_Completion_Date__c
                FROM Collection_Data__c 
                WHERE Patient__c IN :eventToAccount.values() AND RecordTypeId=:recordTypeId];

        // Map data to its date so it can be sorted to find the most recent date
        Map<Date, Collection_Data__c> dateToCollectionData = new Map<Date, Collection_Data__c>();
        List<Date> surveyCompletionDates = new List<Date>();

        for(Collection_Data__c data : collectionData) {
            if(data.Check_In_Survey_Completion_Date__c != null) {
                surveyCompletionDates.add(data.Check_In_Survey_Completion_Date__c);
                dateToCollectionData.put(data.Check_In_Survey_Completion_Date__c, data);
            }
        }

        if(surveyCompletionDates.size() > 0) {
            surveyCompletionDates.sort();

            // Get most recent collection data from sorted list
            Collection_Data__c dataToUpdate = dateToCollectionData.get(surveyCompletionDates[surveyCompletionDates.size()-1]);
            dataToUpdate.Check_Treatments_Completion_Date__c = Date.today();
            update dataToUpdate;
        }
    }
}