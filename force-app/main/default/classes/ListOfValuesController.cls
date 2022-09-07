public with sharing class ListOfValuesController { 
    @AuraEnabled(cacheable=true)
    public static List<MddListOfValue__mdt> getListOfValues(string Name, String Condition ){
        String qry ='SELECT Id,Label,Name__c,Condition__c,Value__c,Sequence__c,Description__c FROM MddListOfValue__mdt where Name__c=:Name';
        
        if(String.isNotBlank(Condition))
            qry = qry + ' AND condition__c = :Condition';
        qry = qry + ' ORDER BY Sequence__c';
        system.debug('test'+ qry);
        List<MddListOfValue__mdt> Urllist = Database.query(qry);
        //system.debug('urlList ----->>>'+JSON.serializePretty(Urllist ));
        return Urllist;      
        
    }

    @AuraEnabled(cacheable=true)
    public static Map<String,List<MddListOfValue__mdt>> getVideosandDocs(string Name, String Condition ){
        Map<String,List<MddListOfValue__mdt>> mapVideosnDocs;
        List<MddListOfValue__mdt> Urllist = getListOfValues(Name,Condition);
        if(Urllist != null) {
            mapVideosnDocs = new Map<String,List<MddListOfValue__mdt>>();
            List<MddListOfValue__mdt> vidList = new List<MddListOfValue__mdt>();
            List<MddListOfValue__mdt> docList = new List<MddListOfValue__mdt>();
            for(MddListOfValue__mdt lov : Urllist)  {
                if(lov.label == 'Document')
                    docList.add(lov);
                else if(lov.label == 'Video')
                    vidList.add(lov);
            }
            mapVideosnDocs.put('videos', vidList);
            mapVideosnDocs.put('docs', docList);
        }
        //system.debug('urlList ----->>>'+JSON.serializePretty(Urllist ));
        return mapVideosnDocs;      
        
    }
}