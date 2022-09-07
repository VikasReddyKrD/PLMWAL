@isTest
public class PLMEmailAlertGoalTrackingInvitation_Test {
    
    public static testMethod void createEmailTest(){
        Account acc= new Account();
        acc.Name='Sudheer and sai';
        acc.Email__c = 'Test@gmail.com';
        acc.completeweekstatus1__c='Completed';
        insert acc;
        
        List<Goal_Response__c> grlist = new List<Goal_Response__c>();
        Goal_Response__c gr = new Goal_Response__c();
        gr.Goal_Seq__c=3;
        gr.Account__c=acc.id;
        grlist.add(gr);
        insert grlist;
        
        user ur = [select id,name,UserRole.name,Email,profile.name  from User where profile.name='System Administrator' and name='Vinay'];
        system.debug('user deatils'+ur);        
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage(); 
        mail.setTemplateId(system.label.TemplateID); //00X3s000000m4UuEAI
        mail.setTargetObjectId(ur.Id);//005e0000007bu0pAAA//system.label.UserID
        mail.setReplyTo('ksudheer@dextara.com');
        mail.setSaveAsActivity(false);
        
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {mail }); 
        test.startTest();
        PLMEmailAlertGoalTrackingInvitation1 testsche = new PLMEmailAlertGoalTrackingInvitation1();
        String sch = '0 0 23 * * ?';
        system.schedule('Test status Check', sch, testsche );
        test.stopTest();
        
    }
    
    
    
}