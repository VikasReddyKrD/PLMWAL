@isTest
private class AccountcreateTest
{ @isTest static void Accountcreate()
{
List<Lead> les = new List<Lead>();
for(Integer i = 0 ;i<10;i++)
{
Lead ld = new Lead();
ld.Status = 'Closed - Converted';
}
Insert les;}
}