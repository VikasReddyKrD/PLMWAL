@isTest
private class AccountTriggerTest {

	public static String ACCT_FNAME = 'John';
	public static String ACCT_LNAME = 'Doe';
	public static String ACCT2_FNAME = 'Jane';
	public static String ACCT2_LNAME = 'Doe';

	@testSetup
	static void testSetup() {
		Id patientRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Patient').getRecordTypeId();
		
		Account patient = new Account(FirstName=ACCT_FNAME, LastName=ACCT_LNAME, RecordTypeId=patientRecordTypeId);
		insert patient;

		Account patient2 = new Account(FirstName=ACCT2_FNAME, LastName=ACCT2_LNAME, RecordTypeId=patientRecordTypeId);
		insert patient2;

		Appointment__c baseline = new Appointment__c(Status__c='Completed', Completed_Date__c=Date.today().addDays(-72), Scheduled_Date__c=Date.today().addDays(-72), Patient__c=patient.Id, Baseline__c=true);
		insert baseline;

		Appointment__c baseline2 = new Appointment__c(Status__c='Completed', Completed_Date__c=Date.today().addDays(-34), Scheduled_Date__c=Date.today().addDays(-34), Patient__c=patient2.Id, Baseline__c=true);
		insert baseline2;

		Request__c routineDraw = new Request__c(
			Draw_type__c = 'Routine',
            Patient__c = patient2.Id,
            Request_Status__c = 'Not Sent',
            Name = patient2.Name + ' - Routine',
            Requested_At__c = Date.today().addDays(-45),
            Draw_By_Date__c = Date.today().addDays(-24),
            Vendor_Sent_To__c = 'EMSI'
		);
		insert routineDraw;
	}
	
	@isTest 
	static void testExistingRoutineDraw() {
		Test.startTest();

			Account patient = [SELECT Id, Last_Draw_Date__c, FirstName, LastName FROM Account WHERE FirstName=:ACCT_FNAME AND LastName=:ACCT_LNAME];

			Appointment__c appt = new Appointment__c(Status__c='Completed', Completed_Date__c=Date.today(), Scheduled_Date__c=Date.today(), Patient__c=patient.Id);
			insert appt;

			patient = [SELECT Id, Last_Draw_Date__c, FirstName, LastName FROM Account WHERE FirstName=:ACCT_FNAME AND LastName=:ACCT_LNAME];
			System.assertEquals(Date.today(), patient.Last_Draw_Date__c);

			List<Request__c> routineDraws = [SELECT Id, Name, Draw_type__c, Patient__c, Requested_At__c FROM Request__c WHERE Patient__c=:patient.Id];

		Test.stopTest();

		String name = patient.FirstName + ' ' + patient.LastName;

		System.assertEquals(1, routineDraws.size());
		System.assertEquals('Routine', routineDraws[0].Draw_type__c);
		System.assertEquals(patient.Last_Draw_Date__c.addDays(99), routineDraws[0].Requested_At__c);
		//System.assertEquals(name + ' - Routine - ' + routineDraws[0].Requested_At__c.format(), routineDraws[0].Name);
	}
	
	@isTest 
	static void testMultipleRoutineDraw() {

		Test.startTest();

			Account patient = [SELECT Id, Last_Draw_Date__c, FirstName, LastName FROM Account WHERE FirstName=:ACCT2_FNAME AND LastName=:ACCT2_LNAME];

			List<Request__c> routineDraws = [SELECT Id, Draw_type__c, Patient__c, Requested_At__c, Request_Status__c FROM Request__c WHERE Patient__c=:patient.Id];

			//System.assertEquals(2, routineDraws.size());

			Appointment__c appt = new Appointment__c(Status__c='Completed', Completed_Date__c=Date.today(), Scheduled_Date__c=Date.today(), Patient__c=patient.Id);
			insert appt;

			patient = [SELECT Last_Draw_Date__c, FirstName, LastName FROM Account WHERE Id=:patient.Id];
			System.assertEquals(Date.today(), patient.Last_Draw_Date__c);

			routineDraws = [SELECT Id, Name, Patient__c, Requested_At__c FROM Request__c WHERE Patient__c=:patient.Id AND Request_Status__c='Not Sent'];
			List<Request__c> closedDraws = [SELECT Id, Patient__c, Request_Status__c FROM Request__c WHERE Patient__c=:patient.Id AND Request_Status__c!='Not Sent'];

		Test.stopTest();

		String name = patient.FirstName + ' ' + patient.LastName;

		System.assertEquals(1, closedDraws.size());
		System.assertEquals('Closed - No Draw', closedDraws[0].Request_Status__c);

		System.assertEquals(1, routineDraws.size());
		System.assertEquals(Date.today().addDays(99), routineDraws[0].Requested_At__c);
		//System.assertEquals(name + ' - Routine - ' + Date.today().addDays(99).format(), routineDraws[0].Name);
	}
	
}