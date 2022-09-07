@isTest
public class GoverLimitTest {



@isTest
static void testme()
{

System.debug('Governor before starttest :'+ Limits.getDmlStatements());//0

Test.startTest();
for(Integer a =0; a<14;a++)
{
insert new Account(Name = 'Srini'+a);
}
System.debug('Governor while :'+ Limits.getDmlStatements());
Test.stopTest();
System.debug('Governor after :'+ Limits.getDmlStatements());//0

}

}