global class PLMSMSConAfter2daysScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
        //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='Its helpful to track your progress against your goals. Don’t forget to track today! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/goals]';
      
       list<Account> acclist = [select id,PersonMobilePhone,Survey1Completion_Date__c,Goal_Tracking_Invitation_2__c From Account];
        for(Account a :acclist){
            
            if(a.Goal_Tracking_Invitation_2__c == True){
                PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1); 
            }
            system.abortJob(a.id); 
        }
    }
}