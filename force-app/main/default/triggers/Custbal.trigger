trigger Custbal on customerinfo__c (before update,before insert) {
 
 for(customerinfo__c ob1:Trigger.New){
     Integer dtDate = Date.valueOf(ob1.Account_openning_date__c).year();
     System.debug(dtDate);
     if(dtDate == 2022)
      {
      if(ob1.Balance__c>10000&&ob1.Balance__c>100000){
            ob1.Comments__c='You are Silver Customer, Please contact branch for new offers especially for you.';
      }
      else if(ob1.Balance__c>100000&&ob1.Balance__c>1000000){
            ob1.Comments__c='You are gold Customer, Please contact branch for new offers especially for you.';
      }
          
      else if(ob1.Balance__c>1000000){
            ob1.Comments__c='You are platinum Customer, Please contact branch for new offers especially for you.';
      }      
}
}
}