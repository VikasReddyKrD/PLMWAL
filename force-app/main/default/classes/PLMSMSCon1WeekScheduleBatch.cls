global class PLMSMSCon1WeekScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
      //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
      //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='PatientsLikeMe is excited to help you start setting goals! Add your first set of goals today![https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/goals] ';
        list<Account> acclist = [select id,PersonMobilePhone,Current_Wk_Session2__c from account];
        for(Account a :acclist ){
        if(a.Current_Wk_Session2__c==3){
             PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);   
            }        
          system.abortJob(a.id); 
        }
    }
}