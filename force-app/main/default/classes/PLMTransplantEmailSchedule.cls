global class PLMTransplantEmailSchedule implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account acc = [SELECT Id,Study_Consent__C,PersonContactId,Transplant_Patient_Type__c FROM Account WHERE Id =:user.AccountId];
        
        EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Initial_Survey_Email_Invitation_Patient_Version'];
        
        list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setTemplateId(emailtemp.Id);
        mail.setTargetObjectId(acc.PersonContactId);
        mailList.add(mail);
        
        
        EmailTemplate emailtemp1 = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Initial_Survey_Email_Invitation_Care_Partner_Version'];
        
        list<Messaging.SingleEmailMessage> mailList1 = new  list<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage mail1 = new Messaging.SingleEmailMessage();
        mail1.setTemplateId(emailtemp1.Id);
        mail1.setTargetObjectId(acc.PersonContactId);
        mailList1.add(mail1);
        
        if(!mailList.isEmpty() && acc.Transplant_Patient_Type__c =='Patient' ){
            Messaging.sendEmail(mailList);
            system.abortJob(acc.id); 
        }
        else if(!mailList1.isEmpty() && acc.Transplant_Patient_Type__c =='Caretaker'){
            Messaging.sendEmail(mailList1);
            system.abortJob(acc.id); 
        }
    }
}