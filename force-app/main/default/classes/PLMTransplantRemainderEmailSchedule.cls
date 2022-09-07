global class PLMTransplantRemainderEmailSchedule implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account acc = [SELECT Id,Study_Consent__C,PersonContactId,Transplant_Patient_Type__c FROM Account WHERE Id =:user.AccountId];
        list<Advanced_Survey_Question__c> questionsList =[select Id,Advanced_Survey__r.name,Active__c from Advanced_Survey_Question__c WHERE Advanced_Survey__r.name='Transplant Pre-webinar' And Active__c=true];
        list<Advanced_Survey_Answer__c> answerList  =[select id from Advanced_Survey_Answer__c where PLM_User__c=: acc.Id];
        
        EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='REMINDER_Abandoned_Webinar_2_5_Questions_Pre_Post_Premiere_Invitation_Email	'];
        
        list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setTemplateId(emailtemp.Id);
        mail.setTargetObjectId(acc.PersonContactId);
        mailList.add(mail);
        
        if(!mailList.isEmpty() && (acc.Transplant_Patient_Type__c =='Patient' || acc.Transplant_Patient_Type__c =='Caretaker' )  ){
            Messaging.sendEmail(mailList);
            system.abortJob(acc.id); 
        }
        
    }
}