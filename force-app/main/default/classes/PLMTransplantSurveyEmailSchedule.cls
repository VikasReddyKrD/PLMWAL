global class PLMTransplantSurveyEmailSchedule implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account acc = [SELECT Id,Study_Consent__C,PersonContactId,Transplant_Patient_Type__c FROM Account WHERE Id =:user.AccountId];
        list<Advanced_Survey_Question__c> questionsList =[select Id,Advanced_Survey__r.name,Active__c from Advanced_Survey_Question__c WHERE Advanced_Survey__r.name='Transplant Survey1' And Active__c=true];
        list<Advanced_Survey_Answer__c> answerList  =[select id from Advanced_Survey_Answer__c where PLM_User__c=: acc.Id];
            
            EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Survey_Reminder_Abandoned_Survey_Patient_Version'];
        
        list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setTemplateId(emailtemp.Id);
        mail.setTargetObjectId(acc.PersonContactId);
        mailList.add(mail);
        
        
        EmailTemplate emailtemp1 = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Survey_Reminder_Abandoned_Survey_Care_Partner'];
        
        list<Messaging.SingleEmailMessage> mailList1 = new  list<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage mail1 = new Messaging.SingleEmailMessage();
        mail1.setTemplateId(emailtemp1.Id);
        mail1.setTargetObjectId(acc.PersonContactId);
        mailList1.add(mail1);
        
        if(!mailList.isEmpty() &&  questionsList.size() != answerList.size()  &&  acc.Transplant_Patient_Type__c =='Patient'){
            Messaging.sendEmail(mailList);
            system.abortJob(acc.id); 
        }
        else if(!mailList1.isEmpty() &&  questionsList.size() != answerList.size() &&  acc.Transplant_Patient_Type__c =='Caretaker'){
            Messaging.sendEmail(mailList1);
            system.abortJob(acc.id); 
        }
    }
}