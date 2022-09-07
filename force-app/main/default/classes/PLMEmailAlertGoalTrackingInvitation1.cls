global class PLMEmailAlertGoalTrackingInvitation1 implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
        EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Goal_Tracking_Invitation_Session_One'];
        list<Account> acclist =[select id,(select id,Week_1_Goal_1_Score__c,Week_1_Goal_2_Score__c,Week_1_Goal_3_Score__c from GAD_Surveys__r)from account ];
        system.debug('Acclist is '+acclist);
        for(Account a : acclist){ 
            if(a.GAD_Surveys__r.size()<3){
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                mail.setTemplateId(emailtemp.Id);
                mail.setTargetObjectId(a.id);
                mailList.add(mail);
                if(!mailList.isEmpty() && !test.isRunningTest()){
                    Messaging.sendEmail(mailList);
                }
            }            
        }
    }
}