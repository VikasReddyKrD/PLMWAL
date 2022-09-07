global class PLMSMSConfJobscheduleigBatchd implements Schedulable 
{
    global void execute(SchedulableContext sc) 
    {
        //  String query = 'select id,Owner.Mobilephone,completeweekstatus1__c from account';
        //  System.debug('test'+Database.getQueryLocator(query));
        String msg1 ='Hi from PatientsLikeMe! Dont forget to finish-Up the survey you started! Follow this link to keep going![https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys]';
        String msg2 ='Hi from PatientsLikeMe! We want you to share your experience with us! Follow this link to start the survey![https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys]';
        String msg3 ='PatientsLikeMe is excited to help you start setting goals! Don’t forget to add your first goals today![https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/goals]';
        String msg4 ='Its time to add your Session Two goals to help track and monitor your health outcomes! [https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/goals]';
        list<Account> acclist = [select id,PersonMobilePhone,completeweekstatus1__c,MDD_Existing_Record__c,completeWeek13__c,Survey1Completion_Date__c,(select id,Goal_Seq__c from Goal_Responses__r) from account];
        for(Account a :acclist){
            
            if(a.completeweekstatus1__c != 'Completed'){
                PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg1);
            }
            if(a.MDD_Existing_Record__c==True && a.completeweekstatus1__c == 'Not Started'){
                PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg2);   
            }
            if(a.Goal_Responses__r.size()<3){
                PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg3); 
            }
            if(a.Survey1Completion_Date__c!= Null  &&  a.completeWeek13__c==True ){
              PLM_APIforConfigureSMS.configureSMS(new List<String>{'+12014222730'},true,false,false,msg4);   
            } 
        }
    }
}