global class EmailTriggerTransplant  implements Schedulable {
    global void execute(SchedulableContext SC) {
        //string toMail='ksudheer@dextara.com';
         User userLogin = [Select Id,AccountId,Email from User where Id=:userinfo.getuserId()];
         Account acclist = [SELECT Id,personEmail FROM Account WHERE Id =:userLogin.AccountId];
         string toMail =acclist.PersonEmail;
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        string[] to = new string[] {toMail};
            email.setToAddresses(to);
        email.setSubject('Test Mail');
        system.debug('test');
        email.setHtmlBody('Hello,<br/><br/> Take the survey using this link: <a href=" https://www.patientslikeme.com/participate_study"> https://www.patientslikeme.com/participate_study</a>');
        try{
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
            User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
            Account acc = [SELECT Id,EmailCheck__c FROM Account WHERE Id =:user.AccountId];
            acc.EmailCheck__c = true;
        }catch(exception e){
            apexpages.addmessage(new apexpages.message(apexpages.severity.error,e.getMessage()));
        }
    }
    @AuraEnabled
    public static string sendEmail(){
        DateTime dt = system.now();
        System.debug('dt '+dt);
        String constructedChronic =  '0 '+(dt.minute()+1)+' '+dt.hour()+' '+dt.day()+' '+dt.month()+' ? '+dt.year();
        System.debug('constructedChronic '+constructedChronic);
        System.debug(dt+' dt'+ (dt.minute()+1)+'minute '+dt.hour() +'hour '+dt.day()+'Day of month'+dt.month()+'month '+'*'+'year ');
        String jobID = system.schedule('Transplant survey link4'+constructedChronic, constructedChronic, new EmailTriggerTransplant());
        return 'successful';
    }
}