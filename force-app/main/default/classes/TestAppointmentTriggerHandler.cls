@isTest
private class TestAppointmentTriggerHandler {

    @isTest
    static void testTrigger() {
        Account a  = new Account();
        a.FirstName = 'Test';
        a.LastName = 'Account';
        a.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Patient').getRecordTypeId();
        insert a;

        Request__c r = new Request__c();
        r.Patient__c = a.Id;
        insert r;

        List<Appointment__c> apps = new List<Appointment__c>();
        Appointment__c app1 = new Appointment__c(
            Scheduling_Status__c = 'Cancelled', Scheduling_Disposition__c = 'Per Client', Patient__c = a.Id, Request__c = r.Id);
        apps.add(app1);
        
        Appointment__c app2 = new Appointment__c(
            Scheduling_Status__c = 'Cancelled', Scheduling_Disposition__c = 'Per emsi', Patient__c = a.Id);
        apps.add(app2);
        
        Appointment__c app3 = new Appointment__c(
            Scheduling_Status__c = 'Cancelled', Scheduling_Disposition__c = 'Per subject', Patient__c = a.Id);
        apps.add(app3);

        Appointment__c app4 = new Appointment__c(
            Scheduling_Status__c = 'Completed', Scheduling_Disposition__c = 'Cancelled', Patient__c = a.Id);
        apps.add(app4);

        Appointment__c app5 = new Appointment__c( 
            Scheduling_Status__c = 'Completed', Scheduling_Disposition__c = 'Completed', Patient__c = a.Id);
        apps.add(app5);

        Appointment__c app6 = new Appointment__c(
            Scheduling_Status__c = 'Completed', Scheduling_Disposition__c = 'No Show', Patient__c = a.Id);
        apps.add(app6);

        Appointment__c app7 = new Appointment__c(
            Scheduling_Status__c = 'Completed', Scheduling_Disposition__c = 'Unable', Patient__c = a.Id);
        apps.add(app7);

        Appointment__c app8 = new Appointment__c(
            Scheduling_Status__c = 'Completed', Scheduling_Disposition__c = 'Refusal', Patient__c = a.Id);
        apps.add(app8);

        Appointment__c app9 = new Appointment__c( 
            Scheduling_Status__c = 'Completed', Scheduling_Disposition__c = 'Partial Draw', Patient__c = a.Id);
        apps.add(app9);

        Appointment__c app10 = new Appointment__c(
            Scheduling_Status__c = 'Completed', Scheduling_Disposition__c = 'Image Uploaded', Patient__c = a.Id);
        apps.add(app10);

        Appointment__c app11 = new Appointment__c(
            Scheduling_Status__c = 'Completed', Scheduling_Disposition__c = 'meh', Patient__c = a.Id);
        apps.add(app11);

        Appointment__c app12 = new Appointment__c(
            Scheduling_Status__c = 'No Show Donor', Scheduling_Disposition__c = 'Cancelled', Patient__c = a.Id);
        apps.add(app12);

        Appointment__c app13 = new Appointment__c(
            Scheduling_Status__c = 'No Show Examiner', Scheduling_Disposition__c = 'Cancelled', Patient__c = a.Id);
        apps.add(app13);

        Appointment__c app14 = new Appointment__c(
            Scheduling_Status__c = 'In Progress', Scheduling_Disposition__c = 'meh', Patient__c = a.Id);
        apps.add(app14);

        Appointment__c app15 = new Appointment__c(
            Scheduling_Status__c = 'Pending', Scheduling_Disposition__c = 'Branch', Patient__c = a.Id);
        apps.add(app15);

        Appointment__c app16 = new Appointment__c(
            Scheduling_Status__c = 'Pending', Scheduling_Disposition__c = 'No Coverage', Patient__c = a.Id);
        apps.add(app16);

        Appointment__c app17 = new Appointment__c(
            Scheduling_Status__c = 'Pending', Scheduling_Disposition__c = 'Client Info', Patient__c = a.Id);
        apps.add(app17);

        Appointment__c app18 = new Appointment__c(
            Scheduling_Status__c = 'Pending', Scheduling_Disposition__c = 'meh', Patient__c = a.Id);
        apps.add(app18);

        Appointment__c app19 = new Appointment__c(
            Scheduling_Status__c = 'Scheduled-Branch', Scheduling_Disposition__c = 'Confirmed', Patient__c = a.Id);
        apps.add(app19);

        Appointment__c app20 = new Appointment__c(
            Scheduling_Status__c = 'Scheduled-examiner', Scheduling_Disposition__c = 'Out of Range', Patient__c = a.Id);
        apps.add(app20);

        Appointment__c app21 = new Appointment__c(
            Scheduling_Status__c = 'Scheduled-examiner', Scheduling_Disposition__c = 'Confirmed', Patient__c = a.Id);
        apps.add(app21);

        Appointment__c app22 = new Appointment__c(
            Scheduling_Status__c = 'Turn Over', Scheduling_Disposition__c = 'Bad Contact Info', Patient__c = a.Id);
        apps.add(app22);

        Appointment__c app23 = new Appointment__c(
            Scheduling_Status__c = 'Turn Over', Scheduling_Disposition__c = 'Never Started', Patient__c = a.Id);
        apps.add(app23);

        Appointment__c app24 = new Appointment__c( 
            Scheduling_Status__c = 'Turn Over', Scheduling_Disposition__c = 'No Coverage', Patient__c = a.Id);
        apps.add(app24);

        Appointment__c app25 = new Appointment__c(
            Scheduling_Status__c = 'Turn Over', Scheduling_Disposition__c = 'Refusal', Patient__c = a.Id);
        apps.add(app25);

        Appointment__c app26 = new Appointment__c(
            Scheduling_Status__c = 'Turn Over', Scheduling_Disposition__c = 'meh', Patient__c = a.Id);
        apps.add(app26);

        Test.startTest();

        insert apps;

        Test.stopTest();

        Map<Id, Appointment__c> appResults = new Map<Id, Appointment__c>([SELECT Id, Status__c FROM Appointment__c]);

        System.assertEquals('Cancelled By PLM', appResults.get(app1.Id).Status__c);
        System.assertEquals('Cancelled By Vendor', appResults.get(app2.Id).Status__c);
        System.assertEquals('Cancelled By Patient', appResults.get(app3.Id).Status__c);
        System.assertEquals('Cancelled By Patient (Billed)', appResults.get(app4.Id).Status__c);
        System.assertEquals('Completed', appResults.get(app5.Id).Status__c);
        System.assertEquals('Patient No Show (Billed)', appResults.get(app6.Id).Status__c);
        System.assertEquals('Unable To Draw', appResults.get(app7.Id).Status__c);
        System.assertEquals('Refused Draw', appResults.get(app8.Id).Status__c);
        System.assertEquals('Partial Draw', appResults.get(app9.Id).Status__c);
        System.assertEquals(null, appResults.get(app10.Id).Status__c);
        System.assertEquals('Examiner No Show', appResults.get(app11.Id).Status__c);
        System.assertEquals('Patient No Show', appResults.get(app12.Id).Status__c);
        System.assertEquals('Examiner No Show', appResults.get(app13.Id).Status__c);
        System.assertEquals('Scheduling In Progress', appResults.get(app14.Id).Status__c);
        System.assertEquals('Scheduling In Progress (Branch)', appResults.get(app15.Id).Status__c);
        System.assertEquals('Scheduling In Progress (Coverage)', appResults.get(app16.Id).Status__c);
        System.assertEquals(null, appResults.get(app17.Id).Status__c);
        System.assertEquals('Scheduling In Progress', appResults.get(app18.Id).Status__c);
        System.assertEquals('Scheduling In Progress', appResults.get(app19.Id).Status__c);
        System.assertEquals('Scheduling In Progress', appResults.get(app20.Id).Status__c);
        System.assertEquals('Scheduled', appResults.get(app21.Id).Status__c);
        System.assertEquals('Turnover (Bad Contact Info)', appResults.get(app22.Id).Status__c);
        System.assertEquals('Turnover (Never Started)', appResults.get(app23.Id).Status__c);
        System.assertEquals('Turnover (No Coverage)', appResults.get(app24.Id).Status__c);
        System.assertEquals('Turnover (Patient Refused)', appResults.get(app25.Id).Status__c);
        System.assertEquals('Turnover', appResults.get(app26.Id).Status__c);
    }
}