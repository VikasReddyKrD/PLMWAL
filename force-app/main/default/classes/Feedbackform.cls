public class Feedbackform {
    @AuraEnabled(Cacheable=true)
    public static List<    Candidate_feedback_master__mdt> feedback()
        
    {
        List<Candidate_feedback_master__mdt> surveyList = [SELECT Label,Question__c,DeveloperName,answer__c
                                                           FROM Candidate_feedback_master__mdt ORDER BY Label ASC  ];
        return surveyList;
        
    }
    /*   @AuraEnabled
public static List<Candidate_feedback_master__mdt> saveFeedback(List<Candidate_feedback_master__mdt> record){
try{
if(record.size()>0){
update record;

}
return record;
}catch(Exception e){
throw new AuraHandledException(e.getMessage());
}
}   */
    
    @AuraEnabled
    public static string insertFeedback(List<Candidate_feedback_master__mdt> feebacklist,String Candidatenm,string SPOC, string DelItemDesc,string DelAdd,Date DelDate,string ModeDel,string PoRef){
        try {
            system.debug(PoRef);
            List<Feedbackform__c> fList = new List<Feedbackform__c>();
            for(Candidate_feedback_master__mdt feed : feebacklist){
                system.debug('test'+feed);
                Feedbackform__c feedback = new Feedbackform__c();
                feedback.Question__c = feed.Question__c;
                feedback.Name=Candidatenm;
                feedback.Customer_SPOC__c=SPOC;
                feedback.Delivered_items_description__c=DelItemDesc;
                feedback.Delivery_Address__c=DelAdd;
                feedback.Delivery_Date__c=DelDate;
                feedback.Mode_of_Delivery__c=ModeDel;
                feedback.PO_Ref__c=PoRef;
                feedback.Answer__c = feed.answer__c; 
                
                
                fList.add(feedback);
            }
            insert fList;
            system.debug('fList'+fList);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return 'success';
    }
}