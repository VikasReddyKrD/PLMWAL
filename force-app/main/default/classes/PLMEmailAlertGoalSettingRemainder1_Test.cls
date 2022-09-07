@isTest
public class PLMEmailAlertGoalSettingRemainder1_Test {
    public static testMethod void testschedule() {
        Account acc= new Account();
        acc.Name='Sudheer';
        acc.completeweekstatus1__c='Completed';
        insert acc;
        
        List<Goal_Response__c> grlist = new List<Goal_Response__c>();
        Goal_Response__c gr = new Goal_Response__c();
        gr.Goal_Seq__c=3;
        gr.Account__c=acc.id;
        grlist.add(gr);
           insert grlist;

        user ur = [select id,name,UserRole.name,Email,profile.name  from User where profile.name='System Administrator' and name='Vinay'];
       
        list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
       /* EmailTemplate emailtemp = [SELECT Id,Subject,Body FROM EmailTemplate WHERE DeveloperName ='Goal_Setting_Reminder_Session_One'];
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setTemplateId(emailtemp.Id);
        mail.setTargetObjectId(ur.id);
        mailList.add(mail);
        Messaging.sendEmail(mailList);*/
        
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage(); 
        mail.setTemplateId(system.label.TemplateID); //00X3s000000m4UuEAI
        mail.setTargetObjectId(system.label.UserID);//005e0000007bu0pAAA
        mail.setSaveAsActivity(false);
        
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {mail }); 


        
        Test.StartTest();
        PLMEmailAlertGoalSettingRemainder1 testsche = new PLMEmailAlertGoalSettingRemainder1();
        String sch = '0 0 23 * * ?';
        system.schedule('Test status Check', sch, testsche );
        Test.stopTest();
    }
    
    
}