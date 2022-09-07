global class PLMEmailAlertGoalTrackingRemainder1 implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
        EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Goal_Tracking_Reminder_Session_One'];
        list<Account> acclist =[select id,Survey1Completion_Date__c,GoalStartDate__c from account ];
        for(Account a : acclist){
            DateTime Da = a.GoalStartDate__c+14;
            if(a.GoalStartDate__c > Da){
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                mail.setTemplateId(emailtemp.Id);
                mail.setTargetObjectId(a.id);
                mailList.add(mail);
                if(!mailList.isEmpty()){
                    Messaging.sendEmail(mailList);
                }
            }            
        }
    }
}