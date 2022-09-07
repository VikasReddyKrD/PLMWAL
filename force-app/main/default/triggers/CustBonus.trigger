trigger CustBonus on customerinfo__c (before insert) {
for(customerinfo__c ob2:Trigger.New){
  if(ob2.Type_of_Account__c=='salary') 
  {
      Integer intrandomNumber = Integer.valueOf((Math.random() *1000));
      ob2.Comments__c=ob2.Comments__c='You have own a voucher '+'v'+intrandomNumber;
     ob2.Balance__c =ob2.Balance__c+50;
      
  }
}
}