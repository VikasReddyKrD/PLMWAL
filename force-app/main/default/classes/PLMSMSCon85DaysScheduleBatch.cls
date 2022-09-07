global class PLMSMSCon85DaysScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
        //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='Great news! You’ve set your goals and now it is time to start tracking them. Take some time today to take a look at your progress, and keep up the good work! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys] ';
        list<Account> alist = [select id,PersonMobilePhone,Survey1Completion_Date__c from account];
        for(Account a : alist ){
            Date Da = a.Survey1Completion_Date__c+85;
            if(a.Survey1Completion_Date__c > Da){
                PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);   
                system.abortJob(a.id);
            }         
        }
    }
}