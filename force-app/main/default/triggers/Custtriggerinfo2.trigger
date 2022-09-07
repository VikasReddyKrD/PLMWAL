trigger Custtriggerinfo2 on customerinfo__c (before insert,before update) {
System.debug(Trigger.isInsert);
if(Trigger.isInsert)
{
for(customerinfo__c ob: Trigger.New)
ob.Name__c = 'Mr/Mrs ' + ob.Name__c;
}

if(Trigger.isUpdate)
{
for(customerinfo__c ob: Trigger.New)
{
if(ob.Name__c.contains('Mr/Mrs '))
continue;
ob.Name__c = 'Mr/Mrs ' + ob.Name__c;
}
}
}