public with sharing class logic {
@AuraEnabled(cacheable=true)
public static void log(){
    List<Logic__c> fields = [select Name, Symbol__c from Logic__c];
    for(Logic__c field: fields){
    system.debug(field);    
    }
    
    }
    
}