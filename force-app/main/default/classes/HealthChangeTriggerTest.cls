@isTest
private class HealthChangeTriggerTest {

	public static final String ACC1_NAME = 'Jon Doe';
	public static final String ACC2_NAME = 'Jane Doe';
	public static final String ACC3_NAME = 'Stacy Tester';
	public static final String ACC4_NAME = 'Timothy Person';
	public static final String ACC5_NAME = 'Mary Test';

	@testSetup
	static void testSetup() {
		Id indRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();

		Account patient1 = new Account(RecordTypeId=indRecordTypeId, Name=ACC1_NAME);
		Account patient2 = new Account(RecordTypeId=indRecordTypeId, Name=ACC2_NAME);
		Account patient3 = new Account(RecordTypeId=indRecordTypeId, Name=ACC3_NAME, Most_Recent_Consent_Date__c=Date.today(), Paused_Draws__c=0, Requests_in_Progress__c=0, Draw_Last_15_Days__c=0);
		Account patient4 = new Account(RecordTypeId=indRecordTypeId, Name=ACC4_NAME);
		Account patient5 = new Account(RecordTypeId=indRecordTypeId, Name=ACC5_NAME, Most_Recent_Consent_Date__c=Date.today(), Paused_Draws__c=0, Requests_in_Progress__c=0, Draw_Last_15_Days__c=0);
		insert new List<Account>{patient1, patient2, patient3, patient4, patient5};

		Id colARecordTypeId = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection A').getRecordTypeId();

		Collection_Data__c cd2 = new Collection_Data__c(Patient__c=patient3.Id, RecordTypeId=colARecordTypeId, Status__c='Completed');
		insert new List<Collection_Data__c>{cd2};

		Appointment__c appt1 = new Appointment__c(Patient__c=patient1.Id, Status__c='Completed', Date2__c=Date.today().addDays(-15));
		Appointment__c appt2 = new Appointment__c(Patient__c=patient2.Id);
		Appointment__c appt3 = new Appointment__c(Patient__c=patient3.Id, Draw_Type__c='Baseline', Status__c='Completed');
		Appointment__c appt4 = new Appointment__c(Patient__c=patient4.Id);
		Appointment__c appt5 = new Appointment__c(Patient__c=patient5.Id);
		insert new List<Appointment__c>{appt1, appt2, appt3, appt4, appt5};

		Group allCaseQueue = [SELECT Id FROM Group WHERE Type = 'Queue' AND DeveloperNAME = 'All_Cases' LIMIT 1];

		Case c1 = new Case(AccountId=patient1.Id, OwnerId=allCaseQueue.Id, of_Needs_Review_Health_Changes__c=0);
		Case c2 = new Case(AccountId=patient2.Id, OwnerId=allCaseQueue.Id);
		Case c3 = new Case(AccountId=patient3.Id, OwnerId=allCaseQueue.Id);
		Case c4 = new Case(AccountId=patient4.Id, OwnerId=allCaseQueue.Id);
		Case c5 = new Case(AccountId=patient5.Id, OwnerId=allCaseQueue.Id);
		insert new List<Case>{c1, c2, c3, c4, c5};

		Health_Change__c notIgnored = new Health_Change__c(Case__c=c3.Id, Health_Change_Source__c='Requested', Status__c='Reviewed', Detected_ID__c='not-ignored');
		Health_Change__c notIgnored2 = new Health_Change__c(Case__c=c5.Id, Health_Change_Source__c='Requested', Status__c='Reviewed', Detected_ID__c='not-ignored-2');
		insert new List<Health_Change__c>{ notIgnored, notIgnored2};
	}
	
	@isTest 
	static void testSetIgnored() {
		Test.startTest();

			Account patient2 = [SELECT Id, Eligible_for_Draw__c FROM Account WHERE Name=:ACC2_NAME];
			Account patient4 = [SELECT Id, Eligible_for_Draw__c FROM Account WHERE Name=:ACC4_NAME];

			System.debug('ELIGIBLE: ' + patient4.Eligible_for_Draw__c);

			Case c2 = [SELECT Id FROM Case WHERE AccountId=:patient2.Id];
			Case c4 = [SELECT Id, (SELECT Id, Status__c FROM Health_Changes__r) FROM Case WHERE AccountId=:patient4.Id];

			System.debug('CHILDREN: ' + c4.Health_Changes__r);

			Health_Change__c hc2DI = new Health_Change__c(Case__c=c2.Id, Date_of_Health_Change__c=Date.today().addDays(-12) ,Health_Change_Source__c='Detected', Detected_ID__c='detected-ignored');
			Health_Change__c hc4RI = new Health_Change__c(Case__c=c4.Id, Health_Change_Source__c='Requested', Detected_ID__c='requested-ignored');
			insert new List<Health_Change__c>{hc2DI, hc4RI};

			Health_Change__c hc = [SELECT Id, Status__c FROM Health_Change__c WHERE Detected_ID__c='requested-ignored'];
			Health_Change__c hc2 = [SELECT Id, Status__c FROM Health_Change__c WHERE Detected_ID__c='detected-ignored'];
		Test.stopTest();

		System.assertEquals('Ignored', hc.Status__c);
		System.assertEquals('Ignored', hc2.Status__c);
	}
	
	@isTest 
	static void testSetDeferred() {
		Test.startTest();
			Account patient1 = [SELECT Id FROM Account WHERE Name=:ACC1_NAME];

			Case c1 = [SELECT Id FROM Case WHERE AccountId=:patient1.Id];

			Health_Change__c hc1DD = new Health_Change__c(Case__c=c1.Id, Health_Change_Source__c='Detected', Detected_ID__c='detected-deferred');
			insert hc1DD;
			
			Health_Change__c hc = [SELECT Id, Status__c FROM Health_Change__c WHERE Detected_ID__c='detected-deferred'];
		Test.stopTest();

		System.assertEquals('Deferred', hc.Status__c);
	}

	@isTest 
	static void testSetNeedsReview() {
		Test.startTest();
			Account patient3 = [SELECT Id FROM Account WHERE Name=:ACC3_NAME];
			Account patient5 = [SELECT Id FROM Account WHERE Name=:ACC5_NAME];

			Case c3 = [SELECT Id FROM Case WHERE AccountId=:patient3.Id];
			Case c5 = [SELECT Id FROM Case WHERE AccountId=:patient5.Id];

			Health_Change__c hc3DNR = new Health_Change__c(Case__c=c3.Id, Health_Change_Source__c='Detected', Detected_ID__c='detected-needs-review');		
			Health_Change__c hc5RNR = new Health_Change__c(Case__c=c5.Id, Health_Change_Source__c='Requested', Detected_ID__c='requested-needs-review');
			insert new List<Health_Change__c>{hc3DNR, hc5RNR};

			Health_Change__c hc = [SELECT Id, Status__c FROM Health_Change__c WHERE Detected_ID__c='detected-needs-review'];
			Health_Change__c hc2 = [SELECT Id, Status__c FROM Health_Change__c WHERE Detected_ID__c='requested-needs-review'];
		Test.stopTest();

		//System.assertEquals('Needs Review', hc.Status__c);
		System.assertEquals('Needs Review', hc2.Status__c);

	}

	@isTest 
	static void testChangeToNeedsReview() {
		Test.startTest();

			Account patient4 = [SELECT Id, Eligible_for_Draw__c FROM Account WHERE Name=:ACC4_NAME];

			Case c4 = [SELECT Id, (SELECT Id, Status__c FROM Health_Changes__r) FROM Case WHERE AccountId=:patient4.Id];

			Health_Change__c hc4RI = new Health_Change__c(Case__c=c4.Id, Health_Change_Source__c='Requested', Detected_ID__c='requested-ignored');
			insert hc4RI;

			Health_Change__c hc = [SELECT Id, Status__c FROM Health_Change__c WHERE Detected_ID__c='requested-ignored'];

			Appointment__c appt = new Appointment__c(Patient__c=patient4.Id, Status__c='Completed', Date2__c=Date.today());
			insert appt;
	
			patient4.Most_Recent_Consent_Date__c=Date.today(); 
			patient4.Paused_Draws__c=0;
			patient4.Requests_in_Progress__c=0;
			patient4.Draw_Last_15_Days__c=0;
			update patient4;

			Id colARecordTypeId = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection A').getRecordTypeId();
			Collection_Data__c cd2 = new Collection_Data__c(Patient__c=patient4.Id, RecordTypeId=colARecordTypeId, Status__c='Completed');
			insert new List<Collection_Data__c>{cd2};

		Test.stopTest();	

		hc = [SELECT Id, Status__c FROM Health_Change__c WHERE Detected_ID__c='requested-ignored'];
		System.assertEquals('Needs Review', hc.Status__c);

	}

	@isTest
	static void testUpdateQueue() {
		Test.startTest();

			Group reviewQueue = [SELECT Id FROM Group WHERE Type = 'Queue' AND DeveloperNAME = 'State_Change_Review' LIMIT 1];
			Group ignoreQueue = [SELECT Id FROM Group WHERE Type = 'Queue' AND DeveloperNAME = 'Ignored_State_Change_Queue' LIMIT 1];

			Account patient4 = [SELECT Id, Eligible_for_Draw__c FROM Account WHERE Name=:ACC4_NAME];

			Case c4 = [SELECT Id, (SELECT Id, Status__c FROM Health_Changes__r) FROM Case WHERE AccountId=:patient4.Id];

			Health_Change__c hcRI = new Health_Change__c(Case__c=c4.Id, Health_Change_Source__c='Requested', Detected_ID__c='requested-ignored');
			Health_Change__c hc2RI = new Health_Change__c(Case__c=c4.Id, Health_Change_Source__c='Requested', Detected_ID__c='requested-ignored-2');
			insert hcRI;
			insert hc2RI;

			c4 = [SELECT Id, OwnerId, (SELECT Id, Status__c FROM Health_Changes__r) FROM Case WHERE AccountId=:patient4.Id];
			System.assertEquals(ignoreQueue.Id, c4.OwnerId);

			Appointment__c appt = new Appointment__c(Patient__c=patient4.Id, Status__c='Completed', Date2__c=Date.today());
			insert appt;
	
			patient4.Most_Recent_Consent_Date__c=Date.today(); 
			patient4.Paused_Draws__c=0;
			patient4.Requests_in_Progress__c=0;
			patient4.Draw_Last_15_Days__c=0;
			update patient4;

			Id colARecordTypeId = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection A').getRecordTypeId();
			Collection_Data__c cd2 = new Collection_Data__c(Patient__c=patient4.Id, RecordTypeId=colARecordTypeId, Status__c='Completed');
			insert new List<Collection_Data__c>{cd2};

			Health_Change__c hcRNR = new Health_Change__c(Case__c=c4.Id, Health_Change_Source__c='Requested', Detected_ID__c='requested-needs-review');
			insert hcRNR;

		Test.stopTest();

		c4 = [SELECT Id, OwnerId, (SELECT Id, Status__c FROM Health_Changes__r) FROM Case WHERE AccountId=:patient4.Id];
		System.assertEquals(reviewQueue.Id, c4.OwnerId);
	}

	@isTest
	static void testPopulatePatient() {
		Test.startTest();

			Account patient4 = [SELECT Id, Eligible_for_Draw__c FROM Account WHERE Name=:ACC4_NAME];

			Case c4 = [SELECT Id FROM Case WHERE AccountId=:patient4.Id];

			Health_Change__c hcRI = new Health_Change__c(Case__c=c4.Id, Health_Change_Source__c='Requested', Detected_ID__c='requested-ignored');
			insert hcRI;

		Test.stopTest();

		Health_Change__c hc = [SELECT Id, Patient__c FROM Health_Change__c WHERE Detected_ID__c='requested-ignored'];
		System.assertEquals(patient4.Id, hc.Patient__c);

	}

	
}