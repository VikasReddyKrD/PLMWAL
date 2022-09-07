public without sharing class GoalQuestions{

        @AuraEnabled
        public static List<Goal_Questions__c> getQuestions(){
            return [select Id,Active__c, Dependent_options__c, Display_Type__c, is_Dependent_option__c,Order__c,Question_Text__c,options__c,Step_Name__c  from Goal_Questions__c WHERE Active__c=true ORDER BY Order__c];
        }
        @AuraEnabled
        public static Boolean insertSurveyResponse(Goal_Response__c goalResponse){
            system.debug('testrep'+goalResponse);
            try{
            insert goalResponse;
            return true;
            }
            catch(Exception e){
                System.debug('error in goal response insertion');
            }
            return false;
        }
        
}