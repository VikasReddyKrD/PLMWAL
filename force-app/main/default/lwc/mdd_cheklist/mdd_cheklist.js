import { LightningElement,wire,track } from 'lwc';
import getTasksList from '@salesforce/apex/TaskController.getTasks';
import getTasksMetadata from '@salesforce/apex/TaskController.getTasksMetadata';
import getAccountOfUser from '@salesforce/apex/AccountsController.getAccountOfUser';
import uId from '@salesforce/user/Id';
import refreshChecklist from "@salesforce/messageChannel/refreshChecklist__c";
import {subscribe, MessageContext, APPLICATION_SCOPE} from 'lightning/messageService';
import getVideosandDocs from '@salesforce/apex/ListOfValuesController.getVideosandDocs';
import getCheckListDetails from '@salesforce/apex/SurveyController.getCheckListDetails';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import MedicalVerificationForm from '@salesforce/resourceUrl/MedicalVerificationForm';
import IconGplus from '@salesforce/resourceUrl/IconGplus';
// import SystemModstamp from '@salesforce/schema/Account.SystemModstamp';
// import {  NavigationMixin,CurrentPageReference} from 'lightning/navigation';

export default class Mdd_cheklist extends NavigationMixin(LightningElement) {
    
    error;
    @track tcList ;
    userId = uId;
    accountId;
    currentWk; 
    isWeekZero = undefined;   
    isWeek25 = undefined;
    //Subject;
    // currentPageReference
    MedicalVerificationForm = MedicalVerificationForm;
    videosList;
   docsList;
 activeText='';
 inactiveText='';  
 statusSurvey1;
 completedStatusSurvey1;
 ProgressStatusSurvey1;
//  seesion1Complete = true;
//  seesion2Complete;


    @wire(MessageContext)
    context;
    trasmittedValue;
    taskList;
    sessionNumber;
    header;
    renderedCallbackCounter = 0;
    accountList;
    isModalOpen = false;
    isTrue=true;
    hideSeeMore=false;
    hideSeeless=true;
    pdfDownloadLink;
    accountCheckListDetails;
    activdiagnosis='inactive';
    week1='inactive';
    week6='inactive';
    week13='inactive';
    week18='inactive';
    week24='inactive';
    confirmDiagnosis='inactive';
    updateCheckData=[];
    checkListDetails={'confirmedmdd':{'message':'Complete Survey 1','css':'inactive','color':'color:grey'},
                        'week1':{'message':'Complete Survey 1','css':'inactive','color':'color:grey'}, 
                        'goal1':{'message':'Set session 1 goals','css':'inactive','color':'color:grey'},
                        'Track1':{'message':'Track 1 Weekly goals','css':'inactive','color':'color:grey'},
                        'Track2':{'message':'Track 2 Weekly Goals','css':'inactive','color':'color:grey'},
                        'Track3':{'message':'Track 3 Weekly Goals','css':'inactive','color':'color:grey'},
                        'Track4':{'message':'Track 4 Weekly Goals','css':'inactive','color':'color:grey'},
                        'Track5':{'message':'Track 5 Weekly Goals','css':'inactive','color':'color:grey'},
                        'Track6':{'message':'Track 6 Weekly Goals','css':'inactive','color':'color:grey'},
                        'PHQ9':{'message':'Complete PHQ 9 Survey','css':'inactive','color':'color:grey'},
                        'Track7':{'message':'Track 7 Weekly Goals','css':'inactive','color':'color:grey'},
                        'Track8':{'message':'Track 8 Weekly Goals','css':'inactive','color':'color:grey'},
                        'Track9':{'message':'Track 9 Weekly Goals','css':'inactive','color':'color:grey'},
                        'Track10':{'message':'Track 10 Weekly Goals','css':'inactive','color':'color:grey'},
                        'Track11':{'message':'Track 11 Weekly Goals','css':'inactive','color':'color:grey'},
                        'Track12':{'message':'Track 12 Weekly Goals','css':'inactive','color':'color:grey'},
                        'week13':{'message':'Earn $50 gift card','css':'inactive','color':'color:grey'},
                        'week18':{'message':'Earn $50 gift card','css':'inactive','color':'color:grey'},
                        'week24':{'message':'Earn $50 gift card','css':'inactive','color':'color:grey'}
                    };


     track1Date= new Date();
     track2Date;//= new Date();
     track3Date= new Date();
     track4Date= new Date();
     track5Date= new Date();
     track6Date= new Date();
     track7Date= new Date();
     track8Date= new Date();
     track9Date= new Date();
     track10Date= new Date();
     track11Date= new Date();
     track12Date= new Date();
     track13Date= new Date();   
     
     week1Trackstdate;
     week2Trackstdate;
     week3Trackstdate;
     week4Trackstdate;
     week5Trackstdate;
     week6Trackstdate;
     week7Trackstdate;
     week8Trackstdate;
     week9Trackstdate;
     week10Trackstdate;
     week11Trackstdate;
     week12Trackstdate;
     week13Trackstdate;

     trackDateWeek1;
     trackDateWeek2;
     trackDateWeek3;
     trackDateWeek4;
     trackDateWeek5;
     trackDateWeek6;
     trackDateWeek7;
     trackDateWeek8;
     trackDateWeek9;
     trackDateWeek10;
     trackDateWeek11;
     trackDateWeek12;
     trackDateWeek13;

     track1message;
     track2message;
     track3message;
     track4message;
     track5message;
     track6message;
     track7message;
     track8message;
     track9message;
     track10message;
     track11message;
     track12message;
     today;
     track1missedgoal;
     track2missedgoal;
     track3missedgoal;
     track4missedgoal;
     track5missedgoal;
     track6missedgoal;
     track7missedgoal;
     track8missedgoal;
     track9missedgoal;
     track10missedgoal;
     track11missedgoal;
     track12missedgoal;

     isSession2=false;
     completeSurvey2Arrowcss;
     completeSurvey2Textcolor;

    setSession2Arrowcss;
    setSession2Textcolor;

    session2StartDate;

    session2week1Trackdate;
    session2week2Trackdate;
    session2week3Trackdate;
    session2week4Trackdate;
    session2week5Trackdate;
    session2week6Trackdate;
    session2week7Trackdate;
    session2week8Trackdate;
    session2week9Trackdate;
    session2week10Trackdate;
    session2week11Trackdate;
    session2week12Trackdate;

    session2week1FormattedTrackdate;
    session2week2FormattedTrackdate;
    session2week3FormattedTrackdate;
    session2week4FormattedTrackdate;
    session2week5FormattedTrackdate;
    session2week6FormattedTrackdate;
    session2week7FormattedTrackdate;
    session2week8FormattedTrackdate;
    session2week9FormattedTrackdate;
    session2week10FormattedTrackdate;
    session2week11FormattedTrackdate;
    session2week12FormattedTrackdate;

    session2Track1Message;
    session2Track2Message;
    session2Track3Message;
    session2Track4Message;
    session2Track5Message;
    session2Track6Message;
    session2Track7Message;
    session2Track8Message;
    session2Track9Message;
    session2Track10Message;
    session2Track11Message;
    session2Track12Message;
    
    session2Track1MissedGoal;
    session2Track2MissedGoal;
    session2Track3MissedGoal;
    session2Track4MissedGoal;
    session2Track5MissedGoal;
    session2Track6MissedGoal;
    session2Track7MissedGoal;
    session2Track8MissedGoal;
    session2Track9MissedGoal;
    session2Track10MissedGoal;
    session2Track11MissedGoal;
    session2Track12MissedGoal;

    session2Track1css;
    session2Track2css;
    session2Track3css;
    session2Track4css;
    session2Track5css;
    session2Track6css;
    session2Track7css;
    session2Track8css;
    session2Track9css;
    session2Track10css;
    session2Track11css;
    session2Track12css;

    session2Track1TextColor;
    session2Track2TextColor;
    session2Track3TextColor;
    session2Track4TextColor;
    session2Track5TextColor;
    session2Track6TextColor;
    session2Track7TextColor;
    session2Track8TextColor;
    session2Track9TextColor;
    session2Track10TextColor;
    session2Track11TextColor;
    session2Track12TextColor;

    
    phq9session2message
    phq9session2Arrowcss
    phq9session2word

    survey2CompletetionCss;
    survey2CompletetionWord;

    // counter =0;
    // @wire(CurrentPageReference) 
    // wiredPgRef(currentPageReference)    {
    //     console.log('inside wiredpageRef of checklist');
    //     if(this.counter===0)    {
    //         //eval("$A.get('e.force:refreshView').fire();");
    //         this.counter=1;
    //     }
    // }
    // disconnectedCallback()  {
    //     console.log('inside the disconnected Callback of checklist');
    //     refreshApex(this.taskList);
    // }
   // added jan 18
    /* getDocuments(){
    getVideosandDocs({va}){
        if (data) { 
            console.log('data');
            let {videos, docs} = data;
            console.log('videos'+ JSON.stringify(videos));
            console.log('docs'+ JSON.stringify(docs));
           
            this.videosList = videos.map((url, index) => {
                console.log('the value of urldescription is '+url.Description__c);
                let description = (url.Description__c)?JSON.parse(url.Description__c): undefined;
                let urlTransformed= {
                    id: url.Id,
                   value: url.Value__c,
                   title: (description)? description.title: '',
                   desc: (description)? description.desc: ''
                }
                return urlTransformed;
            });

            this.docsList = docs;
            //console.log('the value of data after transformation is '+ this.videosList);
            console.log('the value of data after transformation is '+ JSON.stringify(this.docsList));
        }          
        else if (error) {
            console.log('error1');
            this.error = JSON.parse(error.body.message);
            console.log('urlList Error--->>'+ JSON.parse(error.body.message));
            console.log(error.body.message);
        }
    }
    } */

    
    /* renderedCallback(){
        this.renderedCallbackCounter ++ ;
        console.log('Inside callback checklist' + this.renderedCallbackCounter);
        //Refresh Apex is not working on the initial page load, and in connected callback and first iteration of the renderedCallBack.
        //So, we are refreshing apex on the second iteration.
        if(this.renderedCallbackCounter === 2){
            refreshApex(this.accountList);
            refreshApex(this.taskList); }
        
    } */
    //Adding this to subscribe the messages being sent using LMS from Goal tracking component
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

    connectedCallback(){
        // refreshApex(this.taskList);
        //eval("$A.get('e.force:refreshView').fire();");
        // if (this.taskList && this.taskList.data) {
        //     refreshApex(this.taskList);
        // }
        // if(result.status.week1 == 'Completed'){
        //     this.completeStatusSurvey1 =true;
            
        // }
        // else if(result.status.week1 == 'InProgress'){
        //     this.InprogressStatusSurvey1 =true;
            
        // }
        // else{
        //     this.statusSurvey1 =true;
        // }
        this.subscribeMessage()
        console.log('In connected callback');

        getCheckListDetails()
        .then(result => {
            this.accountCheckListDetails = result;
            this.checkList = result;
             console.log('praveen');   
             console.log(result);             
            try{
                
             var today = new Date();
             if(result.account.GoalStartDate__c!=undefined){
             var dateValue=result.account.GoalStartDate__c.split('T')[0];
                console.log(dateValue);
                this.week1Trackstdate = new Date(dateValue);
            }    
            
            if(result.account.GoalStartDate_Session2__c!=undefined){
                var session2splitdate = result.account.GoalStartDate_Session2__c.split('T')[0];
                console.log(session2splitdate);
                this.session2StartDate = new Date(session2splitdate);
            }

                if(this.week1Trackstdate!=undefined){
                 //week1Trackstdate=this.track1Date.setDate(week1Trackstdate.getDate()+1);
                this.week2Trackstdate  =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week3Trackstdate  =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week4Trackstdate  =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week5Trackstdate  =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week6Trackstdate  =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week7Trackstdate  =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week8Trackstdate  =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week9Trackstdate  =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week10Trackstdate =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week11Trackstdate =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week12Trackstdate =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
                this.week13Trackstdate =this.week1Trackstdate.setDate(this.week1Trackstdate.getDate()  +7);
            
                 this.trackDateWeek2  =this.dateFormatter(this.week2Trackstdate).split(',')[0];
                 this.trackDateWeek3  =this.dateFormatter(this.week3Trackstdate).split(',')[0];
                 this.trackDateWeek4  =this.dateFormatter(this.week4Trackstdate).split(',')[0];
                 this.trackDateWeek5  =this.dateFormatter(this.week5Trackstdate).split(',')[0];
                 this.trackDateWeek6  =this.dateFormatter(this.week6Trackstdate).split(',')[0];
                 this.trackDateWeek7  =this.dateFormatter(this.week7Trackstdate).split(',')[0];
                 this.trackDateWeek8  =this.dateFormatter(this.week8Trackstdate).split(',')[0];
                 this.trackDateWeek9  =this.dateFormatter(this.week9Trackstdate).split(',')[0];
                 this.trackDateWeek10 =this.dateFormatter(this.week10Trackstdate).split(',')[0];
                 this.trackDateWeek11 =this.dateFormatter(this.week11Trackstdate).split(',')[0];
                 this.trackDateWeek12 =this.dateFormatter(this.week12Trackstdate).split(',')[0];
                 this.trackDateWeek13 =this.dateFormatter(this.week13Trackstdate).split(',')[0];
               
                }   
                
                if(this.session2StartDate!=undefined){
                this.session2week1Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week2Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week3Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week4Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week5Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week6Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week7Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week8Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week9Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week10Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week11Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                this.session2week12Trackdate=this.session2StartDate.setDate(this.session2StartDate.getDate()  +7);
                
                this.session2week1FormattedTrackdate=this.dateFormatter(this.session2week1Trackdate).split(',')[0];
                this.session2week2FormattedTrackdate=this.dateFormatter(this.session2week2Trackdate).split(',')[0];
                this.session2week3FormattedTrackdate=this.dateFormatter(this.session2week3Trackdate).split(',')[0];
                this.session2week4FormattedTrackdate=this.dateFormatter(this.session2week4Trackdate).split(',')[0];
                this.session2week5FormattedTrackdate=this.dateFormatter(this.session2week5Trackdate).split(',')[0];
                this.session2week6FormattedTrackdate=this.dateFormatter(this.session2week6Trackdate).split(',')[0];
                this.session2week7FormattedTrackdate=this.dateFormatter(this.session2week7Trackdate).split(',')[0];
                this.session2week8FormattedTrackdate=this.dateFormatter(this.session2week8Trackdate).split(',')[0];
                this.session2week9FormattedTrackdate=this.dateFormatter(this.session2week9Trackdate).split(',')[0];
                this.session2week10FormattedTrackdate=this.dateFormatter(this.session2week10Trackdate).split(',')[0];
                this.session2week11FormattedTrackdate=this.dateFormatter(this.session2week11Trackdate).split(',')[0];
                this.session2week12FormattedTrackdate=this.dateFormatter(this.session2week12Trackdate).split(',')[0];
            }
                
                 this.today = new Date();//'2022-03-16'
                //var today1 = this.dateFormatter(new Date()).split(',')[0];
                
                  console.log('todaytest',today);
                
                if(this.trackDateWeek2!=undefined){
                this.track1message=`Track ${this.trackDateWeek2} Weekly Goals`;
                this.track2message=`Track ${this.trackDateWeek3} Weekly Goals`;
                this.track3message=`Track ${this.trackDateWeek4} Weekly Goals`;
                this.track4message=`Track ${this.trackDateWeek5} Weekly Goals`;
                this.track5message=`Track ${this.trackDateWeek6} Weekly Goals`;
                this.track6message=`Track ${this.trackDateWeek7} Weekly Goals`;
                this.track7message=`Track ${this.trackDateWeek8} Weekly Goals`;
                this.track8message=`Track ${this.trackDateWeek9} Weekly Goals`;
                this.track9message=`Track ${this.trackDateWeek10} Weekly Goals`;
                this.track10message=`Track ${this.trackDateWeek11} Weekly Goals`;
                this.track11message=`Track ${this.trackDateWeek12} Weekly Goals`;
                this.track12message=`Track ${this.trackDateWeek13} Weekly Goals`;

                this.track1missedgoal=`Track ${this.trackDateWeek2} missed Goals`;
                this.track2missedgoal=`Track ${this.trackDateWeek3} missed Goals`;
                this.track3missedgoal=`Track ${this.trackDateWeek4} missed Goals`;
                this.track4missedgoal=`Track ${this.trackDateWeek5} missed Goals`;
                this.track5missedgoal=`Track ${this.trackDateWeek6} missed Goals`;
                this.track6missedgoal=`Track ${this.trackDateWeek7} missed Goals`;
                this.track7missedgoal=`Track ${this.trackDateWeek8} missed Goals`;
                this.track8missedgoal=`Track ${this.trackDateWeek9} missed Goals`;
                this.track9missedgoal=`Track ${this.trackDateWeek10} missed Goals`;
                this.track10missedgoal=`Track ${this.trackDateWeek11} missed Goals`;
                this.track11missedgoal=`Track ${this.trackDateWeek12} missed Goals`;                
                this.track12missedgoal=`Track ${this.trackDateWeek13} missed Goals`;
                }
                               
                if(this.trackDateWeek2==undefined || this.trackDateWeek2==''){
                this.track1message='Track 1 Weekly goals';
                this.track2message='Track 2 Weekly goals';
                this.track3message='Track 3 Weekly goals';
                this.track4message='Track 4 Weekly goals';
                this.track5message='Track 5 Weekly goals';
                this.track6message='Track 6 Weekly goals';
                this.track7message='Track 7 Weekly goals';
                this.track8message='Track 8 Weekly goals';
                this.track9message='Track 9 Weekly goals';
                this.track10message='Track 10 Weekly goals';
                this.track11message='Track 11 Weekly goals';
                this.track12message='Track 12 Weekly goals';
            
                this.track1missedgoal='Track 1 missed Goals';
                this.track2missedgoal='Track 2 Weekly goals';
                this.track3missedgoal='Track 3 Weekly goals';
                this.track4missedgoal='Track 4 Weekly goals';
                this.track5missedgoal='Track 5 Weekly goals';
                this.track6missedgoal='Track 6 Weekly goals';
                this.track7missedgoal='Track 7 Weekly goals';
                this.track8missedgoal='Track 8 Weekly goals';
                this.track9missedgoal='Track 9 Weekly goals';
                this.track10missedgoal='Track 10 Weekly goals';
                this.track11missedgoal='Track 11 Weekly goals';                
                this.track12missedgoal='Track 12 Weekly goals';
            }

            if(this.session2week1FormattedTrackdate!=undefined){
                this.session2Track1Message=`Track ${this.session2week1FormattedTrackdate} Weekly Goals`;
                this.session2Track2Message=`Track ${this.session2week2FormattedTrackdate} Weekly Goals`;
                this.session2Track3Message=`Track ${this.session2week3FormattedTrackdate} Weekly Goals`;
                this.session2Track4Message=`Track ${this.session2week4FormattedTrackdate} Weekly Goals`;
                this.session2Track5Message=`Track ${this.session2week5FormattedTrackdate} Weekly Goals`;
                this.session2Track6Message=`Track ${this.session2week6FormattedTrackdate} Weekly Goals`;
                this.session2Track7Message=`Track ${this.session2week7FormattedTrackdate} Weekly Goals`;
                this.session2Track8Message=`Track ${this.session2week8FormattedTrackdate} Weekly Goals`;
                this.session2Track9Message=`Track ${this.session2week9FormattedTrackdate} Weekly Goals`;
                this.session2Track10Message=`Track ${this.session2week10FormattedTrackdate} Weekly Goals`;
                this.session2Track11Message=`Track ${this.session2week11FormattedTrackdate} Weekly Goals`;
                this.session2Track12Message=`Track ${this.session2week12FormattedTrackdate} Weekly Goals`;

                this.session2Track1MissedGoal=`Track ${this.session2week1FormattedTrackdate} Weekly Goals`;
                this.session2Track2MissedGoal=`Track ${this.session2week2FormattedTrackdate} Weekly Goals`;
                this.session2Track3MissedGoal=`Track ${this.session2week3FormattedTrackdate} Weekly Goals`;
                this.session2Track4MissedGoal=`Track ${this.session2week4FormattedTrackdate} Weekly Goals`;
                this.session2Track5MissedGoal=`Track ${this.session2week5FormattedTrackdate} Weekly Goals`;
                this.session2Track6MissedGoal=`Track ${this.session2week6FormattedTrackdate} Weekly Goals`;
                this.session2Track7MissedGoal=`Track ${this.session2week7FormattedTrackdate} Weekly Goals`;
                this.session2Track8MissedGoal=`Track ${this.session2week8FormattedTrackdate} Weekly Goals`;
                this.session2Track9MissedGoal=`Track ${this.session2week9FormattedTrackdate} Weekly Goals`;
                this.session2Track10MissedGoal=`Track ${this.session2week10FormattedTrackdate} Weekly Goals`;
                this.session2Track11MissedGoal=`Track ${this.session2week11FormattedTrackdate} Weekly Goals`;
                this.session2Track12MissedGoal=`Track ${this.session2week12FormattedTrackdate} Weekly Goals`;
                }

                if(this.session2week1FormattedTrackdate==undefined || this.session2week1FormattedTrackdate==''){
                    this.session2Track1Message='Track 1 Weekly goals';
                    this.session2Track2Message='Track 2 Weekly goals';
                    this.session2Track3Message='Track 3 Weekly goals';
                    this.session2Track4Message='Track 4 Weekly goals';
                    this.session2Track5Message='Track 5 Weekly goals';
                    this.session2Track6Message='Track 6 Weekly goals';
                    this.session2Track7Message='Track 7 Weekly goals';
                    this.session2Track8Message='Track 8 Weekly goals';
                    this.session2Track9Message='Track 9 Weekly goals';
                    this.session2Track10Message='Track 10 Weekly goals';
                    this.session2Track11Message='Track 11 Weekly goals';
                    this.session2Track12Message='Track 12 Weekly goals';
    
                    this.session2Track1MissedGoal='Track 1 Weekly goals';
                    this.session2Track2MissedGoal='Track 2 Weekly goals';
                    this.session2Track3MissedGoal='Track 3 Weekly goals';
                    this.session2Track4MissedGoal='Track 4 Weekly goals';
                    this.session2Track5MissedGoal='Track 5 Weekly goals';
                    this.session2Track6MissedGoal='Track 6 Weekly goals';
                    this.session2Track7MissedGoal='Track 7 Weekly goals';
                    this.session2Track8MissedGoal='Track 8 Weekly goals';
                    this.session2Track9MissedGoal='Track 9 Weekly goals';
                    this.session2Track10MissedGoal='Track 10 Weekly goals';
                    this.session2Track11MissedGoal='Track 11 Weekly goals';
                    this.session2Track12MissedGoal='Track 12 Weekly goals';
                    }
                    
                

                }catch(err){
                 console.log(err);
                }
                if(result){                
                if(result.account.completeweekstatus1__c=='Completed'){
                    console.log("status",result.account.completeweekstatus1__c);
                        this.checkListDetails.week1.message='Complete survey 1'
                        this.checkListDetails.week1.css='active',
                        this.checkListDetails.week1.color='margin:0;color:black'
                    }
                else if(result.account.completeweekstatus1__c=='InProgress'){
                    
                    this.checkListDetails.week1.message='Complete survey 1',
                    this.checkListDetails.week1.css='inactive',
                    this.checkListDetails.week1.color='margin:0;color:blue'
                } 
                
                    if(result.responseList.length>0){
                        console.log("status",result.responseList.length);
                        this.checkListDetails.goal1.message='Set session 1 goals',
                        this.checkListDetails.goal1.css='active',
                        this.checkListDetails.goal1.color='margin:0;color:black'
                    }
                    else if(result.account.completeweekstatus1__c=='Completed'){
                        console.log("status",result.account.completeweekstatus1__c);  
                    this.checkListDetails.goal1.message='Set session 1 goals',
                    this.checkListDetails.goal1.css='inactive',
                    this.checkListDetails.goal1.color='margin:0;color:blue'
                    }
                    else if(result.account.completeweekstatus1__c==null){
                        this.checkListDetails.goal1.message='Set session 1 goals',
                        this.checkListDetails.goal1.css='inactive',
                        this.checkListDetails.goal1.color='margin:0;color:black'
                    }
                    if(result.trackingList.length>0 && result.trackingList[0].WK__c==1){
                        this.checkListDetails.Track1.message=`Track ${this.trackDateWeek2} Weekly Goals`,
                        this.checkListDetails.Track1.css='active',
                        this.checkListDetails.Track1.color='margin:0;color:black'
                    }
                    else if(result.responseList.length>0){
                        this.checkListDetails.Track1.message=`Track ${this.trackDateWeek2} Weekly Goals`,
                        this.checkListDetails.Track1.css='inactive',
                        this.checkListDetails.Track1.color='margin:0;color:blue'
                    }
                    else if(result.responseList.length==0 && this.trackDateWeek2!=undefined){
                        this.checkListDetails.Track1.message=`Track ${this.trackDateWeek2} Weekly Goals`,
                        this.checkListDetails.Track1.css='inactive',
                        this.checkListDetails.Track1.color='margin:0;color:black'
                    }
                    try{
                    if(result.trackingList.length>1 && result.trackingList[1].WK__c==2){
                        this.checkListDetails.Track2.message=`Track ${this.trackDateWeek3} Weekly Goals`,
                        this.checkListDetails.Track2.css='active',
                        this.checkListDetails.Track2.color='margin:0;color:black'
                    }
                    else if(this.today>=new Date(this.week3Trackstdate)){ //result.trackingList[0].WK__c==1){
                        this.checkListDetails.Track2.message=`Track ${this.trackDateWeek3} Weekly Goals`,
                        this.checkListDetails.Track2.css='inactive',
                        this.checkListDetails.Track2.color='margin:0;color:blue'
                    }
                    else if(result.responseList.length==0 && this.trackDateWeek2!=undefined){
                        this.checkListDetails.Track2.message=`Track ${this.trackDateWeek3} Weekly Goals`,
                        this.checkListDetails.Track2.css='inactive',
                        this.checkListDetails.Track2.color='margin:0;color:black'
                    }
                    if(result.trackingList.length>2 && result.trackingList[2].WK__c==3){
                        this.checkListDetails.Track3.message=`Track ${this.trackDateWeek4} Weekly Goals`,
                        this.checkListDetails.Track3.css='active',
                        this.checkListDetails.Track3.color='margin:0;color:black'
                    }
                    else if(this.today>=new Date(this.week4Trackstdate)){//result.trackingList[1].WK__c==2
                        this.checkListDetails.Track3.message=`Track ${this.trackDateWeek4} Weekly Goals`,
                        this.checkListDetails.Track3.css='inactive',
                        this.checkListDetails.Track3.color='margin:0;color:blue'
                    }
                    // else if(result.responseList.length==0){
                    //     this.checkListDetails.Track3.message=`Track ${this.trackDateWeek4} Weekly Goals`,
                    //     this.checkListDetails.Track3.css='inactive',
                    //     this.checkListDetails.Track3.color='margin:0;color:black'
                    // }
                    if(result.trackingList.length>3 && result.trackingList[3].WK__c==4){
                        this.checkListDetails.Track4.message=`Track ${this.trackDateWeek5} Weekly Goals`,
                        this.checkListDetails.Track4.css='active',
                        this.checkListDetails.Track4.color='margin:0;color:black'
                    }        
                    else if(this.today>=new Date(this.week5Trackstdate)){//result.trackingList[2].WK__c==3
                        this.checkListDetails.Track4.message=`Track ${this.trackDateWeek5} Weekly Goals`,
                        this.checkListDetails.Track4.css='inactive',
                        this.checkListDetails.Track4.color='margin:0;color:blue'
                    }
                    // else if(result.account.completeweekstatus1__c=='InProgress' || result.account.completeweekstatus1__c==''){
                    //     this.checkListDetails.Track4.message=`Track ${this.trackDateWeek5} Weekly Goals`,
                    //     this.checkListDetails.Track4.css='inactive',
                    //     this.checkListDetails.Track4.color='margin:0;color:black'
                    // }
                    if(result.trackingList.length>4 && result.trackingList[4].WK__c==5){
                        this.checkListDetails.Track5.message=`Track ${this.trackDateWeek6} Weekly Goals`,
                        this.checkListDetails.Track5.css='active',
                        this.checkListDetails.Track5.color='margin:0;color:black'
                    }
                    else if(this.today>=new Date(this.week6Trackstdate)){//result.trackingList[3].WK__c==4){
                        this.checkListDetails.Track5.message=`Track ${this.trackDateWeek6} Weekly Goals`,
                        this.checkListDetails.Track5.css='inactive',
                        this.checkListDetails.Track5.color='margin:0;color:blue'
                    }
                    else if(result.account.completeweekstatus1__c=='InProgress' || result.account.completeweekstatus1__c==''){
                        this.checkListDetails.Track5.message=`Track ${this.trackDateWeek6} Weekly Goals`,
                        this.checkListDetails.Track5.css='inactive',
                        this.checkListDetails.Track5.color='margin:0;color:black'
                    }
                    if(result.trackingList.length>5 && result.trackingList[5].WK__c==6){
                        this.checkListDetails.Track6.message=`Track ${this.trackDateWeek7} Weekly Goals`,
                        this.checkListDetails.Track6.css='active',
                        this.checkListDetails.Track6.color='margin:0;color:black'
                    }
                    else if(this.today>=new Date(this.week7Trackstdate)){//result.trackingList[4].WK__c==5){
                        this.checkListDetails.Track6.message=`Track ${this.trackDateWeek7} Weekly Goals`,
                        this.checkListDetails.Track6.css='inactive',
                        this.checkListDetails.Track6.color='margin:0;color:blue'
                    }
                    else if(result.account.completeweekstatus1__c=='InProgress' || result.account.completeweekstatus1__c==''){
                        this.checkListDetails.Track6.message=`Track ${this.trackDateWeek7} Weekly Goals`,
                        this.checkListDetails.Track6.css='inactive',
                        this.checkListDetails.Track6.color='margin:0;color:black'
                    }
                    if(result.account.completeweekstatus6__c=='Completed'){
                        this.checkListDetails.PHQ9.message='Track PHQ 9 Survey',
                        this.checkListDetails.PHQ9.css='active',
                        this.checkListDetails.PHQ9.color='margin:0;color:black'
                    }
                    else if(result.trackingList.length>5 && result.trackingList[5].WK__c==6){
                        this.checkListDetails.PHQ9.message='Track PHQ 9 Survey',
                        this.checkListDetails.PHQ9.css='inactive',
                        this.checkListDetails.PHQ9.color='margin:0;color:blue'
                    }
                    // else if(result.account.phq9wk6__c== null){
                    //     this.checkListDetails.PHQ9.message='Track PHQ 9 Survey',
                    //     this.checkListDetails.PHQ9.css='inactive',
                    //     this.checkListDetails.PHQ9.color='margin:0;color:black'
                    // }
                    if(result.trackingList.length>6 && result.trackingList[6].WK__c==7){
                        this.checkListDetails.Track7.message=`Track ${this.trackDateWeek8} Weekly Goals`,
                        this.checkListDetails.Track7.css='active',
                        this.checkListDetails.Track7.color='margin:0;color:black'
                    }
                    else if(this.today>=new Date(this.week8Trackstdate)){//result.trackingList[5].WK__c==6){
                        this.checkListDetails.Track7.message=`Track ${this.trackDateWeek8} Weekly Goals`,
                        this.checkListDetails.Track7.css='inactive',
                        this.checkListDetails.Track7.color='margin:0;color:blue'
                    }
                    // else if(result.account.phq9wk6__c=='InProgress' || result.account.phq9wk6__c==NULL){
                    //     this.checkListDetails.Track7.message=`Track ${this.trackDateWeek8} Weekly Goals`,
                    //     this.checkListDetails.Track7.css='inactive',
                    //     this.checkListDetails.Track7.color='margin:0;color:black'
                    // }
                    if(result.trackingList.length>7 && result.trackingList[7].WK__c==8){
                        this.checkListDetails.Track8.message=`Track ${this.trackDateWeek9} Weekly Goals`,
                        this.checkListDetails.Track8.css='active',
                        this.checkListDetails.Track8.color='margin:0;color:black'
                    }
                    else if(this.today>=new Date(this.week9Trackstdate)){//result.trackingList[6].WK__c==7){                     
                        this.checkListDetails.Track8.message=`Track ${this.trackDateWeek9} Weekly Goals`,
                        this.checkListDetails.Track8.css='inactive',
                        this.checkListDetails.Track8.color='margin:0;color:blue'
                    }
                    // else if(result.account.phq9wk6__c=='InProgress' || result.account.phq9wk6__c== NULL){
                    //     this.checkListDetails.Track8.message=`Track ${this.trackDateWeek9} Weekly Goals`,
                    //     this.checkListDetails.Track8.css='inactive',
                    //     this.checkListDetails.Track8.color='margin:0;color:black'
                    // }
                    if(result.trackingList.length>8 && result.trackingList[8].WK__c==9){
                        this.checkListDetails.Track9.message=`Track ${this.trackDateWeek10} Weekly Goals`,
                        this.checkListDetails.Track9.css='active',
                        this.checkListDetails.Track9.color='margin:0;color:black'
                    }
                    else if(this.today>=new Date(this.week10Trackstdate)){//result.trackingList[7].WK__c==8){
                        this.checkListDetails.Track9.message=`Track ${this.trackDateWeek10} Weekly Goals`,
                        this.checkListDetails.Track9.css='inactive',
                        this.checkListDetails.Track9.color='margin:0;color:blue'
                    }
                    // else if(result.account.phq9wk6__c=='InProgress' || result.account.phq9wk6__c==NULL){
                    //     this.checkListDetails.Track9.message=`Track ${this.trackDateWeek10} Weekly Goals`,
                    //     this.checkListDetails.Track9.css='inactive',
                    //     this.checkListDetails.Track9.color='margin:0;color:black'
                    // }

                    if(result.trackingList.length>9 && result.trackingList[9].WK__c==10){
                        this.checkListDetails.Track10.message=`Track ${this.trackDateWeek11} Weekly Goals`,
                        this.checkListDetails.Track10.css='active',
                        this.checkListDetails.Track10.color='margin:0;color:black'
                    }
                    else if(this.today>=new Date(this.week11Trackstdate)){//result.trackingList[8].WK__c==9){
                        this.checkListDetails.Track10.message=`Track ${this.trackDateWeek11} Weekly Goals`,
                        this.checkListDetails.Track10.css='inactive',
                        this.checkListDetails.Track10.color='margin:0;color:blue'
                    }
                    // else if(result.account.completeweekstatus12__c=='InProgress' || result.account.completeweekstatus12__c==''){
                    //     this.checkListDetails.Track10.message=`Track ${this.trackDateWeek11} Weekly Goals`,
                    //     this.checkListDetails.Track10.css='inactive',
                    //     this.checkListDetails.Track10.color='margin:0;color:black'
                    // }
                    if(result.trackingList.length>10 && result.trackingList[10].WK__c==11){
                        this.checkListDetails.Track11.message=`Track ${this.trackDateWeek12} Weekly Goals`,
                        this.checkListDetails.Track11.css='active',
                        this.checkListDetails.Track11.color='margin:0;color:black'
                    }
                    else if(this.today>=new Date(this.week12Trackstdate)){//result.trackingList[9].WK__c==10){
                        this.checkListDetails.Track11.message=`Track ${this.trackDateWeek12} Weekly Goals`,
                        this.checkListDetails.Track11.css='inactive',
                        this.checkListDetails.Track11.color='margin:0;color:blue'
                    }
                    else if(result.account.completeweekstatus12__c=='InProgress' || result.account.completeweekstatus12__c==''){
                        this.checkListDetails.Track11.message=`Track ${this.trackDateWeek12} Weekly Goals`,
                        this.checkListDetails.Track11.css='inactive',
                        this.checkListDetails.Track11.color='margin:0;color:black'
                    }
                    if(result.trackingList.length>11 && result.trackingList[11].WK__c==12){
                        this.checkListDetails.Track12.message=`Track ${this.trackDateWeek13} Weekly Goals`,
                        this.checkListDetails.Track12.css='active',
                        this.checkListDetails.Track12.color='margin:0;color:black'
                        
                    }
                    else if(this.today>=new Date(this.week13Trackstdate)){//result.trackingList[10].WK__c==11){
                        this.checkListDetails.Track12.message=`Track ${this.trackDateWeek13} Weekly Goals`,
                        this.checkListDetails.Track12.css='inactive',
                        this.checkListDetails.Track12.color='margin:0;color:blue'
                    }
                    else if(result.account.completeweekstatus12__c=='InProgress' || result.account.completeweekstatus12__c==''){
                        this.checkListDetails.Track12.message=`Track ${this.trackDateWeek13} Weekly Goals`,
                        this.checkListDetails.Track12.css='inactive',
                        this.checkListDetails.Track12.color='margin:0;color:black'
                    }
                    if(result.account.completeweekstatus12__c=="Completed"){
                        this.completeSurvey2Arrowcss='active';
                        this.completeSurvey2Textcolor='margin:0;color:black';
                         }
                         else if(result.trackingList.length>10 && result.trackingList[10].WK__c==11){
                            this.completeSurvey2Arrowcss='inactive';
                            this.completeSurvey2Textcolor='margin:0;color:blue';
                         }
                         else{
                            this.completeSurvey2Arrowcss='inactive';
                            this.completeSurvey2Textcolor='margin:0;color:grey';
                         }


                         if(result.account.completeweekstatus13__c=="Completed"){
                            this.isSession2=true;
                             }

                             if(result.responseList.length>1){
                                this.setSession2Arrowcss='active';
                                this.setSession2Textcolor='margin:0;color:black'; 
                             }else if(result.account.completeweekstatus13__c=="Completed"){
                                this.setSession2Arrowcss='inactive';
                                this.setSession2Textcolor='margin:0;color:blue';  
                             }else{
                                this.setSession2Arrowcss='inactive';
                                this.setSession2Textcolor='margin:0;color:grey';
                             }
                             
                             try{
                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>12 && result.trackingList[12].WK__c==1)){    
                                this.session2Track1css='active',
                                this.session2Track1TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week1Trackdate)){                                
                                this.session2Track1css='inactive',
                                this.session2Track1TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track1css='inactive',
                                this.session2Track1TextColor='margin:0;color:gery'
                             }
                            
                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>13 && result.trackingList[13].WK__c==2)){    
                                this.session2Track2css='active',
                                this.session2Track2TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week2Trackdate)){                                
                                this.session2Track2css='inactive',
                                this.session2Track2TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track2css='inactive',
                                this.session2Track2TextColor='margin:0;color:gery'
                             }
                              
                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>14 && result.trackingList[14].WK__c==3)){    
                                this.session2Track3css='active',
                                this.session2Track3TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week3Trackdate)){                                
                                this.session2Track3css='inactive',
                                this.session2Track3TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track3css='inactive',
                                this.session2Track3TextColor='margin:0;color:gery'
                             }

                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>15 && result.trackingList[15].WK__c==4)){    
                                this.session2Track4css='active',
                                this.session2Track4TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week4Trackdate)){                                
                                this.session2Track4css='inactive',
                                this.session2Track4TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track4css='inactive',
                                this.session2Track4TextColor='margin:0;color:gery'
                             }
                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>16 && result.trackingList[16].WK__c==5)){    
                                this.session2Track5css='active',
                                this.session2Track5TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week5Trackdate)){                                
                                this.session2Track5css='inactive',
                                this.session2Track5TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track5css='inactive',
                                this.session2Track5TextColor='margin:0;color:gery'
                             }

                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>17 && result.trackingList[17].WK__c==6)){    
                                this.session2Track6css='active',
                                this.session2Track6TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week6Trackdate)){                                
                                this.session2Track6css='inactive',
                                this.session2Track6TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track6css='inactive',
                                this.session2Track6TextColor='margin:0;color:gery'
                             }

                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && result.account.completeWeek18__c!=false){    
                                this.phq9session2message='Track PHQ 9 Survey',
                                this.phq9session2Arrowcss='active',
                                this.phq9session2word='margin:0;color:black'
                                        
                            }
                            else if(this.today>=new Date(this.session2week5Trackdate)){                                
                                this.phq9session2message='Track PHQ 9 Survey',
                                this.phq9session2Arrowcss='inactive',
                                this.phq9session2word='margin:0;color:blue'
                            }
                            else if(result.account.completeWeek18__c!=true){  
                                this.phq9session2message='Track PHQ 9 Survey',                             
                                this.session2Track6cssphq9session2Arrowcss='inactive',
                                this.phq9session2word='margin:0;color:gery'
                             }

                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>18 && result.trackingList[18].WK__c==7)){    
                                this.session2Track7css='active',
                                this.session2Track7TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week7Trackdate)){                                
                                this.session2Track7css='inactive',
                                this.session2Track7TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track7css='inactive',
                                this.session2Track7TextColor='margin:0;color:gery'
                             }

                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>19 && result.trackingList[19].WK__c==8)){    
                                this.session2Track8css='active',
                                this.session2Track8TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week8Trackdate)){                                
                                this.session2Track8css='inactive',
                                this.session2Track8TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track8css='inactive',
                                this.session2Track8TextColor='margin:0;color:gery'
                             }

                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>20 && result.trackingList[20].WK__c==9)){    
                                this.session2Track9css='active',
                                this.session2Track9TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week9Trackdate)){                                
                                this.session2Track9css='inactive',
                                this.session2Track9TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track9css='inactive',
                                this.session2Track9TextColor='margin:0;color:gery'
                             }

                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>21 && result.trackingList[21].WK__c==10)){    
                                this.session2Track10css='active',
                                this.session2Track10TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week10Trackdate)){                                
                                this.session2Track10css='inactive',
                                this.session2Track10TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track10css='inactive',
                                this.session2Track10TextColor='margin:0;color:gery'
                             }

                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>22 && result.trackingList[22].WK__c==11)){    
                                this.session2Track11css='active',
                                this.session2Track11TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week11Trackdate)){                                
                                this.session2Track11css='inactive',
                                this.session2Track11TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track11css='inactive',
                                this.session2Track11TextColor='margin:0;color:gery'
                             }

                             if(result.trackingList.Goal_Response_Period_Type__c!='Session 1' && (result.trackingList.length>23 && result.trackingList[23].WK__c==12)){    
                                this.session2Track12css='active',
                                this.session2Track12TextColor='margin:0;color:black'
                            }
                            else if(this.today>=new Date(this.session2week12Trackdate)){                                
                                this.session2Track12css='inactive',
                                this.session2Track12TextColor='margin:0;color:blue'
                            }
                            else{                               
                                this.session2Track12css='inactive',
                                this.session2Track12TextColor='margin:0;color:gery'
                             }
                             
                             if(result.account.completeweekstatus24__c=="Completed"){
                                this.survey2CompletetionCss='active';
                                this.survey2CompletetionWord='margin:0;color:black';
                                 }
                                 else if(this.today>=new Date(this.session2week11Trackdate)){
                                    this.survey2CompletetionCss='inactive';
                                    this.survey2CompletetionWord='margin:0;color:blue';
                                 }
                                 else{
                                    this.survey2CompletetionCss='inactive';
                                    this.survey2CompletetionWord='margin:0;color:grey';
                                 }
                             
                            }catch(e){
                                console.log(e);
                            }
                }catch(error){
                    console.log(error);
                }

                    
                     

                    
                    
                
                }
        //     if(result){
        //         if(result.completeweekstatus6__c=='Completed'){
        //             result.responseList.length>0?(this.checkListDetails.track1.message='Track Weekly Goals',this.checkListDetails.track1.css='active',this.checkListDetails.track1.color='margin:0;color:black'):(this.checkListDetails.track1.message='set session 1 goals',this.checkListDetails.track1.css='inactive',this.checkListDetails.track1.color='margin:0;color:grey')
        //         }
        //         if(result.completeweekstatus6__c=='Completed'){
        //             result.responseList.length>0?(this.checkListDetails.track1.message='Set session 1 goals',this.checkListDetails.track1.css='active',this.checkListDetails.track1.color='margin:0;color:black'):(this.checkListDetails.track1.message='set session 1 goals',this.checkListDetails.track1.css='inactive',this.checkListDetails.track1.color='margin:0;color:grey')

        //     }
        // }
                   

                    
                        
                       
                    
                // result.completeweekstatus1__c=='InProgress'?(this.checkListDetails.week1.message='complete survey 1',this.checkListDetails.week1.css='inactive',this.checkListDetails.week1.color='margin:0;color:blue'):(this.checkListDetails.week1.message='complete survey 1',this.checkListDetails.week1.css='inactive',this.checkListDetails.week1.color='margin:0;color:grey')
            // result.completeWeek1__c==true=='Completed'?(this.checkListDetails.week1.message='Complete Survey 1',this.checkListDetails.week1.css='active',this.checkListDetails.week1.color='margin:0;color:black'):(this.checkListDetails.week1.message='Complete Survey 11',this.checkListDetails.week1.css='inactive',this.checkListDetails.week1.color='margin:0;color:blue')
            // result.completeweekstatus1__c=='InProgess'?(this.checkListDetails.week1.message='Complete Survey 1',this.checkListDetails.week1.css='active',this.checkListDetails.week1.color='margin:0;color:black')
            
            // if(result){
            //  result.completeweekstatus1__c=='InProgress'?(this.checkListDetails.week1.message='complete survey 1',this.checkListDetails.week1.css='inactive',this.checkListDetails.week1.color='margin:0;color:blue'):(this.checkListDetails.week1.message='complete survey 1',this.checkListDetails.week1.css='inactive',this.checkListDetails.week1.color='margin:0;color:grey')
            //  }
            //  if(result){
            //     result.completeweekstatus1__c==NULL ?(this.checkListDetails.week1.message='complete survey 1',this.checkListDetails.week1.css='inactive',this.checkListDetails.week1.color='margin:0;color:black'):(this.checkListDetails.week1.message='complete survey 1',this.checkListDetails.week1.css='inactive',this.checkListDetails.week1.color='margin:0;color:grey')
            //     }




            
            // result.confirmMddDiagnosis__c==true?(this.checkListDetails.confirmedmdd.message='$50 gift card earned!',this.checkListDetails.confirmedmdd.css='active',this.checkListDetails.confirmedmdd.color='margin:0;color:black'):(this.checkListDetails.confirmedmdd.message='Earn $50 gift card',this.checkListDetails.confirmedmdd.css='inactive',this.checkListDetails.confirmedmdd.color='margin:0;color:grey')
            // result.completeWeek6__c==true?(this.checkListDetails.week6.message='$50 gift card earned!',this.checkListDetails.week6.css='active',this.checkListDetails.week6.color='margin:0;color:black'):(this.checkListDetails.week6.message='Earn $50 gift card',this.checkListDetails.week6.css='inactive',this.checkListDetails.week6.color='margin:0;color:grey')
            // result.completeWeek13__c==true?(this.checkListDetails.week13.message='$75 gift card earned!',this.checkListDetails.week13.css='active',this.checkListDetails.week13.color='margin:0;color:black'):(this.checkListDetails.week13.message='Earn $75 gift card',this.checkListDetails.week13.css='inactive',this.checkListDetails.week13.color='margin:0;color:grey')
            // result.completeWeek18__c==true?(this.checkListDetails.week18.message='$50 gift card earned!',this.checkListDetails.week18.css='active',this.checkListDetails.week18.color='margin:0;color:black'):(this.checkListDetails.week18.message='Earn $50 gift card',this.checkListDetails.week18.css='inactive',this.checkListDetails.week18.color='margin:0;color:grey')
            // result.completeWeek24__c==true?(this.checkListDetails.week24.message='$75 gift card earned!',this.checkListDetails.week24.css='active',this.checkListDetails.confirmedmdd.color='margin:0;color:black'):(this.checkListDetails.week24.message='Earn $75 gift card',this.checkListDetails.week24.css='inactive',this.checkListDetails.week24.color='margin:0;color:grey')
            // console.log('praveen');
            // // console.log(JSON.stringify(this.checkListDetails));
            // if(result){
            //     result.Survey1Completion_Date__c == 'Completed'?(this.checkListDetails.week1.message='Complete Status 1',this.checkListDetails.week1.css='active',this.checkListDetails.week1.color='margin:0;color:black'):(this.checkListDetails.week1.css='inactive',this.checkListDetails.week1.color='margin:0;color:green')
        
            // }
            // else if(result){
            //     result.completeweekstatus1__c == 'InProgress'?(this.checkListDetails.week1.message='Complete Status 1',this.checkListDetails.week1.css='active',this.checkListDetails.week1.color='margin:0;color:blue'):(this.checkListDetails.week1.css='inactive',this.checkListDetails.week1.color='margin:0;color:grey')
            // }
            // else{
            //     result.completeweekstatus1__c == ''?(this.checkListDetails.week1.message='Complete Status 1',this.checkListDetails.week1.css='active',this.checkListDetails.week1.color='margin:0;color:black'):(this.checkListDetails.week1.css='inactive',this.checkListDetails.week1.color='margin:0;color:grey')
            // }

            // if(this.accountCheckListDetails!=null && this.accountCheckListDetails.length>0){
                //  checkfileds=this.accountCheckListDetails[0];
                // this.week6=checkfileds["completeWeek6__c"]==true?"active":"inactive";
                // this.week13=checkfileds["completeWeek13__c"]==true?"active":"inactive";
                // this.week18=checkfileds["completeWeek18__c"]==true?"active":"inactive";
                // this.week24=checkfileds["completeWeek24__c"]==true?"active":"inactive";
                // this.confirmDiagnosis=checkfileds["confirmMddDiagnosis__c"]==true?"active":"inactive";
                                // }
        })
        .catch(error => {
            this.error = error;
        });
        
        
}

        
    
    subscribeMessage(){
        subscribe(this.context, refreshChecklist, (message) => {this.handleMessage(message)},{scope:APPLICATION_SCOPE})
    }

    displayRemaining(){
        this.isTrue=false;
        this.hideSeeMore=true;
        this.hideSeeless=false;
    }

    hideRemaining(){
        this.isTrue=true;
        this.hideSeeMore=false;
        this.hideSeeless=true;
    }

    fileOnLoadHandler(){
        console.log("in fileOnLoadHandler");
    }

    handleMessage(message){
        this.transmittedValue = message.saveTransmitter.value;
        console.log('transmitted value is '+this.transmittedValue);
        if(this.transmittedValue){
            console.log('inside Loop'); 
            refreshApex(this.taskList);
        }
    }

    // @wire(CurrentPageReference)
    // wiredPageRef(currentPageReference) {
    //     this.currentPageReference = currentPageReference;
    //     //this.loading = false;
    //     console.log('before refresh in wiredPageRef checklist');
    //     refreshApex(this.taskList)
    //     .then(()=>{
    //             console.log('Inside refresh apex checklist '+ this.taskList);
    //     });
    //     console.log('after refresh in wiredPageRef checklist');
    // }

    @wire(getAccountOfUser, {userId: '$userId'}) 
    wiredAccount(result)  {
        this.accountList = result;
        const{error,data} = result;  
        if(data) {
            let acct = JSON.parse(data);
            this.sessionNumber = (acct.isSurvey2Complete)? 2 : 1;
            this.currentWk = (this.sessionNumber === 1) ? acct.currentWk : acct.currentWk_sess2;
            this.currentWk = (Number(this.currentWk) >= Number('13')) ? '13' : this.currentWk;
            this.error = undefined;
            this.accountId = acct.id;
            //this.currentWk = acct.currentWk;
            if(Number(this.currentWk) === Number('0') && this.sessionNumber === 1){
                this.isWeekZero = true;
                this.header= 'Getting started';
            }
            else if (Number(this.currentWk) === Number('0') && this.sessionNumber === 2){
                this.isWeekZero = true;
                this.header = 'Session 2 setup';
            }
            else if (Number(this.currentWk) >= Number('13') && this.sessionNumber === 1){
                this.isWeekZero = true;
                this.header = 'Session 2 setup';
            }
            else if (Number(this.currentWk) >= Number('12') && this.sessionNumber === 2){
                this.isWeekZero = true;
                this.header = 'Session 2 final week';
            }
            else
                this.isWeekZero = false;

            // if(this.currentWk === '25')
            //     this.isWeek25 = true;
            // else 
            //     this.isWeek25 = false;
                
            //console.log('mdd_checklist:: userId is:'+this.userId+' the account id:'+this.accountId+' currentWk is:'+this.currentWk + ' periodType is:'+this.periodType);
        }
        else if(error)  {
            this.accountId = undefined;
            this.currentWk = undefined;
            this.error = error;
        }
    }
    @wire(getTasksList, {accountId: '$accountId', currentWk: '$currentWk', sessionNo: '$sessionNumber' })
    wiredTasks(result) {
        this.taskList = result;
        console.log('Tasklist value is '+this.taskList);
        const {data,error} = result;
        if (data) {
            this.tcList = data;
            console.log(JSON.stringify(data));
            console.log('Before and lenght'+ data.length);
            console.log(this.tcList);
            let taskKeys = [];
            this.tcList = data.map((task, index) => {
                taskKeys.push(task.Task_key__c);
                return {
                   task: task,
                   myStatus: task.Status == 'Completed' ? true : false,
                   myclass: task.Status == 'Completed' ? 'active' : 'inactive',
                  // optional: task.Optional__c ? true : false
                   //isVideoTask: (task.video) ? true: false,  
                }
            });

            console.log('Tasks after transformation:'+JSON.stringify(this.tcList));
            console.log('the taskKeys are '+JSON.stringify(taskKeys));
            getTasksMetadata({taskKeys: taskKeys})
            .then( result =>{
                console.log('the tasks metadata is '+JSON.stringify(result));
                this.tcList = this.tcList.map((taskwrap, index) => {                    
                    for(let i=0; i<result.length; i++)  {
                        let x =result[i].video__c;
                        let y = result[i].Optional__c;
                        //console.log('Optional value issss '+y);
                        //console.log('the task video is '+x);
                        if(taskwrap.task.Task_key__c === result[i].Task_key__c){
                            //task.video = result[i].video__c;
                            //task.isVideoTask = true;
                            //break;
                            return {
                                
                                task: taskwrap.task,
                                myStatus: taskwrap.myStatus,
                                myclass: taskwrap.myclass,
                                video: result[i].video__c,
                                isVideoTask: (result[i].video__c) ? true: false,
                                isOptional : (result[i].Optional__c) ? true : false
                             }

                        }
                        //console.log('Optional value is '+this.tcList.isOptional);
                        //console.log('Status of task is '+this.tcList.myStatus);
                    }
                    return task;
                });
                console.log('Tasks after more transformations:'+JSON.stringify(this.tcList));
            })
            .catch(error => {

                this.error = error;
                console.log(this.error);
            });
            
            this.error = undefined;
            
        } else if (error) {
            this.error = error;
            this.tcList = undefined;
            console.log('Error');
            console.log(this.error);
        }
    }

   

    handleClick(event)  {
        let dataset = event.target.dataset;
        console.log('the element is '+JSON.stringify(dataset));
        this.template.querySelector("c-mdd-video-popup").playVideo(dataset.url, dataset.key, dataset.account);
    }
    Closepopup(){
        this.isModalOpen = false;
    }

    handleRefreshTasksList(event)   {
        console.log('inside the handleRefreshTasksList of mdd_cheklist');
        refreshApex(this.taskList);
    }
    
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleSync(event){
         /*  this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'MDD_Syncing_and_sharing__c'
                    },
                });  */ 
                window.open('https://www.patientslikeme.com/account/data_device_linking');
    }
    handleVideo(event){  //new
        window.open('hhttps://patientslikeme--wal.lightning.force.com/resource/Takeda_MDD_FAQ');
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        //alert('No. of files uploaded : ' + uploadedFiles.length);
    }

    downloadPdf(event)   {
        try {
            // const dummy = this.dummyPdf;
            // window.print(dummy);

            

            /*let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
            mywindow.document.write('<html><head><title>MY Goals</title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write('<p>Hello, ready to print?</p>');
            for(let i=0;i<chartObjs.length; i++)   {
                let img=chartObjs[i].downloadChart();
            }
            //mywindow.document.write(document.getElementById(divId).innerHTML);
            mywindow.document.write('</body></html>');*/
        }
        catch(error)    {
            console.error('Error occured while downloading the chart: '+error.message);
        }
    }
}