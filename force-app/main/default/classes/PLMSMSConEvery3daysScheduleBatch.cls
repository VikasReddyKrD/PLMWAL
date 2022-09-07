global class PLMSMSConEvery3daysScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
        //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='You have started Survey Two -- Don’t stop now! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys] ';
        String msg2 ='Start Survey Two TODAY! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys]';
        String msg3 ='It’s time for your last survey! Fill it out TODAY! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys]';
        list<Account> alist = [select id,PersonMobilePhone,Survey1Completion_Date__c,completeweekstatus12__c,completeweekstatus24__c from account];
        for(Account a : alist){
            
            if(a.Survey1Completion_Date__c != Null  && a.completeweekstatus12__c =='InProgress'){
                PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);
            }
            if(a.Survey1Completion_Date__c != Null  &&  a.completeweekstatus12__c =='Not Started'){
                PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg2);   
            }
            if(a.Survey1Completion_Date__c != Null  &&  a.completeweekstatus24__c =='Not Started'){
                PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg3);  
            }
        }
    }
}