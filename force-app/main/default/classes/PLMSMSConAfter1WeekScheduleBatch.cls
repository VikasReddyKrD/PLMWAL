global class PLMSMSConAfter1WeekScheduleBatch implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
        //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='Great news! You’ve set your goals and now it is time to start tracking them. Take some time today to take a look at your progress, and keep up the good work! [Link to Survey]';
        
        list<Account> acclist =[select id,(select id,Week_1_Goal_1_Score__c,Week_1_Goal_2_Score__c,Week_1_Goal_3_Score__c from GAD_Surveys__r)from account ];
        for(Account a : acclist){
            if(a.GAD_Surveys__r.size()<3){
                PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1); 
            }
            system.abortJob(a.id); 
        }
    }
}