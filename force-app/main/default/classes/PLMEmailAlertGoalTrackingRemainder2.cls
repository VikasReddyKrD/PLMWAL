global class PLMEmailAlertGoalTrackingRemainder2 implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
        EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Goal_Tracking_Reminder_Session_Two'];
       list<Account> acclist = [select id,PersonMobilePhone,Survey1Completion_Date__c,Goal_Tracking_Invitation_2__c From Account];
        for(Account a : acclist){
            if(a.Goal_Tracking_Invitation_2__c == True){
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                mail.setTemplateId(emailtemp.Id);
                mail.setTargetObjectId(a.id);
                mailList.add(mail);
                if(!mailList.isEmpty() ){
                    Messaging.sendEmail(mailList);
                }
            }            
        }
    }
}