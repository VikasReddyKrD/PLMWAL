trigger Accountcreate on Lead(after insert)
{
List<Account> accs= new List<Account>();
List<Contact> con=new List<Contact>();
List<Opportunity> op=new List<Opportunity>();
Date myDate = Date.today();
for(Lead ld:Trigger.new)
{
Account acc= new Account();
acc.Name=ld.Firstname;
accs.add(acc) ;
Contact co=new Contact();
    co.LastName=ld.Firstname;
    co.AccountId=ld.ConvertedAccountId;
    con.add(co);
    
    Opportunity opp=new Opportunity();
    opp.Name=ld.Firstname;
    opp.StageName='Prospecting';
    opp.CloseDate=myDate;
    opp.ContactId=ld.ConvertedContactId;
    opp.AccountId=ld.ConvertedAccountId;
    op.add(opp);
}
insert accs;
insert con;
insert op;
   
}