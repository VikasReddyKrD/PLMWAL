public class PortalUserCreation implements Queueable, Database.AllowsCallouts {
    
    public String inputJson;
    public Id contactId;
    public PortalUserCreation(String inputJson,Id contactId){
        this.inputJson = inputJson;
        this.contactId= contactId;
    }
    public void execute(QueueableContext context) {
        Profile profile = [SELECT id FROM Profile WHERE Name = 'Customer Community Plus Login User Custom'];
       // UserRole role = [select id,Name from UserRole WHERE Name='sn Customer Person Account'];
        system.debug('profile'+profile.id);
        //system.debug('role'+role.id);
        SSOUserCreation.Wrapper wrapper =(SSOUserCreation.Wrapper)JSON.deserializeStrict(
                            inputJson,
                            SSOUserCreation.Wrapper.class);
        User user = new User(alias = wrapper.lastname.substring(0,2) , email=wrapper.email,
                                 lastname=wrapper.lastname, profileid = profile.id, IsActive =true,
                                ContactId = contactId,
                                 username=wrapper.email,TimeZoneSidKey='America/New_York', LocaleSidKey='en_US',
                             	EmailEncodingKey ='ISO-8859-1', LanguageLocaleKey='en_US');
        System.debug('user '+user.ContactId);
        insert user;
        System.debug('user '+user.id); 
        system.setPassword(user.id, 'test@1234');
    }
}