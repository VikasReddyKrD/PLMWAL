global class PLMEmailAlertGoalSettingRemainder1 implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
        EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Goal_Setting_Reminder_Session_One'];
        list<Account> acclist =[select id,completeweekstatus1__c,(select id,Goal_Seq__c from Goal_Responses__r)from account ];
        for(Account a : acclist){
            if(a.Goal_Responses__r.size()<3){
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