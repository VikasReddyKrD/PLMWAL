public without sharing class PdfDownload {
    
      @AuraEnabled(Cacheable=true)
   public static String getPdfDownloadLink(){
       try {
           //TODO this should ideally be stored in Custom Settings
           String contentDocumentId = '069e0000001rJzmAAE';

           //Query the ContentDistribution object to retrieve the Downloadable url
           List<ContentDistribution> contentDistributions = [
                   SELECT Id, ContentDownloadUrl, DistributionPublicUrl
                   FROM ContentDistribution
                   WHERE ContentDocumentId =: contentDocumentId
                   LIMIT 1
           ];

           if(!contentDistributions.isEmpty() && String.isNotBlank(contentDistributions[0].ContentDownloadUrl)){
               return contentDistributions[0].ContentDownloadUrl;
           }
       } catch (Exception e) {
           System.debug('Some excellent error messaging');
       }

       return null;
   }

}