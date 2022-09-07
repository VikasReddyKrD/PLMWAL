global class PLMSMSConEvery2DaysScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
      //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
      //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='Don’t forget to add your Session Two goals to help track and monitor your outcomes! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/goals]';
        
        list<Account> acclist =[select id,PersonMobilePhone,Survey1Completion_Date__c,completeWeek13__c,(select id,period_type__c from Goal_Responses__r WHERE  period_type__c ='Session 2')from account ];
        for(Account a : acclist){
        if(acclist.size()==0  &&  a.completeWeek13__c == True){
         PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);           
          }            
        }
    }
}