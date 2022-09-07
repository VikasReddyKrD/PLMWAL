@isTest
public class PLMEmailAlertGoalTrackingRemainder2_Test {
    public static testMethod void scheduleTest(){
        Account acc= new Account();
        acc.Name='Sudheer';
        acc.completeweekstatus1__c='Completed';
        acc.Goal_Tracking_Invitation_2__c=true;
        insert acc;
        user ur = [select id,name,UserRole.name,Email,profile.name  from User where profile.name='System Administrator' and name='Vinay'];
       list<Messaging.SingleEmailMessage> mailList = new  list<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage(); 
        mail.setTemplateId(system.label.TemplateID);
        //mail.setToAddresses({'ksudheer@dextara.com'});
        mail.setTargetObjectId(ur.id);
       
        
        mail.setSaveAsActivity(false);
        
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {mail }); 
        Test.startTest();
        PLMEmailAlertGoalTrackingRemainder2 testsche = new PLMEmailAlertGoalTrackingRemainder2();
        String sch = '0 0 23 * * ?';
        system.schedule('Test status Check', sch, testsche );
        Test.stopTest();


    }

}