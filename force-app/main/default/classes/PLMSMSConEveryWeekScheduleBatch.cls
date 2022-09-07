global class PLMSMSConEveryWeekScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
      //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
      //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='You have started Survey Two -- Don’t stop now! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/goals]';
        list<Account> aclist = [select id,PersonMobilePhone,GoalStartDate__c from account];
        for(Account a : aclist ){
         DateTime Da = a.GoalStartDate__c+14;
        if(a.GoalStartDate__c > Da){
         PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);           
          }         
        }
    }
}