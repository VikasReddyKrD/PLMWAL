trigger Custduplicate on customerinfo__c (before insert) {
for(customerinfo__c ob:Trigger.New){
/* if(ob.Name__c==ob.Name__c){
ob.Name__c.addError('Account with same name is existing');
}*/
List <customerinfo__c> obj = [select Name__c from customerinfo__c where Name__c = :ob.Name__c];
if(obj.size()>0)
{
ob.Name__c.addError('Accounbt with same name already existing');
}
}
}