trigger LessBalEmail on customerinfo__c (before insert) {
for(customerinfo__c ob4:Trigger.New){
    if(ob4.Balance__c<1000)
    {
        ob4.Comments__c=' insuffienct balance,please charge ur account.';
    }
}
}