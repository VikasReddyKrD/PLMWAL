@isTest
private class CategorizePatientColorTest {
 
	public static final String ACCT_FNAME = 'Jon';
    public static final String ACCT_LNAME = 'Doe';
    public static final String COLB_NAME = 'Collection B Data';
    public static final Id patientRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Patient').getRecordTypeId();
    public static final Id collectionA = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection A').getRecordTypeId();
	public static final Id collectionB = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection B').getRecordTypeId();
	
	@testSetup
	static void setup(){
		List<Account> accounts = new List<Account>();
		List<Patient_Program__c> programs = new List<Patient_Program__c>();
		List<Collection_Data__c> collectionData = new List<Collection_Data__c>();
		List<Appointment__c> appointmentData = new List<Appointment__c>();
		List<Request__c> requests = new List<Request__c>(); 
		List<Collection_Data__c> collectionBData = new List<Collection_Data__c>();
		
		for(Integer i=0; i<10; i++){
			 Account newPatient = new Account(RecordTypeId=patientRecordTypeId, 
			 		FirstName=ACCT_FNAME+i, LastName=ACCT_LNAME, Most_Recent_Consent_Date__c=Date.today(),
			 		Date_Withdrawn__c = null, Requests_in_Progress__c=0, Draw_Last_15_Days__c=0);
       		accounts.add(newPatient);
		}

		insert accounts; 

		for(Account patient : accounts){
				programs.add(new Patient_Program__c(
							Patient__c=patient.Id, 
							Did_Patient_Withdraw__c = null,
							Consent_Date__c=null));
				requests.add(new Request__c(
							Patient__c = patient.Id,
							Number_of_Request_Attempts__c =0,
							Sent_Date__c  = null));
				collectionData.add(new Collection_Data__c(
							Patient__c=patient.Id,
							Baseline_Survey_Completion_Date__c=null, 
							Baseline_Survey_Status__c = '',
							RecordTypeId = collectionA
							));	
				collectionBData.add(new Collection_Data__c(
							RecordTypeId = collectionB,
							Patient__c =patient.Id,
							DOD_Survey_Completion_Date__c = null
					));			
		}

		insert programs;
		insert requests;
		insert collectionData;
		insert collectionBData;

		for(Request__c request : requests){
			appointmentData.add(new Appointment__c(
							Patient__c = request.Patient__c,
							Status__c='', 	
							Scheduled_Date__c=null, 
							Completed_Date__c=null,
							Request__c = request.Id
							));
		}

		for(Integer i =0; i<10; i++){
			appointmentData.get(i).Lookup_To_Collection_B__c = collectionBData.get(i).Id;
			System.debug(appointmentData.get(i).Lookup_To_Collection_B__r);
		
		}

		insert appointmentData; 
	}

	@isTest
	static void testInvalidForColorCategorization(){
		Test.startTest();
		List<Account> patients = [SELECT Id, Most_Recent_Consent_Date__c
							FROM Account
							];
		for(Account patient: patients){
			patient.Most_Recent_Consent_Date__c = null;
		}
		update patients; 

		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);
		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c = null]);
	}


	@isTest
	static void testInsert(){
		Test.startTest();
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);
		Test.stopTest();
		System.assertEquals(10, [SELECT count() FROM Account ]);
	}

	@isTest
	static void testWithdrawn(){

		Test.startTest();
		List<Account> patients = [SELECT Date_Withdrawn__c 
							FROM Account];

		for(Account patient: patients){
			patient.Date_Withdrawn__c = Date.today();
		}
		update patients;

		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);
		Test.stopTest();
		System.assertEquals(10, [SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'red']);
	}

	@isTest
	static void testGreenLevelOne(){
		Test.startTest();
		List<Account> accounts = [SELECT Id FROM Account];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c 
									WHERE Patient__c IN :accounts ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = Date.today();
		}							 
		update programs;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);
		Test.stopTest();
		System.assertEquals(10, [SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'green']);
	}

	@isTest
	static void testOrangeLevelOne(){
		Test.startTest();
		List<Account> accounts = [SELECT Id,Most_Recent_Consent_Date__c
								FROM Account ];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, Consent__c
						FROM Patient_Program__c ];
		
		for(Account patient : accounts){
			patient.Most_Recent_Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}
		for(Patient_Program__c program : programs){
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent__c = true;
		}				
		
		update accounts;
		update programs;

		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10, [SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'orange']);
	}

	

	@isTest
	static void testGreenLevelThree(){
		Test.startTest();
		List<Account> accounts = [SELECT Id, Completed_Baseline_Survey__c
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
	
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = null;
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}
		update requests;
		update collectionData;
		update programs; 
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'green']);
 
	}

	@isTest
	static void testGreenLevelFour(){
		Test.startTest();
		List<Account> accounts = [SELECT Id, Completed_Baseline_Survey__c
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
	
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = Date.today();
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}
		update requests;
		update collectionData;
		update programs; 
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'green']);
 
	}

	@isTest 
	static void testYellowLevelFour(){
		Test.startTest();
		List<Account> accounts = [SELECT Id, Completed_Baseline_Survey__c
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
	
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-7);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = Date.today();
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-5);
		}
		update requests;
		update collectionData;
		update programs; 
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'yellow']);
	}

	@isTest
	static void testOrangeLevelFour(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-15);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = Date.today();
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
		}

		update requests;
		update collectionData;
		update programs; 
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'orange']);
	
	}

	@isTest
	static void testRedLevelFour(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c =  CategorizePatientColor.addBusinessDays(Date.today(),-110);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-100);
		}

		update requests;
		update collectionData;
		update programs; 
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'red']);
 
	
	}

	@isTest
	static void testGreenLevelFive(){
	Test.startTest();
		List<Account> accounts = [SELECT Id
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c FROM Appointment__c ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-1);
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}
		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'green']);
 	
	}

		@isTest
	static void testRedLevelFive(){
	Test.startTest();
		List<Account> accounts = [SELECT Id
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c FROM Appointment__c ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-20);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-10);
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}
		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'red']);
 	
	}

	@isTest
	static void testYellowLevelFive(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c FROM Appointment__c ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-6);
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-5);
		}
		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'yellow']);
		
	}

	@isTest
	static void testGreenLevelSix(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c FROM Appointment__c ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-1);
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}
		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'scheduled';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),1);
			appointment.Completed_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),2);
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'green']);
 		
	}

	@isTest
	static void testOrangeLevelSix(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c FROM Appointment__c ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-1);
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}
		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'scheduled';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),1);
			appointment.Completed_Date__c = null;
			appointment.Draw_Type__c = 'baseline';

		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'orange']);
 		
	}

	@isTest
	static void testGreenLevelSeven(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
						FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
						FROM Request__c ];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' ];
		List<Collection_Data__c> collectionBData = [SELECT DOD_Survey_Completion_Date__c 
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection B'];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
						Consent__c, Consent_Date__c
						FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c,Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c
						FROM Appointment__c ];
		
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-1);
		}

		for(Collection_Data__c collectionDatum : collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}

		for(Collection_Data__c collectionBDatum : collectionBData){
			collectionBDatum.DOD_Survey_Completion_Date__c = Date.today();
		}

		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'partial draw';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),1);
			appointment.Completed_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),1);
			appointment.Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c = Date.today();
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		update collectionBData;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'green']);
 		
	}
	@isTest
	static void testYellowLevelSeven(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
						FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
						FROM Request__c ];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' ];
		List<Collection_Data__c> collectionBData = [SELECT DOD_Survey_Completion_Date__c 
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection B'];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
						Consent__c, Consent_Date__c
						FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c,Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c
						FROM Appointment__c ];
		
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-1);
		}

		for(Collection_Data__c collectionDatum : collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-1);
		}

		for(Collection_Data__c collectionBDatum : collectionBData){
			collectionBDatum.DOD_Survey_Completion_Date__c = null;
		}

		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'partial draw';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-1);
			appointment.Completed_Date__c = Date.today();
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		update collectionBData;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'yellow']);
 		
	}

	@isTest
	static void testOrangeLevelSeven(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
						FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
						FROM Request__c ];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' ];
		List<Collection_Data__c> collectionBData = [SELECT DOD_Survey_Completion_Date__c 
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection B'];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
						Consent__c, Consent_Date__c
						FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c,Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c
						FROM Appointment__c ];
		
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-1);
		}

		for(Collection_Data__c collectionDatum : collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}

		for(Collection_Data__c collectionBDatum : collectionBData){
			collectionBDatum.DOD_Survey_Completion_Date__c = null;
		}

		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'partial draw';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
			appointment.Completed_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		update collectionBData;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'orange']);
 		
	}

	@isTest
	static void testOrangeLevelSevenPartialDrawInsufficient(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
						FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
						FROM Request__c ];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' ];
		List<Collection_Data__c> collectionBData = [SELECT DOD_Survey_Completion_Date__c 
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection B'];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
						Consent__c, Consent_Date__c
						FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c,Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c
						FROM Appointment__c ];
		
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-1);
		}

		for(Collection_Data__c collectionDatum : collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}

		for(Collection_Data__c collectionBDatum : collectionBData){
			collectionBDatum.DOD_Survey_Completion_Date__c = null;
		}

		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'partial draw insufficient';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
			appointment.Completed_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		update collectionBData;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'orange']);
	}

	@isTest
	static void testOrangeLevelSevenPartialDrawInsufficientAndTenDaysFromResent(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
						FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c, Patient__c
						FROM Request__c ];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' ];
		List<Collection_Data__c> collectionBData = [SELECT DOD_Survey_Completion_Date__c 
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection B'];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
						Consent__c, Consent_Date__c
						FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c,Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c
						FROM Appointment__c ];
		List<Appointment__c> resendAppointments = new List<Appointment__c>();
		
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	


		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(), -10);
			request.Number_of_Request_Attempts__c = 1; 
			resendAppointments.add(new Appointment__c(
							Patient__c = request.Patient__c,
							Status__c='', 	
							Scheduled_Date__c=null, 
							Completed_Date__c=null,
							Request__c = request.Id
							));
		}

		update requests;

		for(Collection_Data__c collectionDatum : collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}

		for(Collection_Data__c collectionBDatum : collectionBData){
			collectionBDatum.DOD_Survey_Completion_Date__c = null;
		}

		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'Partial Draw Insufficient';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
			appointment.Completed_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
		}
		update collectionData;
		update programs; 
		update appointments;
		update collectionBData;
		insert resendAppointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'orange']);
	}

	@isTest
	static void testRedLevelSevenRefusedDraw(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
						FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
						FROM Request__c ];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' ];
		List<Collection_Data__c> collectionBData = [SELECT DOD_Survey_Completion_Date__c 
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection B'];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
						Consent__c, Consent_Date__c
						FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c,Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c
						FROM Appointment__c ];
		
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	

		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-1);

		}

		for(Collection_Data__c collectionDatum : collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}

		for(Collection_Data__c collectionBDatum : collectionBData){
			collectionBDatum.DOD_Survey_Completion_Date__c = null;
		}

		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'Refused Draw';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
			appointment.Completed_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		update collectionBData;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'red']);
 		
	}

	@isTest
		static void testRedLevelSevenSendBackToEMSI(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
						FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c, Patient__c
						FROM Request__c ];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' ];
		List<Collection_Data__c> collectionBData = [SELECT DOD_Survey_Completion_Date__c 
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection B'];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
						Consent__c, Consent_Date__c
						FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c,Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c
						FROM Appointment__c ];

		List<Appointment__c> resendAppointments = new List<Appointment__c>();
		
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(), -90);
			request.Number_of_Request_Attempts__c = 1; 
			resendAppointments.add(new Appointment__c(
							Patient__c = request.Patient__c,
							Status__c='', 	
							Scheduled_Date__c=null, 
							Completed_Date__c=null,
							Request__c = request.Id
							));
		}

		for(Collection_Data__c collectionDatum : collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}

		for(Collection_Data__c collectionBDatum : collectionBData){
			collectionBDatum.DOD_Survey_Completion_Date__c = null;
		}

		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = ' ';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
			appointment.Completed_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		update collectionBData;
		insert resendAppointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Stage__c LIKE 'First Draw Occurred']);
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'red'],[SELECT Adherence_Status__c FROM Account LIMIT 1].Adherence_Status__c);
	}

	@isTest
	static void testOrangeLevelSevenSendBackToEMSI(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
						FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c, Patient__c
						FROM Request__c ];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' ];
		List<Collection_Data__c> collectionBData = [SELECT DOD_Survey_Completion_Date__c 
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection B'];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
						Consent__c, Consent_Date__c
						FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c,Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c
						FROM Appointment__c ];

		List<Appointment__c> resendAppointments = new List<Appointment__c>();
		
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(), -8);
			request.Number_of_Request_Attempts__c = 1; 
			resendAppointments.add(new Appointment__c(
							Patient__c = request.Patient__c,
							Status__c='', 	
							Scheduled_Date__c=null, 
							Completed_Date__c=null,
							Request__c = request.Id
							));
		}

		for(Collection_Data__c collectionDatum : collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}

		for(Collection_Data__c collectionBDatum : collectionBData){
			collectionBDatum.DOD_Survey_Completion_Date__c = null;
		}

		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'Partial Draw Insufficient';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
			appointment.Completed_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		update collectionBData;
		insert resendAppointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10,[SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'orange']);
 		
	}

	@isTest
	static void testStageOne(){	
		Test.startTest();
		List<Account> accounts = [SELECT Id FROM Account];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c 
									WHERE Patient__c IN :accounts ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = Date.today();
		}							 
		update programs;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);
		Test.stopTest();
		System.assertEquals(10, [SELECT count() FROM Account WHERE Adherence_Stage__c LIKE 'Consented to Survey A Complete']);
	}

	@isTest
	static void testStageTwo(){
		Test.startTest();
		List<Account> accounts = [SELECT Id FROM Account];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c 
									WHERE Patient__c IN :accounts ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = Date.today();
		}							 
		update programs;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);
		Test.stopTest();
		System.assertEquals(10, [SELECT count() FROM Account WHERE Adherence_Stage__c LIKE 'Consented to Survey A Complete']);

	}


	@isTest
	static void testStageTwoSurveyA(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c FROM Appointment__c ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-20);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = null;
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}
		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = null;
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10, [SELECT count() FROM Account WHERE Adherence_Stage__c LIKE 'Completed Survey A but not yet sent to EMSI']);
 
	}

	@isTest
	static void testStageThree(){
	Test.startTest();
		List<Account> accounts = [SELECT Id
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c FROM Appointment__c ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-20);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-10);
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}
		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10, [SELECT count() FROM Account WHERE Adherence_Stage__c LIKE 'Time sent for Request to EMSI to Time Initial Contact Made by EMSI']);
 
 	
	}

	@isTest
	static void testStageFour(){
		Test.startTest();
		List<Account> accounts = [SELECT Id,Adherence_Stage__c
								FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
								FROM Request__c 
								WHERE Patient__c IN :accounts];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' 
						AND Patient__c = :accounts];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
									Consent__c, Consent_Date__c
									FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c FROM Appointment__c ];
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-1);
		}

		for(Collection_Data__c collectionDatum: collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}
		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'scheduled';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),1);
			appointment.Completed_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
			appointment.Draw_Type__c = 'baseline'; 
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10, [SELECT count() FROM Account WHERE Adherence_Stage__c LIKE 'First Draw Scheduled'], 'actual:'+accounts.get(0).Adherence_Stage__c);
		System.assertEquals(10, [SELECT count() FROM Account WHERE Adherence_Status__c LIKE 'green']);

	}

	@isTest
	static void testStageFive(){
		Test.startTest();
		List<Account> accounts = [SELECT Id
						FROM Account ];
		List<Request__c> requests = [Select Id, Sent_Date__c
						FROM Request__c ];
		List<Collection_Data__c> collectionData = [SELECT Baseline_Survey_Completion_Date__c
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection A' ];
		List<Collection_Data__c> collectionBData = [SELECT DOD_Survey_Completion_Date__c 
						FROM Collection_Data__c WHERE RecordType.Name = 'Collection B'];
		List<Patient_Program__c> programs = [SELECT Did_Patient_Withdraw__c, 
						Consent__c, Consent_Date__c
						FROM Patient_Program__c ];
		List<Appointment__c> appointments = [SELECT First_Contacted__c,Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c
						FROM Appointment__c ];
		
		for(Patient_Program__c program : programs){
			program.Consent__c = true;
			program.Did_Patient_Withdraw__c = 'no';
			program.Consent_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}	
		for(Request__c request : requests){
			request.Sent_Date__c  = CategorizePatientColor.addBusinessDays(Date.today(),-1);
		}

		for(Collection_Data__c collectionDatum : collectionData){
			collectionDatum.Baseline_Survey_Completion_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-2);
		}

		for(Collection_Data__c collectionBDatum : collectionBData){
			collectionBDatum.DOD_Survey_Completion_Date__c = null;
		}

		for(Appointment__c appointment : appointments){
			appointment.First_Contacted__c = Date.today();
			appointment.Status__c = 'partial draw';
			appointment.Scheduled_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
			appointment.Completed_Date__c = CategorizePatientColor.addBusinessDays(Date.today(),-9);
		}
		update requests;
		update collectionData;
		update programs; 
		update appointments;
		update collectionBData;
		CategorizePatientColor CPC = new CategorizePatientColor();
		Id batchID = Database.executeBatch(CPC);

		Test.stopTest();
		System.assertEquals(10, [SELECT count() FROM Account WHERE Adherence_Stage__c LIKE 'First Draw Occurred']);
	}

	@isTest
		static void testSchedule(){
			Test.startTest();
			ScheduledAdherenceColorCategorization SACC = new ScheduledAdherenceColorCategorization();
			//runs at midnight each night
			String sch = '0 0 0 * * ?';
			System.schedule('Test CategorizePatientColor schedule', sch, SACC);
			Test.stopTest();
		}




}