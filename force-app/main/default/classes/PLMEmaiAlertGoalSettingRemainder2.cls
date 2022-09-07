global class PLMEmaiAlertGoalSettingRemainder2 implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
        EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Goal_Setting_Reminder_Session_Two'];
        list<Account> acclist =[select id,PersonMobilePhone,Survey1Completion_Date__c,completeWeek13__c,(select id,period_type__c from Goal_Responses__r WHERE  period_type__c ='Session 2')from account ];
        for(Account a : acclist){
            if(a.Goal_Responses__r.size()==0  &&  a.completeWeek13__c == True){
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