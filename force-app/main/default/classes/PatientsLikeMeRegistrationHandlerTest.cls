@isTest
public class PatientsLikeMeRegistrationHandlerTest {
  // Auth.UserData(
  //  String identifier, String firstName, String lastName, String fullName, String email,
  //  String link, String userName, String locale, String provider, String siteLoginUrl,
  //  Map<String, String> attributeMap
  // )
  @isTest static void createUser() {
    Map<String, String> attrs = new Map<String, String> { 'language' => 'en_US' };

    Auth.UserData data = new Auth.UserData(
      'testId', 'Test', 'User', 'Test User', 'testuser@patientslikeme.com',
      null, 'plm_username', 'en_US', null, null, attrs
    );

    PatientsLikeMeRegistrationHandler handler = new PatientsLikeMeRegistrationHandler();

    Test.startTest();
    User user = handler.createUser(null, data);
    Test.stopTest();

    assertAccountWasCreated(data);
    System.assertEquals('PersonAccount', user.PortalRole);
    System.assert(user.ProfileId != null);
    System.assert(user.ContactId != null);
    System.assertEquals(data.firstName, user.FirstName, 'First names did not match');
    System.assertEquals(data.lastName, user.LastName, 'Last names did not match');
    System.assertEquals(data.email, user.Email, 'Emails did not match');
    System.assertEquals(getExpectedUsername(data.email), user.UserName, 'Usernames did not match');
    System.assert(user.Alias != null);
    System.assert(user.LanguageLocaleKey != null);
    System.assert(user.LocaleSidKey != null);
    System.assertEquals('UTF-8', user.EmailEncodingKey);
    System.assertEquals('America/New_York', user.TimeZoneSidKey);
  }

  @isTest static void createUserWithMissingName() {
    Map<String, String> attrs = new Map<String, String> { 'language' => 'en_US' };

    Auth.UserData data = new Auth.UserData(
      'testId', null, null, null, 'testuser@patientslikeme.com',
      null, 'plm_username', 'en_US', null, null, attrs
    );

    PatientsLikeMeRegistrationHandler handler = new PatientsLikeMeRegistrationHandler();

    Test.startTest();
    User user = handler.createUser(null, data);
    Test.stopTest();

    System.assert(user.FirstName == null);
    System.assertEquals(data.userName, user.LastName);
  }

  @isTest static void createUserWhenUsernameIsTaken() {
    Map<String, String> attrs = new Map<String, String> { 'language' => 'en_US' };

    Auth.UserData data = new Auth.UserData(
      'testId', 'Test', 'User', 'Test User', 'testuser@patientslikeme.com',
      null, 'plm_username', 'en_US', null, null, attrs
    );

    User existing = insertTestUser(data);

    PatientsLikeMeRegistrationHandler handler = new PatientsLikeMeRegistrationHandler();

    Test.startTest();
    User user = handler.createUser(null, data);
    Test.stopTest();

    System.assertEquals(existing.Id, user.Id);
  }

  @isTest static void updateUser() {
    Map<String, String> attrs = new Map<String, String> { 'language' => 'en_US' };

    Auth.UserData data = new Auth.UserData(
      'testId', 'Test', 'User', 'Test User', 'testuser@patientslikeme.com',
      null, 'plm_username', 'en_US', null, null, attrs
    );

    User existing = insertTestUser(data);

    data.firstName = 'Someone';
    data.lastName = 'Else';
    data.fullName = 'Someone Else';
    data.email = 'another@patientslikeme.com';

    PatientsLikeMeRegistrationHandler handler = new PatientsLikeMeRegistrationHandler();

    Test.startTest();
    handler.updateUser(existing.Id, null, data);
    Test.stopTest();

    User user = [SELECT Id, FirstName, LastName, Email, UserName, Alias FROM User WHERE Id = :existing.Id];

    System.assertEquals(data.firstName, user.FirstName);
    System.assertEquals(data.lastName, user.LastName);
    System.assertEquals(data.email, user.Email);
    System.assertEquals(existing.UserName, user.UserName);
    System.assertEquals(existing.Alias, user.Alias);
  }

  @isTest static void updateUserWithMissingName() {
    Map<String, String> attrs = new Map<String, String> { 'language' => 'en_US' };

    Auth.UserData data = new Auth.UserData(
      'testId', 'Test', 'User', 'Test User', 'testuser@patientslikeme.com',
      null, 'plm_username', 'en_US', null, null, attrs
    );

    User existing = insertTestUser(data);

    data.firstName = 'Someone';
    data.lastName = null;
    data.fullName = 'Someone Else';
    data.email = 'another@patientslikeme.com';

    PatientsLikeMeRegistrationHandler handler = new PatientsLikeMeRegistrationHandler();

    Test.startTest();
    handler.updateUser(existing.Id, null, data);
    Test.stopTest();

    User user = [SELECT Id, FirstName, LastName, Email, UserName, Alias FROM User WHERE Id = :existing.Id];

    System.assertEquals(data.firstName, user.FirstName);
    System.assertEquals(data.userName, user.LastName);
    System.assertEquals(data.email, user.Email);
    System.assertEquals(existing.UserName, user.UserName);
    System.assertEquals(existing.Alias, user.Alias);
  }

  private static User insertTestUser(Auth.UserData data) {
    Profile profile = [SELECT Id FROM profile WHERE name='Standard User'];

    User user = new User(
      ProfileId = profile.Id,
      Email = data.email,
      UserName = data.email + '.plm',
      FirstName = data.firstName,
      LastName = data.lastName,
      Alias = 'alias',
      LanguageLocaleKey = data.attributeMap.get('language'),
      LocaleSidKey = data.locale,
      EmailEncodingKey = 'UTF-8',
      TimeZoneSidKey = 'America/New_York'
    );

    insert user;

    return user;
  }

  private static void assertAccountWasCreated(Auth.UserData data) {
    Account account = [SELECT Id FROM Account WHERE FirstName = :data.firstName AND LastName = :data.lastName];

    System.assert(account != null);
    System.assert(account.Id != null);
  }

  private static String getExpectedUsername(String email) {
    Organization org = [SELECT Id, IsSandbox FROM Organization WHERE Id = :UserInfo.getOrganizationId()];

    return email + (org.IsSandbox ? '.plm.sandbox' : '.plm');
  }
}