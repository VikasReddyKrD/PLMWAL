@isTest(SeeAllData = true)
public class PortalUserCreation_Test  {
    
    public static  Id contactId;
    
 
    public testMethod static void createUser(){
        
        Account acc = new Account(
            RecordTypeID='0126A000000VISYQA4',
            FirstName='Test FName',
            LastName='Test LNames',
            PersonMailingStreet='test@yahoo.com',
            PersonMailingPostalCode='12345',
            PersonMailingCity='SFO',
            PersonEmail='test123@yahoo.com',
            PersonHomePhone='1234567',
            PersonMobilePhone='12345678'
        );   
        insert acc;
        Account a = [Select Id,PersonContactId from Account WHERE id=:acc.id LIMIT 1];
        contactId = a.PersonContactId;
        System.debug('contactId '+contactId);
        test1(contactId);
    }
    
    public static void test1(Id contactId){	
        SSOUserCreation.Wrapper wrapper = new SSOUserCreation.Wrapper();
        wrapper.firstname = 'vinay';
        wrapper.lastname = 'praveen';
        wrapper.email = 'vinay@plm.com';
        wrapper.salutation = 'mr';
        System.debug('contactId '+contactId);
        system.enqueueJob(new PortalUserCreation(JSON.serialize(wrapper),contactId));
    }
}