@isTest
public class DataTest {
    
    static testmethod void testLoadData() {
        // Load the test accounts from the static resource
        List<sObject> ls = Test.loadData(Account.sObjectType, 'SampleTestData');
        // Verify that all 3 test accounts were created
        System.assert(ls.size() == 3);
        
        
        
        // Get first test account
        Account a1 = (Account)ls[0];
        String acctName = a1.Name;
        System.debug(acctName);
    }
}