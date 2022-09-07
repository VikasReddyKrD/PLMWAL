trigger book on Book1__c (before insert) {
for(Book1__c a:Trigger.new)
{
    a.Salary__c=5678;
}   
}