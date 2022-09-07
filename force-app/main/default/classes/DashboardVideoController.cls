public class DashboardVideoController {
    
    @AuraEnabled(cacheable=true)
    public static List<MddListOfValue__mdt> getVideoURl(string Name, String Condition ){
        String qry ='SELECT Id,Name__c,Condition__c,Value__c,Sequence__c FROM MddListOfValue__mdt where Name__c=:Name ORDER BY Sequence__c';
       // if(String.isNotBlank(Condition))
           // qry = qry + ' AND condition__c = :Condition';
          system.debug('test'+ qry);
          List<MddListOfValue__mdt> Urllist = Database.query(qry);
        system.debug('urlList ----->>>'+Urllist );
        string value= Urllist[0].Value__c;
        system.debug('Value------>>>>>'+value);
        return Urllist;
        
        
    }
	
    
}