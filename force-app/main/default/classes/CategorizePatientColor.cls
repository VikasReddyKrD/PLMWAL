//Below is a summarized table for patient adherence.  Each 'tier' refers to the different stages patients move through
//as they complete the process.
// +------------------------+------------------------------+------------------------------+---------------------------------+------------------------------+
// |          Tier          |           Green              | Yellow                       |        Orange                   |     Red                      |
// +------------------------+------------------------------+------------------------------+---------------------------------+------------------------------+
// | consentedToSurveyA()   | consented online today       | N/A                          | consented & haven't done        | Withdrawn                    |   
// |                        |                              |                              |  surveyA in <5 days from Consent|                              | 
// |                        |                        	   |  							  |                                 |                              |
// | surveyASentToEMSI()    | within 2 days of completing  | Within 3-5 days of           | within 5-45 days of             | 45 days from completing      |
// |                        | 	Survey A                   |   completing survey A        |   completing survey A           | 	survey A or withdrawn      |
// |                        |                        	   |  							  |                                 |                              |
// | initialContactByEMSI() | Initial contact made 0-4     | Initial contact made         | N/A                             | 7+ days OR refused draw      |  
// |                        |   days ago     	           |	5-6 days ago              |                                 |  OR withdrawn                |
// |                        |                        	   |  							  |                                 |                              |
// | firstDrawScheduled()   | first draw scheduled&        | N/A                          | first draw scheduled            | withdrawn                    |  
// |                        |completed date have not passed|                              |   but not complete (no-show)    |                              |   
// |                        |                        	   |  							  |                                 |                              |
// | appointmentHappened()  | blood successfully drawn     | blood successfully drawn	  | blood successfully drawn        | 45 days from being sent back |    
// |                        |    & survey b complete  	   |   with 24 hours AND 		  |   over 24 hours ago AND         |   to EMSI OR refused draw    |
// |                        |                        	   |   incomplete survey B/		  |   incomplete survey B OR        |   OR withdrawn               | 
// |                        |                        	   |   treatment history		  |   blood draw insufficient       |                              |
// |                        |                        	   |   							  |   AND sent back to EMSI         |                              |
// |                        |                        	   |  							  |   over 7 days ago               |                              |
// +------------------------+------------------------------+-----------------------------------------------------------------------------------------------+

global class CategorizePatientColor implements Database.Batchable<sObject> {
	
	List<Id> patientIds;  
	
	static final List<String> COLOR_OPTIONS= new List<String> {'red','yellow','orange','green','unset'};
	static final Map<Integer, String> ADHERENCE_LEVEL = new Map<Integer, String> {
										1=>'Consented to Survey A Complete',
										7=>'Completed Survey A but not yet sent to EMSI',
										2=>'Survey A Complete to Time sent on EMSI Request',
										3=>'Time sent for Request to EMSI to Time Initial Contact Made by EMSI',
										4=>'First Draw Scheduled',
										5=>'First Draw Occurred'};
	static final Id collectionA = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection A').getRecordTypeId();
	static final Id collectionB = Schema.SObjectType.Collection_Data__c.getRecordTypeInfosByName().get('Collection B').getRecordTypeId();
	static final String event = 'Event';
	global Integer accountColorsChanged = 0; 
		
	String query = 'SELECT Id, Completed_Baseline_Survey__c, FirstName, LastName, Consent__c, Date_Withdrawn__c, Adherence_Status__c, Most_Recent_Consent_Date__c, Adherence_Stage__c,'+
			'(SELECT Id, Consent_Date__c, Consent__c, Did_Patient_Withdraw__c FROM Patient_Programs__r ORDER BY Consent_Date__c ASC NULLS LAST LIMIT 1),'+
			'(SELECT Baseline_Survey_Completion_Date__c, Baseline_Survey_Status__c, DOD_Survey_Completion_Date__c, RecordType.Name, Status__c, Completed__c ' +
			'FROM Collection_Data__r WHERE RecordTypeId = \''+collectionA+'\' OR RecordTypeId= \''+collectionB+'\' ORDER BY CreatedDate DESC NULLS LAST),'+
			'(SELECT Scheduled__c,Scheduled_Date__c, Status__c, Completed__c, Completed_Date__c, Date2__c, '+
			'Patient__c, Lookup_To_Collection_B__r.Completed__c,Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c,Request__r.Sent_Date__c, '+
			'Request__r.Number_of_Request_Attempts__c,First_Contacted__c, Draw_Type__c, Completed_Baseline_Draw__c, CreatedDate FROM Appointment_Data__r ORDER BY CreatedDate ASC NULLS LAST)'+
			'FROM Account WHERE (NOT DigitalMe_Origin__c LIKE \''+event+'\')';
			//+'WHERE Most_Recent_Consent_Date__c >= LAST_N_DAYS:90';
			//get the oldest survey to set the collection b data
	
	global Database.QueryLocator start(Database.BatchableContext BC) {
		return Database.getQueryLocator(query);
	}

 	global void execute(Database.BatchableContext BC, List<Account> scope) {
   		List<PatientResult> patients; 
		for(Account patientAccount : scope){
			PatientResult wrappedPatient = new PatientResult(patientAccount);
			//if a patient is valid for adherence analysis, then get its color and set it on
			//the Adherence_Status__c field of Account.
			if(wrappedPatient.isValid){
				wrappedPatient.color = analyzeColor(wrappedPatient);
				System.debug('ASSIGNED COLOR - '+wrappedPatient.color +' ASSIGNED STAGE - '+ wrappedPatient.stage);
				System.debug(wrappedPatient);
			}
			patientAccount.Adherence_Status__c = wrappedPatient.color; 
			patientAccount.Adherence_Stage__c = wrappedPatient.stage; 
		}
		update scope; 

	}
	
	global void finish(Database.BatchableContext BC) {
        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors, 
            JobItemsProcessed,
            TotalJobItems, CreatedBy.Email
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()];
        System.debug(job.JobItemsProcessed +' records processed.');
	}



global class PatientResult{
		public Date consentDate {get;set;}
		public Date baselineSurveyCompletionDate  = null;
		public String baselineSurveyStatus;
		public Boolean surveyACompleted; 
		public Boolean surveyBCompleted;
		public Date surveyBCompletedDate;
		public Date EMSIrequestSentDate;
		public Date firstDrawScheduledDate;
		public Date firstDrawCompletedDate;
		public Boolean firstDrawCompleted;
		public Boolean firstDrawScheduled;
		public Boolean completedBaselineDraw;
		public String drawType;
		public String firstName;
		public String lastName;
		public String appointmentStatus;
		public String color = null;
		public String stage = null; 
		public Boolean consentWithdrawn;
		public Boolean isValid = false; 
		public Boolean isResend = false;
		public Date resentToEMSIDate;
		public Date EMSIInitialContactDate;
		public List<Collection_Data__c> collectionA = new List<Collection_Data__c>();
		public List<Collection_Data__c> collectionB = new List<Collection_Data__c>();

		global PatientResult(Account patient){

			this.consentDate = patient.Most_Recent_Consent_Date__c;
			this.consentWithdrawn =  patient.Date_Withdrawn__c != null ? true : false ;	
			//this field is a roll up of collection data A.  if greater than one, a survey has been completed.Å
			this.surveyACompleted = patient.Completed_Baseline_Survey__c > 0 ? true :false;

			//when the list of Appointments is greater than one, it is considered a 'resent' request.
			//only when it is considered resent do we want to set the related values
			if(patient.Appointment_Data__r.size() >0){
				if(patient.Appointment_Data__r.size()>1){
					this.isResend = true;
				}
					this.resentToEMSIDate = patient.Appointment_Data__r.get(0).Request__r.Sent_Date__c;
			}


			if(patient.Collection_Data__r.size() > 0){

				for (Collection_Data__c collectionData : patient.collection_Data__r){
					//because the lists are sorted via soql, adding them to a list like this keeps them sorted.
					if(collectionData.RecordType.Name=='Collection A'){
						collectionA.add(collectionData);
					}
					else{
						collectionB.add(collectionData);
					}
				}
				//this.surveyACompleted = patient.Collection_Data__r.get(0).Completed__c;
				if(collectionA.size()>0){
					this.baselineSurveyCompletionDate = collectionA.get(0).Baseline_Survey_Completion_Date__c;
					this.baselineSurveyStatus = collectionA.get(0).Baseline_Survey_Status__c;
				}
				if(collectionB.size()>0){
					this.surveyBCompletedDate = collectionB.get(0).DOD_Survey_Completion_Date__c;
				}

			}
			if(patient.Appointment_Data__r.size() > 0){
				this.appointmentStatus = patient.Appointment_Data__r.get(0).Status__c;
				this.firstDrawScheduledDate = patient.Appointment_Data__r.get(0).Scheduled_Date__c;
				this.firstDrawScheduled = patient.Appointment_Data__r.get(0).Scheduled__c;
				this.firstDrawCompletedDate = patient.Appointment_Data__r.get(0).Completed_Date__c;
				this.firstDrawCompleted = patient.Appointment_Data__r.get(0).Completed__c;
				this.drawType = patient.Appointment_Data__r.get(0).Draw_Type__c;
				this.completedBaselineDraw = patient.Appointment_Data__r.get(0).Completed_Baseline_Draw__c;
				//this.surveyBCompletedDate =patient.Appointment_Data__r.get(0).Lookup_To_Collection_B__r.DOD_Survey_Completion_Date__c;
				//this.surveyBCompleted = patient.Appointment_Data__r.get(0).Lookup_To_Collection_B__r.Completed__c;	
				this.surveyBCompleted = this.surveyBCompletedDate!=null ? true : false ;
				this.EMSIrequestSentDate = patient.Appointment_Data__r.get(0).Request__r.Sent_Date__c; 
				this.EMSIInitialContactDate = patient.Appointment_Data__r.get(0).First_Contacted__c;
			}
			this.firstName = patient.firstName;
			this.lastName = patient.lastName;
			this.isValid = isValid(this.consentDate);
		}

		global Boolean isValid(Date dateOfConsent){
			//sets a flag on each object to see if it is valid for adherence interpretation.
			//withdrawn is sometimes null even if a consented date exists, so just check for 
			//a date of consent, withdrawn is used later. 
			if(dateOfConsent!=null){
				return true; 
			}
			else{
				return false; 
			}

		}
	}

	global string analyzeColor(PatientResult patient){
		//each of these steps has a fallthrough (Except the first) so 
		//that if it doesn't apply to the record, it is skipped and no color is set. 
		consentedToSurveyA(patient);
		surveyACompleteButNotYetSentToEMSI(patient);
		surveyASentToEMSI(patient);
		initialContactByEMSI(patient);
		firstDrawScheduled(patient);
		appointmentHappened(patient);

		return patient.color;
	}

	global void consentedToSurveyA(PatientResult patient){
		//if the patient has not withdrawn consent, then categorize their color
		//color is categorized based on when they have completed the baseline survey/when they consented.
		//options are green, orange, and red. no yellow on this teir
		Integer daysBetweenTodayAndConsent = countBusinessDaysBetween(Date.today(),patient.consentDate);
		if(patient.consentWithdrawn==false){ 
			//if they consented today, then green
			if(patient.consentDate == Date.today()){
				patient.color = 'green'; 
				patient.stage = ADHERENCE_LEVEL.get(1);
			}
			//if it has been up to five days since consent. 
			else if(daysBetweenTodayAndConsent>=1&&daysBetweenTodayAndConsent<5){
					patient.color = 'orange';
					patient.stage = ADHERENCE_LEVEL.get(1);
				}
			else if(daysBetweenTodayAndConsent>=5){
					patient.color = 'red';
					patient.stage = ADHERENCE_LEVEL.get(1);
				}
			}
			//if they have withdrawn, the color is red. 
		else{ 
			patient.color = 'red';
			patient.stage = ADHERENCE_LEVEL.get(1);
		}
	}
	
	global void surveyACompleteButNotYetSentToEMSI(PatientResult patient){
		//if a patient completed survey A but it has not yet been sent to EMSI 
		Integer daysPassed = countBusinessDaysBetween(patient.baselineSurveyCompletionDate,Date.today());
		if(patient.surveyACompleted){
			if(patient.EMSIrequestSentDate==null){
				if(!patient.consentWithdrawn){
					if(daysPassed<=2){
							patient.color='green';
							patient.stage = ADHERENCE_LEVEL.get(7);
						}
						else if(daysPassed>2 && daysPassed<=5){
							patient.color = 'yellow';
							patient.stage = ADHERENCE_LEVEL.get(7);
						}
						else if(daysPassed>5 && daysPassed<=45){
							patient.color='orange';
							patient.stage = ADHERENCE_LEVEL.get(7);
						}
						else if(daysPassed>45){
							patient.color='red';
							patient.stage = ADHERENCE_LEVEL.get(7);
						}
				}
				else{
					patient.color='red';
					patient.stage = ADHERENCE_LEVEL.get(7);
				}
			}
		}
	}

	global void surveyASentToEMSI(PatientResult patient){
		//System.debug('Inside of surveyASentToEMSI with:'+patient);
		if(patient.EMSIrequestSentDate!=null && patient.baselineSurveyCompletionDate!=null){
			Integer daysBetween = countBusinessDaysBetween(patient.baselineSurveyCompletionDate,patient.EMSIrequestSentDate);
			//System.debug('days between:'+daysBetween);
			//if survey A has been completed and the patient has not withdrawn, then proceed with assigning them a color
			//based on the time between their survey completed, and the EMSI request being sent. 
			//if surveyA has not been completed, a color won't be assigned. 
			if(patient.surveyACompleted&&!patient.consentWithdrawn){
				if(daysBetween<=2){
					patient.color='green';
				}
				else if(daysBetween>2 && daysBetween<=5){
					patient.color = 'yellow';
				}
				else if(daysBetween>5 && daysBetween<=45){
					patient.color='orange';
				}
				else if(daysBetween>45){
					patient.color='red';
				}
				else{
					System.debug(' - Inside of surveyASentToEMSI with improper date range - '+ daysBetween);
				}

				patient.stage = ADHERENCE_LEVEL.get(2);
			}
	}
	
	}

	global void initialContactByEMSI(PatientResult patient){
		System.debug('inside initial contact'+patient.EMSIInitialContactDate + 'sent:'+patient.EMSIrequestSentDate);
		if(patient.EMSIInitialContactDate!=null){
			Integer daysBetween = countBusinessDaysBetween(patient.EMSIrequestSentDate, patient.EMSIInitialContactDate);
			//System.debug( daysBetween + 'days between : '+patient.EMSIrequestSentDate + 'and' + patient.EMSIInitialContactDate);
			if(daysBetween<=4){ 
				patient.color = 'green'; 
				patient.stage = ADHERENCE_LEVEL.get(3);
			}
			else if(daysBetween>4&&daysBetween<=6){
				patient.color = 'yellow';
				patient.stage = ADHERENCE_LEVEL.get(3);
			}
			else if(daysBetween>=7){
				patient.color = 'red'; 
				patient.stage = ADHERENCE_LEVEL.get(3);
			}
			else{
				System.debug('Inside of initialContactByEMSI with improper date range - '+ daysBetween);
			}

		}
	}

	global void firstDrawScheduled(PatientResult patient){
		if(!patient.consentWithdrawn){
		if(patient.appointmentStatus=='scheduled'&&patient.drawType=='baseline'){
			if(patient.firstDrawScheduledDate!=null&&patient.firstDrawCompletedDate<Date.today()){
					patient.color = 'green';
					patient.stage = ADHERENCE_LEVEL.get(4);
				}
				else if(patient.firstDrawScheduledDate!=null&&patient.firstDrawCompletedDate==null){
					patient.color ='orange';
					patient.stage = ADHERENCE_LEVEL.get(4);
				}
		}

		}
		else{
			patient.color = 'red';
			patient.stage = ADHERENCE_LEVEL.get(4);
		}
		
	}


	//in this context, what does '45 business days from being sent back to EMSI' mean? 
	global void appointmentHappened(PatientResult patient){
		//System.debug('Inside AppointmentHappened with - '+patient);
		Date yesterday = Date.today().addDays(-1);
		if(patient.isResend){
			Integer daysSinceEMSIResent = countBusinessDaysBetween(patient.resentToEMSIDate, Date.today());
			//if it was sent more than 7 days ago AND the blood draw was insufficient, patient is orange. 
			if(daysSinceEMSIResent>=7&&daysSinceEMSIResent<45&&patient.appointmentStatus=='Partial Draw Insufficient'){
				patient.color = 'orange';
				patient.stage = ADHERENCE_LEVEL.get(5);
			}
			//if it was sent back more than 45 days ago, then it is red.
			else if(daysSinceEMSIResent>=45){
				patient.color ='red';
				patient.stage = ADHERENCE_LEVEL.get(5);
			}
		
		}
			//if the blood was successfully drawn 
			if(patient.appointmentStatus=='partial draw'||patient.appointmentStatus=='partial draw sufficient'||patient.appointmentStatus=='completed'){
				//and the patient completed survey B
				if(patient.surveyBCompleted){
					patient.color = 'green';
					patient.stage = ADHERENCE_LEVEL.get(5);
				}
				//if survey b was not completed check and see how recently the blood was drawn. 
				else{
					//if blood was drawn within 24 hours
					if(patient.firstDrawCompletedDate>=yesterday){
						patient.color = 'yellow';
						patient.stage = ADHERENCE_LEVEL.get(5);
					}
					//if blood was drawn over 24 hours ago 
					else{
						patient.color='orange';
						patient.stage = ADHERENCE_LEVEL.get(5);
					}
				}	
			}
			else if(patient.appointmentStatus=='Refused Draw'){
				patient.color = 'red';
				patient.stage = ADHERENCE_LEVEL.get(5);
			}
			else if(patient.appointmentStatus=='Partial Draw Insufficient'){
				patient.color = 'orange';
				patient.stage = ADHERENCE_LEVEL.get(5);
			}
			else {
				System.debug('inside of appointmentHappened fallthrough with improper info- surveyBCompleted:'+patient.surveyBCompleted+' appointmentStatus:'+patient.appointmentStatus);
			}

		
		//in the case it has been resent back to EMSI, see how recently it was sent back.
		
	}

	global Integer countBusinessDaysBetween(Date start, Date endingDate){
		Integer count = 0; 
		Date startDate = start;
		Date endDate = endingDate; 

		if(startDate>endDate){
			startDate = endingDate;
			endDate = start;
		}

		for(Date dt = startDate; dt<endDate; dt=dt.addDays(1)){
			Datetime tempTime = Datetime.newInstance(dt.year(), dt.month(), dt.day(), 0,0,0);
			if(tempTime.format('EEEE')!='Sunday' && tempTime.format('EEEE')!='Saturday'){
				count++; 
			}	
		}

		return count; 
	}

	//class is accessible via test class so that i can properly add business days to test the logic

	@TestVisible
	global static Date addBusinessDays(Date start, Integer days){
		//gets the date x business days after the start date. 
		//negative values get days before
		Integer count = 0; 
		Date endingDate = start;
		Integer increment = days<0 ? -1 : 1; 

		do{
				endingDate = endingDate.addDays(increment);
				Datetime tempTime = Datetime.newInstance(endingDate.year(), endingDate.month(), endingDate.day(),0,0,0);
				if(tempTime.format('EEEE')!='Sunday' && tempTime.format('EEEE')!='Saturday'){
					count = count + increment;
				}

			}while(count!=days);

		return endingDate; 	
		}
	}