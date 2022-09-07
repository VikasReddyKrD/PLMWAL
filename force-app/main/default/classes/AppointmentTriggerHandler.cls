public without sharing class AppointmentTriggerHandler {

    //----------------------//
    //-- POSSIBLE ENTRIES --//
    //----------------------//

    private static final String CANCELED = 'canceled';
    private static final String CANCELLED = 'cancelled';
    private static final String COMPLETED = 'completed';
    private static final String NO_SHOW_DONOR = 'no show donor';
    private static final String NO_SHOW_EXAMINER = 'no show examiner';
    private static final String IN_PROGRESS = 'in progress';
    private static final String PENDING = 'pending';
    private static final String SCHEDULED_BRANCH = 'scheduled-branch';
    private static final String SCHEDULED_EXAMINER = 'scheduled-examiner';
    private static final String TURN_OVER = 'turn over';
    private static final String PER_CLIENT = 'per client';
    private static final String PER_EMSI = 'per emsi';
    private static final String PER_SUBJECT = 'per subject';
    private static final String NO_SHOW = 'no show';
    private static final String UNABLE = 'unable';
    private static final String REFUSAL = 'refusal';
    private static final String PARTIAL_DRAW = 'partial draw';
    private static final String NEW_TICKET_CREATED = 'new ticket created';
    private static final String PENDING_RESCHEDULE = 'pending reschedule';
    private static final String IMAGE_UPLOADED = 'image uploaded';
    private static final String PENDING_PAPERWORK = 'pending paperwork';
    private static final String Email1 = 'email-1';
    private static final String Email2 = 'email-2';
    private static final String Email3 = 'email-3';
    private static final String Email4 = 'email-4';
    private static final String Email5 = 'email-5';
    private static final String Email6 = 'email-6';
    private static final String Email7 = 'email-7';
    private static final String Email8 = 'email-8';
    private static final String Email9 = 'email-9';
    private static final String Email10 = 'email-10';
    private static final String Email = 'email';
    private static final String INITIAL_CALL = 'initial call';
    private static final String EVENING_CALL = 'evening call';
    private static final String SATURDAY_CALL = 'saturday call';
    private static final String HOLD = 'hold';
    private static final String RESCHEDULING = 'rescheduling';
    private static final String SCHEDULING = 'scheduling';
    private static final String STATE_CHANGE = 'state change';
    private static final String STATUS_CHANGE = 'status change';
    private static final String SUBJECT_CONFIRMATION = 'subject confirmation';
    private static final String BRANCH = 'branch';
    private static final String GEOGRAPH_COVERAGE = 'geograph/coverage';
    private static final String NO_COVERAGE = 'no coverage';
    private static final String CLIENT_INFO = 'client info';
    private static final String EARLY_ACKNOWLEDGEMENT = 'early acknowledgement';
    private static final String EXAMINER_DIRECT = 'examiner direct';
    private static final String EXPENSE_APPROVAL = 'expense approval';
    private static final String CONFIRMED = 'confirmed';
    private static final String BAD_CONTACT_INFO = 'bad contact info';
    private static final String NEVER_STARTED = 'never started';
    private static final String OUT_OF_AREA = 'out of area';
    private static final String NO_RESPONSE = 'no response';
    private static final String MAX_CALLS = 'max calls';
    private static final String MAX_EMAIL_ATTEMPTS = 'max email attempts';
    private static final String PENDING_SCHEDULED_EXAMINER = 'pending scheduled examiner';
    private static final String EXAMINER_ID_INVALID = 'examiner id invalid';
    private static final String OUT_OF_RANGE = 'out of range';

    //-----------------------//
    //-- POSSIBLE STATUSES --//
    //-----------------------//

    private static final String STATUS_CANCELLED_BY_PLM = 'Cancelled By PLM';
    private static final String STATUS_CANCELLED_BY_VENDOR = 'Cancelled By Vendor';
    private static final String STATUS_CANCELLED_BY_PATIENT = 'Cancelled By Patient';
    private static final String STATUS_COMPLETED = 'Completed';
    private static final String STATUS_CANCELLED_BY_PATIENT_BILLED = 'Cancelled By Patient (Billed)';
    private static final String STATUS_PATIENT_NO_SHOW_BILLED = 'Patient No Show (Billed)';
    private static final String STATUS_EXAMINER_NO_SHOW = 'Examiner No Show';
    private static final String STATUS_UNABLE_TO_DRAW = 'Unable To Draw';
    private static final String STATUS_REFUSED_DRAW = 'Refused Draw';
    private static final String STATUS_PARTIAL_DRAW = 'Partial Draw';
    private static final String STATUS_PATIENT_NO_SHOW = 'Patient No Show';
    private static final String STATUS_SCHEDULING_IN_PROGRESS = 'Scheduling In Progress';
    private static final String STATUS_SCHEDULING_IN_PROGRESS_BRANCH = 'Scheduling In Progress (Branch)';
    private static final String STATUS_SCHEDULING_IN_PROGRESS_COVERAGE = 'Scheduling In Progress (Coverage)';
    private static final String STATUS_SCHEDULED = 'Scheduled';
    private static final String STATUS_TURNOVER_CONTACT_INFO = 'Turnover (Bad Contact Info)';
    private static final String STATUS_TURNOVER_NEVER_STARTED = 'Turnover (Never Started)';
    private static final String STATUS_TURNOVER_NO_COVERAGE = 'Turnover (No Coverage)';
    private static final String STATUS_TURNOVER = 'Turnover';
    private static final String STATUS_TURNOVER_PATIENT_REFUSED = 'Turnover (Patient Refused)';
    private static final String STATUS_PARTIAL_DRAW_INSUFFICIENT = 'Partial Draw Insufficient';
    private static final String STATUS_PARTIAL_DRAW_SUFFICIENT = 'Partial Draw Sufficient';
    

    
    public static void updateStatus(List<Appointment__c> scope) {
        for(Appointment__c a : scope) {
            if(a.Scheduling_Status__c != null && a.Scheduling_Disposition__c != null){
                String status = a.Scheduling_Status__c.toLowerCase();
                String disp = a.Scheduling_Disposition__c.toLowercase();
                if(status == CANCELLED || status == CANCELED) {
                    if(disp == PER_CLIENT) {
                        a.Status__c = STATUS_CANCELLED_BY_PLM;
                    } else if(disp == PER_EMSI) {
                        a.Status__c = STATUS_CANCELLED_BY_VENDOR;
                    } else if(disp == PER_SUBJECT) {
                        a.Status__c = STATUS_CANCELLED_BY_PATIENT;
                    }
                } else if(status == COMPLETED) {
                    if(disp == COMPLETED) {
                        a.Status__c = STATUS_COMPLETED;
                    } else if(disp == CANCELED || disp == CANCELLED) {
                        a.Status__c = STATUS_CANCELLED_BY_PATIENT_BILLED;
                    } else if(disp == NO_SHOW) {
                        a.Status__c = STATUS_PATIENT_NO_SHOW_BILLED;
                    } else if(disp == UNABLE) {
                        a.Status__c = STATUS_UNABLE_TO_DRAW;
                    } else if(disp == REFUSAL) {
                        a.Status__c = STATUS_REFUSED_DRAW;
                    } else if(disp == PARTIAL_DRAW) {
                        a.Status__c = STATUS_PARTIAL_DRAW;
                    } else if(disp == IMAGE_UPLOADED || disp == PENDING_PAPERWORK){
                        //empty apparently
                    } else {
                        a.Status__c = STATUS_EXAMINER_NO_SHOW;
                    }
                } else if(status == NO_SHOW_DONOR) {
                    if(disp == CANCELLED || disp == CANCELED || disp == NEW_TICKET_CREATED) {
                        a.Status__c = STATUS_PATIENT_NO_SHOW;
                    }
                } else if(status == NO_SHOW_EXAMINER) {
                    if(disp == CANCELED || disp == CANCELLED || disp == PENDING_RESCHEDULE) {
                        a.Status__c = STATUS_EXAMINER_NO_SHOW;
                    }
                } else if(status == IN_PROGRESS) {
                    a.Status__c = STATUS_SCHEDULING_IN_PROGRESS;
                } else if(status == PENDING) {
                    if(disp == BRANCH) {
                        a.Status__c = STATUS_SCHEDULING_IN_PROGRESS_BRANCH;
                    } else if(disp == GEOGRAPH_COVERAGE || disp == NO_COVERAGE) {
                        a.Status__c = STATUS_SCHEDULING_IN_PROGRESS_COVERAGE;
                    } else if(disp == CLIENT_INFO || disp == EARLY_ACKNOWLEDGEMENT || disp == EXAMINER_DIRECT || disp == EXPENSE_APPROVAL || disp == EXPENSE_APPROVAL) {
                        // do nothing
                    } else {
                        a.Status__c = STATUS_SCHEDULING_IN_PROGRESS;
                    }
                } else if(status == SCHEDULED_BRANCH) {
                    if(disp == CONFIRMED || disp == PENDING_SCHEDULED_EXAMINER) {
                        a.Status__c = STATUS_SCHEDULING_IN_PROGRESS;
                    }
                } else if(status == SCHEDULED_EXAMINER) {
                    if(disp == EXAMINER_ID_INVALID || disp == OUT_OF_RANGE) {
                        a.Status__c = STATUS_SCHEDULING_IN_PROGRESS;
                    } else if(disp == CONFIRMED) {
                        a.Status__c = STATUS_SCHEDULED;
                    }
                } else if(status == TURN_OVER) {
                    if(disp == BAD_CONTACT_INFO) {
                        a.Status__c = STATUS_TURNOVER_CONTACT_INFO;
                    } else if(disp == NEVER_STARTED) {
                        a.Status__c = STATUS_TURNOVER_NEVER_STARTED;
                    } else if(disp == NO_COVERAGE || disp == OUT_OF_AREA) {
                        a.Status__c = STATUS_TURNOVER_NO_COVERAGE;
                    } else if(disp == REFUSAL) {
                        a.Status__c = STATUS_TURNOVER_PATIENT_REFUSED;
                    } else {
                        a.Status__c = STATUS_TURNOVER;
                    }
                }
            }
        }
    }

    public static void updateAccounts(List<Appointment__c> scope) {
        //Metadata so that admins can change the amount of days they want to measure by without altering code
        Account_Appointment__mdt intervals = [SELECT Id, Large_Value__c, Small_Value__c FROM Account_Appointment__mdt LIMIT 1];

        List<String> accountIds = new List<String>();
        for(Appointment__c a : scope) {
            accountIds.add(a.Patient__c);
        }

        //No real reason to match accounts to related objects. Simply re-calculate all rollups and fields on each account being looked at here. 
        List<Account> accounts = [SELECT Id, 
                                    (SELECT Id, Status__c, Completed_Date__c, Scheduled_Date__c FROM Appointment_Data__r)
                                    FROM Account WHERE Id IN :accountIds];
        
        for(Account a : accounts) {
            Boolean hasOpen = false;
            Integer small = Integer.valueOf(intervals.Small_Value__c);
            Integer large = Integer.valueOf(intervals.Large_Value__c);
            Integer smallValue = 0;
            Integer largeValue = 0;
            for(Appointment__c app : a.Appointment_Data__r) {
                if(app.Status__c == 'Completed'){
                    if(app.Scheduled_Date__c > Date.today() - small) {
                        smallValue += 1;
                        largeValue += 1;
                    } else if(app.Scheduled_Date__c > Date.today() - large){
                        largeValue += 1;
                    }
                } else if(app.Status__c != 'Turnover (Bad Contact Info)' && app.Status__c != 'Turnover (Never Started)' && app.Status__c != 'Turnover (No Coverage)' && app.Status__c != 'Turnover (Patient Refused)' && 
                    app.Status__c != 'Cancelled By PLM' && app.Status__c != 'Cancelled By Vendor' && app.Status__c != 'Cancelled By Patient' && app.Status__c != 'Cancelled By Patient (Billed)' && app.Status__c != 'Examiner No Show' && 
                    app.Status__c != 'Patient No Show' && app.Status__c != 'Patient No Show (Billed)' && app.Status__c != 'Refused Draw' && app.Status__c != 'Unable to Draw' && app.Status__c != 'Completed' && app.Status__c != 'Turnover') {
                        //Only set this to true if there is an appointment that is still in a 'not closed' state
                    hasOpen = true;
                }
            }

            a.Draw_Last_15_Days__c = smallValue;
            a.Draw_Last_30_Days__c = largeValue;
            a.Open_Appointment__c = hasOpen;
        }

        if(accounts.size() > 0) {
            update accounts;
        }
    }

    public static void updateRequests(List<Appointment__c> scope, Map<Id, Appointment__c> oldMap) {
        List<Request__c> updatingRequests = new List<Request__c>();
        List<String> requestIds = new List<String>();
        for(Appointment__c a : scope) {
            requestIds.add(a.Request__c);
        }
        Map<Id, Request__c> requestMap = new Map<Id, Request__c>([SELECT Id FROM Request__c WHERE Id IN :requestIds]);

        for(Appointment__c a : scope) {
            Appointment__c old;
            if(oldMap != null){
                old = oldMap.get(a.Id);
            }
            //if((a.Status__c == STATUS_TURNOVER || a.Status__c == STATUS_TURNOVER_NEVER_STARTED || a.Status__c == STATUS_TURNOVER_PATIENT_REFUSED || a.Status__c == STATUS_CANCELLED_BY_PLM || a.Status__c == STATUS_CANCELLED_BY_VENDOR ||
            //    a.Status__c == STATUS_CANCELLED_BY_PATIENT || a.Status__c == STATUS_CANCELLED_BY_PATIENT_BILLED || a.Status__c == STATUS_EXAMINER_NO_SHOW || a.Status__c == STATUS_PATIENT_NO_SHOW || a.Status__c == STATUS_PATIENT_NO_SHOW_BILLED ||
            //    a.Status__c == STATUS_UNABLE_TO_DRAW || a.Status__c == STATUS_PARTIAL_DRAW || a.Status__c == STATUS_PARTIAL_DRAW_INSUFFICIENT) && (a.Status__c != old.Status__c)) {
            //    
            //    if(a.Request__c != null) {
            //        Request__c r = requestMap.get(a.Request__c);
            //        r.Request_Status__c = 'Needs Resend';
            //        updatingRequests.add(r);
            //    }
            //}
            if (a.Status__c == STATUS_COMPLETED || a.Status__c == STATUS_PARTIAL_DRAW_SUFFICIENT) {
                if(a.Request__c != null && (old == null || a.Status__c != old.Status__c)) {
                    Request__c r = requestMap.get(a.Request__c);
                    r.Request_Status__c = 'Closed - Completed Draw';
                    updatingRequests.add(r);
                }
            }
            
        }

        if(updatingRequests.size() > 0) {
            update updatingRequests;
        }
    }
    
    public static void setAppointmentDrawTypeFromRequest(List<Appointment__c> scope) {
        List<String> requestIds = new List<String>();
        for(Appointment__c a : scope) {
            requestIds.add(a.Request__c);
        }
        Map<Id, Request__c> requestMap = new Map<Id, Request__c>([SELECT Id, Draw_type__c FROM Request__c WHERE Id IN :requestIds]);
        for(Appointment__c a : scope) {
            if (a.Request__c != null) {
                Request__c r = requestMap.get(a.Request__c);
                if (r.Draw_type__c != null) {
                    a.Draw_Type__c = r.Draw_type__c;
                }
            }
        }
    }
}