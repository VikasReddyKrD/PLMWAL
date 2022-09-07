global class PatientsLikeMeRegistrationHandler implements Auth.RegistrationHandler {
  global User createUser(Id portalId, Auth.UserData data) {
    List<User> users = [select Id from User where email = :data.email];

    if (users.size() > 0) {
      system.debug('#### createUser - user with email ' + data.email + ' already exists');
      return users[0];
    }

    system.debug('#### createUser: ' + data);
    Id accountId = createAccountFromUserData(data);

    Account account = [SELECT Id, PersonContactId, FirstName, LastName FROM Account WHERE Id = :accountId];

    User user = new User(
      PortalRole = 'PersonAccount',
      ProfileId = getCommunityUserProfileId(),
      ContactId = account.PersonContactId,
      Email = data.email,
      UserName = getUsername(data.email),
      FirstName = account.FirstName,
      LastName = account.LastName,
      Alias = getAliasFromUsername(data.username),
      LanguageLocaleKey = UserInfo.getLocale(),
      LocaleSidKey = UserInfo.getLocale(),
      EmailEncodingKey = 'UTF-8',
      TimeZoneSidKey = 'America/New_York'
    );

    insert(user);

    return user;
  }

  global void updateUser(Id userId, Id portalId, Auth.UserData data) {
    User u = new User(id=userId);

    system.debug('#### updateUser: ' + data);
    u.email = data.email;
    u.lastName = getLastName(data);
    u.firstName = data.firstName;

    update(u);
  }

  private String getUsername(String email) {
    return email + '.plm' + getCurrentInstanceName();
  }

  private String getAliasFromUsername(String username) {
    return username.length() > 8 ? username.substring(0, 8) : username;
  }

  private Id getCommunityUserProfileId() {
    Profile profile = [SELECT Id FROM profile WHERE name = 'Customer Community Plus Login User Custom'];
    return profile.Id;
  }

  private Id createAccountFromUserData(Auth.UserData data) {
    RecordType accountType =  [SELECT Id FROM RecordType WHERE Name = 'Person Account' and SObjectType = 'Account'];

    Account account = new Account(
      RecordType = accountType,
      FirstName = data.firstName,
      LastName = getLastName(data),
      PLM_Email_Address__c = data.email,
      PLM_User_ID__c = data.identifier,
      PLM_Username__c	= data.username
    );

    insert(account);

    return account.Id;
  }

  private String getLastName(Auth.UserData data) {
    return (data.lastName == null || ''.equals(data.lastName.trim())) ? data.username : data.lastName;
  }

  private String getCurrentInstanceName() {
    Organization org = [SELECT Id, IsSandbox FROM Organization WHERE Id = :UserInfo.getOrganizationId()];

    return org.IsSandbox ? '.sandbox' : '';
  }
}