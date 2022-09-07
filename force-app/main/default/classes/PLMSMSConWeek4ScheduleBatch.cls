global class PLMSMSConWeek4ScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
      //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
      //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='Congrats on tracking your goals for the last 4 weeks! Keep it up and continue to track your goals today! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/goals] ';
        list<Account> alist = [select id,PersonMobilePhone,Survey1Completion_Date__c,Current_Wk__c from account];
        for(Account a :alist ){
         
        if(a.Current_Wk__c==4){
         PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);
          }
          system.abortJob(a.id); 
        }
    }
}