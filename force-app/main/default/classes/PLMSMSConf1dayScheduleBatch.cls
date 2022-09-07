global class PLMSMSConf1dayScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
      //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
      //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='PatientsLikeMe is excited to help you start setting goals! Add your first set of goals today! ';
        list<Account> acclist = [select id,PersonMobilePhone,Survey1Completion_Date__c from account];
        for(Account a : acclist ){
         Date dd   =a.Survey1Completion_Date__c+1; 
        if(dd  ==System.today()){
         PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);
          }
          system.abortJob(a.id); 
        }
    }
}