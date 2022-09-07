trigger aadhartrig on Aadhar__c (after insert, after update) {
for(Aadhar__c ad:Trigger.new)
{
if(ad.Salary__c>45000)
{
ad.Aadress__c='Hyderabad';
update ad;
}
}
}