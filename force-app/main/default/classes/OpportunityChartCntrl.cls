public with sharing class OpportunityChartCntrl {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(){
        List<Opportunity> oppList = [SELECT Amount,Name,StageName FROM Opportunity WHERE CloseDate >= LAST_N_DAYS:30 AND StageName = 'Closed Won'];
        return oppList;
    }
}