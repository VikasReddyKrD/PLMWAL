global class PLMSMSConAfter7daysScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
      //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
      //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='Its time to track your progress for your Session Two goals! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/goals]';
        list<Account> aclist = [select id,PersonMobilePhone,GoalStartDate_Session2__c from account];
        for(Account a : aclist ){
         DateTime Da = a.GoalStartDate_Session2__c+7;
        if(a.GoalStartDate_Session2__c > Da){
         PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);           
          }
            system.abortJob(a.id); 
        }
    }
}