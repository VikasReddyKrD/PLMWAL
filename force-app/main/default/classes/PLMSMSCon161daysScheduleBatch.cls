global class PLMSMSCon161daysScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
        //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 =' Its time for the last part of your survey! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys]';
        list<Account> aclist = [select id,PersonMobilePhone,Survey1Completion_Date__c from account];
        for(Account a : aclist ){
            Date Da = a.Survey1Completion_Date__c+161;
            if(a.Survey1Completion_Date__c > Da){
                PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);   
                system.abortJob(a.id);
            }         
        }
    }
}