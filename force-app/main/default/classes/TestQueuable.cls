@isTest
public class TestQueuable {
    
@isTest
    public static void testme1()
    {
        Test.startTest();
        Id op=System.enqueueJob(new queuableExample());
        System.debug(op);
        Test.stopTest();
    }
}