global class ScheduledAdherenceColorCategorization implements Schedulable {
	global void execute(SchedulableContext sc) {
		CategorizePatientColor CPC = new CategorizePatientColor();
		//running with a batch size of 100
		database.executebatch(CPC,100);
	}
}