global class PLMSMSConSurvey3OneWeekScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
      //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
      //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='Your Last Survey Has Arrived! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys]';
        list<Account> aclist = [select id,PersonMobilePhone,completeweekstatus23__c from account];
        for(Account a : aclist){
        if(a.Survey1Completion_Date__c != Null  &&  a.completeweekstatus23__c =='InProgress'){
         PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);           
          }
            
        }
    }
}