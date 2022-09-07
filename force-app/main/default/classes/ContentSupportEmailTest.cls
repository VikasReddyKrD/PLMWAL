@isTest
public class ContentSupportEmailTest {
	
 	public static boolean isTestExecuting = false;

    @isTest
    static void testContentSupport()
    {
      Test.StartTest();
      ContentSupportEmail.sendEmail(new List<String>{'test@test.com'}, 'Unit Test X', 'Unit Test');
      Integer invocations = Limits.getEmailInvocations();
      Test.stopTest();
      system.assertEquals(1, invocations,  'An email should be sent');   
    }
    
    @isTest
    static void testContentSupportCatch()
    {
      isTestExecuting = true;
      //Test.StartTest();
        try{
          ContentSupportEmail.sendEmail(new List<String>{'test@test.com'}, 'Unit Test X', 'Unit Test');
          Integer invocations = Limits.getEmailInvocations();
        }
        catch(exception e){
            system.debug('error message is '+ e + ' Message inside is '+ e.getTypeName() + ' Cause is ' + e.getCause() + ' Line number is '+e.getLineNumber());
            system.assertEquals('System.AuraHandledException', e.getTypeName(),  'Exception types did not match');
        }
      //Test.stopTest();
      //system.assertEquals(1, invocations,  'An email should be sent');   
    }
}