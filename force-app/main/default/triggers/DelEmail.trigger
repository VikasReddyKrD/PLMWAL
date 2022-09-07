trigger DelEmail on Account (after delete) {
List<Messaging.email>emaillist=new List<Messaging.email>();
   for(Account a:trigger.old)
   {
       Messaging.singleEmailMessage deleteacc=new Messaging.SingleEmailMessage();
       deleteacc.setToAddresses(new string[] {a.Email__c});
       deleteacc.setSubject('account deleted');
       string body = 'Dear user, your account record is delete sucessfully';
       deleteacc.setHtmlBody(body);
       emaillist.add(deleteacc);
   }
    Messaging.sendEmail(emaillist);
}