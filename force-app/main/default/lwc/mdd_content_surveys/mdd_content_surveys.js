import {
    LightningElement,
    wire,
    api,
    track
} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
//import { refreshApex } from '@salesforce/apex';
import getSurveyResponse from '@salesforce/apex/SurveyController.getSurveyResponse';
import fetchStatus from '@salesforce/apex/SurveyController.fetchStatus';
import getAccountOfUser from '@salesforce/apex/AccountsController.getAccountOfUser';
import Survey1CompletionBuffer from '@salesforce/label/c.Survey1CompletionBuffer';
import Survey2CompletionBuffer from '@salesforce/label/c.Survey2CompletionBuffer';
import Survey3CompletionBuffer from '@salesforce/label/c.Survey3CompletionBuffer';
import Survey4CompletionBuffer from '@salesforce/label/c.Survey4CompletionBuffer';
import Survey5CompletionBuffer from '@salesforce/label/c.Survey5CompletionBuffer';
import uId from '@salesforce/user/Id';
import getQuestionsandAnswers from '@salesforce/apex/SurveyController.getQuestionsandAnswers';
import SystemModstamp from '@salesforce/schema/Account.SystemModstamp';



export default class Mdd_content_surveys extends NavigationMixin(LightningElement) {
    @track survey;
    isModalOpen = false;
    userId = uId;
    accountId;
    accountCreatedDate;
    currentWeek;
    goalStartDate;
    goalStartDate_Sess2;
    isSurvey1locked = 'unlock'; //Changed to open
    isSurvey1 = true;
    isSurvey2locked = 'lock';
    isSurvey2 = false;
    isSurvey3locked = 'lock';
    isSurvey3 = false;
    isWeek6locked = 'lock';
    isWeek6 = false;
    isWeek18locked = 'lock';
    isWeek18 = false;
    week1Availability;
    week1date;
    week6Availability;
    week2date;
    week3date;
    week4date;
    week5date;
    week12Availability;
    week18Availability;
    week24Availability;
    checkStatusweek1;
    checkStatusweek2;
    checkStatusweek6;
    checkStatusweek12;
    checkStatusweek13;
    checkStatusweek18;
    checkStatusweek23;
    checkStatusweek24;

    isSurveyButton = true;
    @track status = {
        'week1': '',
        'week1completiondate': '',
        'week1surveylock': 'display-none  surveytbtn slds-m-left_x-small',
        'week2': '',
        'week2completiondate': '',
        'week2surveylock': 'display-none  surveytbtn slds-m-left_x-small',
        'week6': '',
        'week6completiondate': '',
        'week6surveylock': 'display-none  surveytbtn slds-m-left_x-small',
        'week12': '',
        'week12completiondate': '',
        'week12surveylock': 'display-none  surveytbtn slds-m-left_x-small',
        'week13': '',
        'week13completiondate': '',
        'week13surveylock': 'display-none  surveytbtn slds-m-left_x-small',
        'week18': '',
        'week18completiondate': '',
        'week18surveylock': 'display-none  surveytbtn slds-m-left_x-small',
        'week23': '',
        'week23completiondate': '',
        'week23surveylock': 'display-none  surveytbtn slds-m-left_x-small',
        'week24': '',
        'week24completiondate': '',
        'week24surveylock': 'display-none  surveytbtn slds-m-left_x-small'
    }

    isContainer = false;
    questionWeek;
    @track surveyId;
    surveyNumber;
    contacts;
    surveyName;
    error;
    // displayweeks={week0:"display-block",
    //             week1:"display-none",        
    //             week6:"lock",
    //             week12:"display-block",
    //             week13:"display-none",
    //             week18:"lock",+-
    //             week23:"display-block",
    //             week24:"display-none"}
    displayweeks = {
        week1: "display-block slds-col--padded slds-size--1-of-1 slds-medium-size--1-of-3 slds-large-size--1-of-4 comm-layout-column",
        week6: "lock",
        week12: "display-block slds-col--padded slds-size--1-of-1 slds-medium-size--1-of-3 slds-large-size--1-of-4 comm-layout-column",
        week18: "lock",

        week24: "display-block slds-col--padded slds-size--1-of-1 slds-medium-size--1-of-3 slds-large-size--1-of-4 comm-layout-column",
    }

    lock = {
        week0: "freeze",
        week1: "freeze",
        week6: "freeze",
        week12: "freeze",
        week13: "freeze",
        week18: "freeze",
        week23: "freeze",
        week24: "freeze"
    }

    //Survey 1 status variables
    statusSurvey1progress;
    statusSurvey1complete;
    statusSurvey1open;
    survey1Until;

    survey1EndDate;


    //Survey 2 status variables
    statusSurvey2progress;
    statusSurvey2complete;
    statusSurvey2open;
    statusSurvey2Inactive = 'Inactive';
    difOfGoal1startAndSystem;
    survey2Until;
    survey2EndDate;
    survey2Available;



    //Survey 3 status variables
    statusSurvey3progress;
    statusSurvey3complete;
    statusSurvey3open;
    statusSurvey3Inactive = 'Inactive';
    difOfSess2StartAndsystem;
    survey3Until;
    survey3EndDate;
    survey3Available;

    //week 6 status variables
    //statusWeek6progress = "In Progress";
    statusWeek6progress;
    statusWeek6complete;
    statusWeek6open;
    statusWeek6Inactive = 'Inactive';
    difOfSess2StartAndsystem;
    Week6Until;
    Week6EndDate;
    Week6Available;

    //week 18 status variables
    //statusWeek18progress = "In Progress";
    statusWeek18progress;
    statusWeek18complete;
    statusWeek18open;
    statusWeek18Inactive = 'Inactive';
    difOfSess2StartAndsystem;
    Week18Until;
    Week18EndDate;
    Week18Available;

    presentWeek = false;// added dec3

    survey1 = 'MDD-Survey-1';   //external Id of Survey 1
    survey2 = 'MDD-Survey-2';   //external Id of Survey 2
    survey3 = 'MDD-Survey-3';   //external Id of Survey 3
    week6 = 'PHQ-9';//external Id of phq9
    week18 = 'PHQ-9';
    week1toggle = 'disabled-color';
    week12toggle = 'disabled-color';
    week24toggle = 'disabled-color';
    week6toggle = 'disabled-color';
    week18toggle = 'disabled-color';
    label = {
        Survey1CompletionBuffer,
        Survey2CompletionBuffer,
        Survey3CompletionBuffer,
        Survey4CompletionBuffer,
        Survey5CompletionBuffer
    };
    surveyData;
     connectedCallback() {

        //To get the date in GMT(IST) Format using system time
        this.systemDate = new Date();
        console.log('new date is ' + this.systemDate);
        fetchStatus()
            .then(data => {
                console.log('data', JSON.stringify(data));
                this.status.week1 = (data?.completeweekstatus1__c == "Completed") ? data.completeweekstatus1__c : ""
                this.status.week2 = (data?.completeweekstatus2__c == "Completed") ? data.completeweekstatus2__c : ""
                this.status.week6 = (data?.completeweekstatus6__c == "Completed") ? data.completeweekstatus6__c : ""
                this.status.week12 = (data?.completeweekstatus12__c == "Completed") ? data.completeweekstatus12__c : ""
                this.status.week13 = (data?.completeweekstatus13__c == "Completed") ? data.completeweekstatus13__c : ""
                this.status.week18 = (data?.completeweekstatus18__c == "Completed") ? data.completeweekstatus18__c : ""
                this.status.week23 = (data?.completeweekstatus23__c == "Completed") ? data.completeweekstatus23__c : ""
                this.status.week24 = (data?.completeweekstatus24__c == "Completed") ? data.completeweekstatus24__c : ""
                var week1Date = new Date(data.Survey1Completion_Date__c);
                console.log('pj',week1Date);
                console.log('pj',data.Survey1Completion_Date__c);
                console.log('this.status.week1completiondate', this.status.week1completiondate);
                var week2lastdate;
                var week6lastdate;
                var week12lastdate;
                var week13lastdate;
                var week18lastdate;
                var week23lastdate;
                var week24lastdate;
                var today = new Date();
                if (data.Survey1Completion_Date__c != undefined) {
                    let numWeeks = 2;
                    this.status.week2completiondate = new Date();
                    this.status.week6completiondate = new Date();
                    this.status.week12completiondate = new Date();
                    this.status.week13completiondate = new Date();
                    this.status.week18completiondate = new Date();
                    this.status.week23completiondate = new Date();
                    this.status.week24completiondate = new Date();



                    week2lastdate = this.status.week2completiondate.setDate(week1Date.getDate() + 1 * 7);
                    week6lastdate = this.status.week6completiondate.setDate(week1Date.getDate() + 6 * 7);
                    week12lastdate = this.status.week12completiondate.setDate(week1Date.getDate() + 12 * 7);
                    week13lastdate = this.status.week13completiondate.setDate(week1Date.getDate() + 13 * 7);
                    week18lastdate = this.status.week18completiondate.setDate(week1Date.getDate() + 18 * 7);
                    week23lastdate = this.status.week23completiondate.setDate(week1Date.getDate() + 23 * 7);
                    week24lastdate = this.status.week24completiondate.setDate(week1Date.getDate() + 24 * 7);
                    console.log("data.Survey1Completion_Date__c",data.Survey1Completion_Date__c)
                    console.log("data.week2lastdate",week2lastdate)
                    console.log("data.week6lastdate",week6lastdate)
                    console.log("data.week12lastdate",week12lastdate)
                    console.log("data.week13lastdate",week13lastdate)
                    console.log("data.week18lastdate",week18lastdate)
                    console.log("data.week23lastdate",week23lastdate)
                    console.log("data.week24lastdate",week24lastdate)
                }
                if(this.status.week1 == 'Completed'){//complete green tick mark
                    this.checkStatusweek1 = true;
                }
                if(this.status.week2 == 'Completed'){
                    this.checkStatusweek2 = true;
                }
                if(this.status.week6 == 'Completed'){
                    this.checkStatusweek6 = true;
                }
                if(this.status.week12 == 'Completed'){
                    this.checkStatusweek12 = true;
                }
                if(this.status.week13 == 'Completed'){
                    this.checkStatusweek13 = true;
                }
                if(this.status.week18 == 'Completed'){
                    this.checkStatusweek18 = true;
                }
                if(this.status.week23 == 'Completed'){
                    this.checkStatusweek23 = true;
                }
                if(this.status.week24 == 'Completed'){
                    this.checkStatusweek24 = true;
                }

                if (this.status.week1 == 'Completed') {
                    if (this.status.week2 == 'Completed' && (Math.ceil((today - week2lastdate) / (1000 * 60 * 60 * 24))==8)) {
                        if (this.status.week6 == 'Completed' && (Math.ceil((today - week6lastdate) / (1000 * 60 * 60 * 24))==41)) {
                            if (this.status.week12 == 'Completed' &&(Math.ceil((today - week12lastdate) / (1000 * 60 * 60 * 24))==86)) {
                                if (this.status.week13 == 'Completed' && (Math.ceil((today - week13lastdate) / (1000 * 60 * 60 * 24))==91)) {
                                    if (this.status.week18 == 'Completed' && (Math.ceil((today - week18lastdate) / (1000 * 60 * 60 * 24))==126)) {
                                        if (this.status.week23 == 'Completed' &&( Math.ceil((today - week23lastdate) / (1000 * 60 * 60 * 24))==161)) {
                                            if (this.status.week24 == 'Completed' &&( Math.ceil((today - week24lastdate) / (1000 * 60 * 60 * 24))==168)) {
                                            }
                                            else {
                                                this.status.week24surveylock = 'display-block surveytbtn slds-m-left_x-small';
                                            }
                                        }
                                        else {
                                            this.status.week23surveylock = 'display-block surveytbtn slds-m-left_x-small';
                                        }
                                    }
                                    else {
                                        this.status.week18surveylock = 'display-block surveytbtn slds-m-left_x-small';
                                    }
                                }
                                else {
                                    this.status.week13surveylock = 'display-block surveytbtn slds-m-left_x-small';
                                }
                            }
                            else {
                                this.status.week12surveylock = 'display-block surveytbtn slds-m-left_x-small';
                            }
                        }
                        else {
                            this.status.week6surveylock = 'display-block surveytbtn slds-m-left_x-small';
                        }
                    }
                    else {
                        this.status.week2surveylock = 'display-block surveytbtn slds-m-left_x-small';
                    }
                }
                else {
                    this.status.week1surveylock = 'display-block surveytbtn slds-m-left_x-small';
                }
                console.log('dataa', data.Survey1Completion_Date__c);

                this.status.week1completiondate = this.dateFormatter(new Date(data.Survey1Completion_Date__c));
                this.status.week2completiondate = (this.dateFormatter(week2lastdate) != 'Invalid Date') ? this.dateFormatter(week2lastdate) : '';
                this.status.week6completiondate = (this.dateFormatter(week6lastdate) != 'Invalid Date') ? this.dateFormatter(week6lastdate) : '';
                this.status.week12completiondate = (this.dateFormatter(week12lastdate) != 'Invalid Date') ? this.dateFormatter(week12lastdate) : '';
                this.status.week13completiondate = (this.dateFormatter(week13lastdate) != 'Invalid Date') ? this.dateFormatter(week13lastdate) : '';
                this.status.week18completiondate = (this.dateFormatter(week18lastdate) != 'Invalid Date') ? this.dateFormatter(week18lastdate) : '';
                this.status.week23completiondate = (this.dateFormatter(week23lastdate) != 'Invalid Date') ? this.dateFormatter(week23lastdate) : '';
                this.status.week24completiondate = (this.dateFormatter(week24lastdate) != 'Invalid Date') ? this.dateFormatter(week24lastdate) : '';

            })
            .catch(error => {
                console.log("errorss", error);
            })

    }  

    renderedCallback() {
        if(this.isSurveyButton){
        let url_string = window.location.href;
        let url = new URL(url_string);
        if (url_string.includes("c__ismodalopen")) {
            let c = url.searchParams.get("c__ismodalopen");
            var btn;
            let count = 0;
            if(this.template.querySelectorAll(`[data-survey="active"]`).length>1){
                 this.template.querySelectorAll('lightning-button').forEach(each => {
                if (each.className.includes('display-block')) {
                   // btn = each;
                   count++;
                }
            })
            if(count>1){
                this.template.querySelectorAll(`[data-survey="active"]`)[0].click();
            }
            else{

            }
            }
            }
        this.isSurveyButton = false;
        }

    } 
    //Wire method to get the Account data such as Goal start date,Created date, ID's etc
    // @wire(CurrentPageReference)
    // wiredPageRef() {
    // console.log('before refresh in wiredPageRef');
    // refreshApex(this.surveyData);
    // console.log('after refresh in wiredPageRef');
    // }
   
        
    

    @wire(getAccountOfUser, {
        userId: '$userId'
    })
    wiredAccount(result) {
        this.surveyData = result;
        const { data, error } = result;
        if (data) {
            let acct = JSON.parse(data);
            console.log(acct);
            this.error = undefined;
            this.accountId = acct.id;
            this.accountCreatedDate = new Date(acct.CreatedDate);
            console.log("this.accountCreatedDate", this.accountCreatedDate);
            let today = new Date();
            let cssClass = " slds-col--padded slds-size--1-of-1 slds-medium-size--1-of-3 slds-large-size--1-of-5 comm-layout-column";
            this.currentWeek = Math.round(today - this.accountCreatedDate) / 604800000;
            console.log("this.currentWeek ", this.currentWeek);
            if (0 < this.currentWeek && this.currentWeek <= 2) {
                this.lock.week1 = "unfreeze";
            }
            else if (6 < this.currentWeek && this.currentWeek <= 7) {
                this.lock.week6 = "unfreeze";
            }
            if (12 < this.currentweek && this.currentweek <= 14) {
                this.lock.week12 = "unfreeze";
                this.lock.week6 = "freeze";
            }
            else if (18 < this.currentWeek && this.currentWeek <= 19) {
                this.lock.week18 = "unfreeze";
                this.lock.week12 = "freeze";
                this.lock.week6 = "freeze";
            }
            if (23 < this.currentWeek && this.currentWeek <= 25) {
                this.lock.week24 = "unfreeze";
                this.lock.week18 = "freeze";
                this.lock.week12 = "freeze";
                this.lock.week6 = "freeze";
            }
            if (this.currentWeek > 25) {
                this.lock.week24 = "freeze";
            }
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            let weekzone1 = new Date(this.accountCreatedDate);
            //    console.log('test=====>'+weekzone1.toLocaleDateString("en-US")); // 9/17/2016
            //    console.log('test=====>'+weekzone1.toLocaleDateString("en-US", options));
            //    console.log("this.week1Availability",weekzone1);
            this.week1Availability = new Date(weekzone1.setDate(weekzone1.getDate() + 2));

            this.week1date = this.week1Availability.toLocaleDateString("en-US", options);
            //let b = new Date(a.setDate(a.getDate()+2));
            console.log("this.week1Availability ", this.week1Availability);

            let weekzone2 = new Date(this.accountCreatedDate);
            console.log("this.week6Availability", weekzone2);
            this.week6Availability = new Date(weekzone2.setDate(weekzone2.getDate() + 42));
            this.week2date = this.week6Availability.toLocaleDateString("en-US", options);
            console.log("this.week6Availability ", this.week6Availability);

            let weekzone3 = new Date(this.accountCreatedDate);
            console.log("this.week12Availability", weekzone3);
            this.week12Availability = new Date(weekzone3.setDate(weekzone3.getDate() + 84));
            this.week3date = this.week12Availability.toLocaleDateString("en-US", options);
            console.log("this.week12Availability ", this.week12Availability);


            let weekzone4 = new Date(this.accountCreatedDate);
            console.log("this.week18Availability", weekzone4);
            this.week18Availability = new Date(weekzone4.setDate(weekzone4.getDate() + 114));
            this.week4date = this.week18Availability.toLocaleDateString("en-US", options);
            console.log("this.week18Availability ", this.week4date);

            let weekzone5 = new Date(this.accountCreatedDate);
            console.log("this.week24Availability", weekzone5);
            this.week24Availability = new Date(weekzone5.setDate(weekzone5.getDate() + 156));
            this.week5date = this.week24Availability.toLocaleDateString("en-US", options);
            console.log("this.week24Availability ", this.week24Availability);

            //  if(0<this.currentWeek && this.currentWeek<=1){
            //     this.displayweeks.week0 = "display-block"+cssClass;
            //     this.lock.week0 = "unlock";
            //      this.lock.week1 = "lock";
            // }
            // else if(1<this.currentWeek ){
            //     this.displayweeks.week1 = "display-block"+cssClass;
            //     this.displayweeks.week0 = "display-none"+cssClass
            //     if(this.currentWeek<2){
            //         this.lock.week1 = "unlock";
            //         this.lock.week0 = "lock";
            //     }
            // }
            // if(6<this.currentWeek && this.currentWeek<=7){
            //      this.lock.week6 = "unlock";            
            // }
            // if(12<this.currentWeek && this.currentWeek<=13){
            //     this.displayweeks.week12 = "display-block"+cssClass;
            //      this.lock.week12 = "unlock";   
            //      this.lock.week6 = "lock";              
            // }
            // else if(13<this.currentWeek ){
            //     this.displayweeks.week13 = "display-block"+cssClass;
            //     this.displayweeks.week12 = "display-none"+cssClass;
            //     if(this.currentWeek<14){
            //         this.lock.week13 = "unlock";
            //         this.lock.week12 = "lock";
            //     }
            // }
            // if(18<this.currentWeek && this.currentWeek<=19){
            //      this.lock.week18 = "unlock";            
            // }
            // if(23<this.currentWeek && this.currentWeek<=24){
            //     this.displayweeks.week23 = "display-block"+cssClass;
            //     this.lock.week23 = "unlock"; 
            //     this.lock.week18 = "lock";
            // }
            // else if(24<this.currentWeek  ){
            //     this.displayweeks.week24 = "display-block"+cssClass;
            //     this.displayweeks.week23 = "display-none"+cssClass;
            //     if(this.currentWeek<25){
            //         this.lock.week24 = "unlock";
            //         this.lock.week23 = "lock";
            //     }
            // }


            console.log("this.displayweeks", this.displayweeks);

            this.goalStartDate = acct.goalStartDate ? new Date(acct.goalStartDate) : 0;
            this.goalStartDate_Sess2 = acct.goalStartDate_sess2 ? new Date(acct.goalStartDate_sess2) : 0;
            console.log('System time is ' + this.systemDate);
            console.log('created date ' + this.accountCreatedDate);
            console.log('Date from SF is ' + acct.CreatedDate);
            console.log('goalStartDate ' + this.goalStartDate);
            console.log('goalStartDate_Sess2 ' + this.goalStartDate_Sess2);

            //Survey 1-- Condition: Open until {date}/InProgress until{date}
            this.survey1Until = new Date(this.accountCreatedDate);
            this.survey1Until.setDate(this.survey1Until.getDate() + (Number(this.label.Survey1CompletionBuffer) - 1));
            console.log('Survey 1 is until ' + this.survey1Until);
            this.survey1Until = this.dateFormatter(this.survey1Until); //dateFormatter function is written below
            console.log(' Survey 1 is until (after formatting) ' + this.survey1Until);

            //Survey 1--Completed on {date} is handled in Apex code

            //Calculate difference between System date and goal start date and use this if the record is not present in survey responses for OPEN STATE
            //Check if Goal start date is present. If present, calculate the difference, else assign it with zero.
            if (this.goalStartDate) {
                const diffOfGoal1AndSystemInMs = Math.abs(this.systemDate - this.goalStartDate);
                //to convert milliseconds to days
                this.difOfGoal1startAndSystem = Math.ceil(diffOfGoal1AndSystemInMs / (1000 * 60 * 60 * 24));
                //No of days Displays the For Survey 2  
                console.log(diffOfGoal1AndSystemInMs + " milliseconds");
                console.log(this.difOfGoal1startAndSystem + " days");
            } else
                this.difOfGoal1startAndSystem = 0;



            //No of days between session 2 start date and system date
            //Similar to above
            if (this.goalStartDate_Sess2) {
                const diffOfSess2AndSystemInMs = Math.abs(this.systemDate - this.goalStartDate_Sess2);
                //to convert milliseconds to days
                this.difOfSess2StartAndsystem = Math.ceil(diffOfSess2AndSystemInMs / (1000 * 60 * 60 * 24));
                console.log(diffOfSess2AndSystemInMs + " milliseconds");
                console.log(this.difOfSess2StartAndsystem + " days");
            } else
                this.difOfSess2StartAndsystem = 0;

            // //phq-9 week -6
            if (this.weekzone2) {
                this.Week6Available = new Date(this.goalStartDate);
                this.Week6Available.setDate(this.Week6Available.getDate() + 42);
                this.Week6Available = this.dateFormatter(this.Week6Available);
                console.log('week 6 is available after formatting ' + this.week6Available);
                this.Week6Until = new Date(this.goalStartDate);
                this.week6until.setDate(this.Week6Until.getDate() + (42 + (Number(this.label.Survey4CompletionBuffer)) - 1));
                console.log('week 6 is until' + this.Week6Until);
                this.Week6Until = this.dateFormatter(this.Week6Until);
                console.log('week 6 is until after formatting' + this.week6until);
            }

            //Survey 2-- Condition: Open until {date}/InProgress until{date}
            if (this.goalStartDate) {
                this.survey2Available = new Date(this.goalStartDate);
                this.survey2Available.setDate(this.survey2Available.getDate() + 42);
                this.survey2Available = this.dateFormatter(this.survey2Available);
                console.log(' Survey 2 is available after formatting ' + this.survey2Available);
                this.survey2Until = new Date(this.goalStartDate);
                this.survey2Until.setDate(this.survey2Until.getDate() + (42 + (Number(this.label.Survey2CompletionBuffer)) - 1));
                console.log('Survey 2 is until ' + this.survey2Until);
                this.survey2Until = this.dateFormatter(this.survey2Until);
                console.log(' Survey 2 is until after formatting ' + this.survey2Until);
            }

            // //PHQ9 week-18
            if (this.weekzone4) {
                this.Week18Available = new Date(this.goalStartDate);
                this.Week18Available.setDate(this.Week18Available.getDate() + 126);
                this.Week18Available = this.dateFormatter(this.Week18Available);
                console.log('week18 is available after formatting' + this.Week18Available);
                this.Week18Until = new Date(thid.goalStartDate);
                this.week18until.setDate(this.week18until.getdate() + (126 + (Number(this.label.Survey5CompletionBuffer)) - 1));
                console.log('week 18 is until' + this.Week18Until);
                this.week18until = this.dateFormatter(this.week18until);
                console.log('week18 is until after formatting' + this.week18until);
            }

            //Survey 3-- Condition: Open until {date}/In progress until {date}
            if (this.goalStartDate_Sess2) {
                this.survey3Available = new Date(this.goalStartDate_Sess2);
                this.survey3Available.setDate(this.survey3Available.getDate() + 84);
                this.survey3Available = this.dateFormatter(this.survey3Available);
                console.log(' Survey 3 is available after formatting ' + this.survey3Available);
                this.survey3Until = new Date(this.goalStartDate_Sess2);
                this.survey3Until.setDate(this.survey3Until.getDate() + (84 + (Number(this.label.Survey3CompletionBuffer)) - 1));
                console.log('Survey 3 is until ' + this.survey3Until);
                this.survey3Until = this.dateFormatter(this.survey3Until);
                console.log(' Survey 3 is until after formatting ' + this.survey3Until);
            }
            //Call the imperative method to get the survey responses for particular User
            this.fetchSurveyResponse();
        } else if (error) {
            this.accountId = undefined;
            this.error = error;
        }
    }
    fetchSurveyResponse() {
        let surveyNames = [this.survey1, this.survey2, this.survey3, this.week6, this.week18];
        getSurveyResponse({
            accountId: this.accountId,
            surveylist: surveyNames
        })
            .then(result => {
                this.survey = result;
                console.log('Apex data is ' + JSON.stringify(this.survey));
                for (let i = 0; i < this.survey.length; i++) {
                    //Set the data in array(surveyNames) to '0' if survey name is returned from Apex 
                    // const index = surveyNames.findIndex((el) => el === this.survey[i].Advanced_Survey_Name__c);
                    const index = surveyNames.findIndex((el) => el === this.survey[i].Advanced_Survey__r.Survey_Number__c);
                    console.log('survey number is ' + this.survey[i].Advanced_Survey__r.Survey_Number__c);
                    surveyNames[index] = 0;

                    if (this.survey[i].Advanced_Survey__r.Survey_Number__c === this.survey1) {
                        console.log('survey status is ' + this.survey[i].Status__c);
                        //this.week1toggle = '';
                        if (this.survey[i].Status__c === 'Incomplete') {
                            this.isSurvey1locked = 'unlock';
                            this.isSurvey1 = true;
                            this.statusSurvey1progress = 'In Progress';
                            this.week1toggle = 'is-actionable';
                        } else if (this.survey[i].Status__c === 'Complete') {
                            this.isSurvey1locked = 'lock';
                            this.isSurvey1 = false;
                            this.statusSurvey1complete = 'Completed';
                            this.survey1EndDate = new Date(this.survey[i].End_Date__c);
                            this.survey1EndDate = this.dateFormatter(this.survey1EndDate);
                            this.week1toggle = '';
                            console.log('Survey 1 end date (after formatting) is' + this.survey1EndDate);
                        }
                    }
                    // week 6 phq9
                    else if (this.survey[i].Advanced_Survey__r.Survey_Number__c === this.week6) {
                        // this.week6toogle = '';
                        if (this.survey[i].Status__c === 'Incomplete') {
                            this.week6toggle = 'is-actionable';
                            this.isweek6locked = 'unlock';
                            this.isweek6 = true;
                            this.statusWeek6progress = 'In Progress';
                            this.statusWeek6Inactive = '';
                        } else if (this.survey[i].Status__c === 'Complete') {
                            this.week6toggle = '';
                            this.isweek6locked = 'lock';
                            this.isweek6 = false;
                            this.statusWeek6complete = 'Completed';
                            this.Week6EndDate = new Date(this.survey[i].End_Date__c);
                            this.Week6EndDate = this.dateFormatter(this.Week6EndDate);
                            this.statusWeek6Inactive = '';
                            console.log('week 6 end date (after formatting) is' + this.Week6EndDate);
                        }
                    } else if (this.survey[i].Advanced_Survey__r.Survey_Number__c === this.survey2) {
                        //this.week12toggle = '';
                        if (this.survey[i].Status__c === 'Incomplete') {
                            this.week12toggle = 'is-actionable';
                            this.isSurvey2locked = 'unlock';
                            this.isSurvey2 = true;
                            this.statusSurvey2progress = 'In Progress';
                            this.statusSurvey2Inactive = '';
                        } else if (this.survey[i].Status__c === 'Complete') {
                            this.week12toggle = '';
                            this.isSurvey2locked = 'lock';
                            this.isSurvey2 = false;
                            this.statusSurvey2complete = 'Completed';
                            this.survey2EndDate = new Date(this.survey[i].End_Date__c);
                            this.survey2EndDate = this.dateFormatter(this.survey2EndDate);
                            this.statusSurvey2Inactive = '';
                            console.log('Survey 2 end date (after formatting) is' + this.survey2EndDate);
                        }
                    }
                    //week 18
                    else if (this.survey[i].Advanced_Survey__r.Survey_Number__c === this.week18) {

                        // this.week18toogle = '';
                        if (this.survey[i].Status__c === 'Incomplete') {
                            this.week18toggle = 'is-actionable';
                            this.isweek18locked = 'unlock';
                            this.isweek18 = true;
                            this.statusWeek18progress = 'In Progress';
                            this.statusWeek18Inactive = '';
                        } else if (this.survey[i].Status__c === 'Complete') {
                            this.week18toggle = '';
                            this.isweek18locked = 'lock';
                            this.isweek18 = false;
                            this.statusWeek18complete = 'Completed';
                            this.Week18EndDate = new Date(this.survey[i].End_Date__c);
                            this.Week18EndDate = this.dateFormatter(this.Week18EndDate);
                            this.statusWeek18Inactive = '';
                            console.log('week 18 end date (after formatting) is' + this.Week18EndDate);
                        }
                    } else if (this.survey[i].Advanced_Survey__r.Survey_Number__c === this.survey3) {



                        //this.week24toggle = '';
                        if (this.survey[i].Status__c === 'Incomplete') {
                            this.week24toggle = 'is-actionable';
                            this.isSurvey3locked = 'unlock';
                            this.isSurvey3 = true;
                            this.statusSurvey3progress = 'In Progress';
                            this.statusSurvey3Inactive = '';
                        } else if (this.survey[i].Status__c === 'Complete') {
                            this.week24toggle = '';
                            this.isSurvey3locked = 'lock';
                            this.isSurvey3 = false;
                            this.statusSurvey3complete = 'Completed';
                            this.survey3EndDate = new Date(this.survey[i].End_Date__c);
                            this.survey3EndDate = this.dateFormatter(this.survey3EndDate);
                            this.statusSurvey3Inactive = '';
                            console.log('Survey 3 end date (after formatting) is' + this.survey3EndDate);
                        }
                    }
                }


                //This surveyNames are the records which are not present in the org
                console.log('Survey names after processing are ' + surveyNames);
                surveyNames.forEach((item, index) => {
                    console.log('Item in array is ' + item);
                    if (item)
                        this.processSurveysNotPresent(index);
                })
            })
            .catch(error => {
                console.log('Errorured:- ' + error.body.message);
            });
    }
    //Arrow function to format dates in format Month, DD YYYY
    dateFormatter = (date) => {
        console.log('datest',date)
        const dtf = new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });//Check Intl.DateTimeFormat 
        const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(date);
        console.log('Date formatter is ' + `${mo} ${da}, ${ye}`);
        return `${mo} ${da}, ${ye}`;
    }

    //Arrow function to process surveys which are not there in Salesforce
    processSurveysNotPresent = (index) => {
        let surveyNumber = index + 1;
        if (surveyNumber === 1) {
            this.week1toggle = 'is-actionable';
            this.isSurvey1locked = 'unlock';
            this.isSurvey1 = true;
            this.statusSurvey1open = 'Take Survey';
        } else if (surveyNumber === 2 && this.difOfGoal1startAndSystem > 84) {
            this.week12toggle = 'is-actionable';
            this.isSurvey2locked = 'unlock';
            this.isSurvey2 = true;
            this.statusSurvey2open = 'Open';
            this.statusSurvey2Inactive = '';
        } else if (surveyNumber === 3 && this.difOfSess2StartAndsystem > 84) {
            this.week24toggle = 'is-actionable';
            this.isSurvey3locked = 'unlock';
            this.isSurvey3 = true;
            this.statusSurvey3open = 'Open';
            this.statusSurvey3Inactive = '';
        }
        else if (surveyNumber === 6) {
            this.week6toggle = 'is-actionable';
            this.isWeek6locked = 'unlock';
            this.isWeek6 = true;
            this.statusWeek6open = 'Open';
            this.statusWeek6Inactive = '';
        }
        else if (surveyNumber === 18) {
            this.week18toggle = 'is-actionable';
            this.isWeek18locked = 'unlock';
            this.isWeek18 = true;
            this.statusWeek18open = 'Open';
            this.statusWeek18Inactive = '';
        }
    }

    modalPopupHandler(event) {

        this.isModalOpen = true;
        this.questionWeek = event.target.dataset.week;
        this.surveyNumber = event.target.dataset.surveynumber;
        this.surveyName = event.target.dataset.surveyname;
        console.log("this.surveyName ", this.surveyName);


    }


    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }



    //Please don't hardcode use custom labels and write code at last if it's new method or something
    downloadSurvey(event) {
        window.location.href = "https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/print-mdd-survey";
    }
    /* closeModel(){
        window.location.href = "https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys";
        } */

    popupScrollHandler(event){
        console.log("inside popupScrollHandler");
        this.template.querySelectorAll('.slds-modal__content')[0].scrollTop=0;
    }
}