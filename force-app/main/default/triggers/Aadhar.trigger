trigger Aadhar on Aadhar__c (after update) {
for(Aadhar__c aa: Trigger.old)
{
    if(aa.Salary__c>45000)
    {
       aa.Aadress__c='hyderabad'; 
    }
}
}