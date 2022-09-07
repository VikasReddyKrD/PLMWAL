import { LightningElement ,api,track, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import CONTENTHEADER1 from '@salesforce/label/c.conent_Header4';
import CONTENTHEADER2 from '@salesforce/label/c.Conent_Header2';
import CONTENTHEADER3 from '@salesforce/label/c.Conent_Header3';
import CONTENTHEADER4 from '@salesforce/label/c.Content_Header4';
import CONTENTHEADER5 from '@salesforce/label/c.Consent_Header5';
import CONTENTHEADER6 from '@salesforce/label/c.Content_Header3';
import transplantUserStamp from '@salesforce/apex/TransplantSurveyController.transplantUserStamp';
import content1 from '@salesforce/label/c.Content1_step2';
import content2 from '@salesforce/label/c.Content2_step2';
import content3 from '@salesforce/label/c.Content3_step2';
import fetchStudyRec from '@salesforce/apex/StudyConsentController.fetchStudyConsentRecords';
import lastloginpage from '@salesforce/apex/StudyConsentController.getExistingPage';
import fetchCheckedRecord from '@salesforce/apex/StudyConsentController.fetchCheckedRecord';
import starsymbol from '@salesforce/resourceUrl/starsymbol';
import 	transplantlanding1 from '@salesforce/resourceUrl/transplantlanding1';
import { verifyLastVisitPage } from 'c/transplantCurrentPage';
//import CONTENTHEADER3 from '@salesforce/label/Conent_Header3';

export default class StudyConsent extends NavigationMixin(LightningElement){
    lastLog = ["transplant-consent","transplant-survey-consent","transplantsurveywelcomepage","transplant-baseline-survey","transplant-webinar-welcome","transplant-pre-webinar","transplantwebinar","transplant-post-webinar-questions","transplant-survey-link","transplant-survey-welcome","transplant-questions","transplant-survey-completion","transplantsurveydatasync"];
    label = {
        CONTENTHEADER1,
        CONTENTHEADER2,
        CONTENTHEADER3,
        CONTENTHEADER4,
        CONTENTHEADER5,
        CONTENTHEADER6,
        content1,content2,content3       
    };
     disable = true;
     selectedStep = 'Step1';
     acceptLabel='Accept and Continue';
     exitLabel='Reject and Exit';  
     exit='Exit';
     isChecked;
     transplantlanding=false;
    studyConsentId = '';
    @api consentDisclosure; 
    @api disclosure;
    buttoncolor = "btn_capsulecolor slds-float_right";
    isGreyed = false; 
    starsymbol = starsymbol;
    transplantlanding1url = transplantlanding1;
    isShowModal = false;
    isSpinner = true;
    
    connectedCallback(){
        verifyLastVisitPage(this,NavigationMixin)
        .then(result=>{})
		.catch(error=>{})
        this.isSpinner = true;
        fetchStudyRec()
        .then(result => {
            this.studyConsentId = result;
            console.log('result ============'+JSON.stringify(result));
            console.log('this.studyConsentId '+this.studyConsentId);           
           this.isSpinner = true;
           lastloginpage()
           .then(lastloginpage => {
            if((this.studyConsentId.Existing_Record__c && !this.consentDisclosure && !lastloginpage) || lastloginpage == 'transplantsurveywelcomepage'){
                console.log(this.studyConsentId.Existing_Record__c);
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'TransplantSurveyWelcomePage__c'
                    },
                });
            }
            else{
                if(lastloginpage == 'transplant-questions'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'transplant_questions__c'
                        },
                    });
                }
                else if(lastloginpage == 'transplant-webinar-welcome'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'Transplant_Webinar_Welcome__c'
                        },
                    });
                }
                else if(lastloginpage == 'transplant-survey-consent'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'Transplant_survey_consent__c'
                        },
                    });
                }
                else if(lastloginpage == 'transplant-baseline-survey'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'Transplant_Baseline_Survey__c'
                        },
                    });
                }
                else if(lastloginpage == 'transplant-pre-webinar'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'Transplant_Pre_Webinar__c'
                        },
                    });
                }
                else if(lastloginpage == 'transplantwebinar'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'TransplantWebinar__c'  
                        },
                    });
                }
                else if(lastloginpage == 'transplant-post-webinar-questions'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'Transplant_Post_Webinar_Questions__c'
                        },
                    });
                }
                else if(lastloginpage == 'transplant-survey-link'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'Transplant_Survey_Link__c'
                        },
                    });
                }
                else if(lastloginpage == 'transplant-survey-welcome'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'Transplant_Survey_Welcome__c'
                        },
                    });
                }
                else if(lastloginpage == 'transplant-survey-completion'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'Transplant_Survey_Completion__c'
                        },
                    });
                }
                else if(lastloginpage == 'transplantsurveydatasync'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'TransplantSurveyDataSync__c'
                        },
                    });
                }
                else if(lastloginpage == 'transplant-caretaker-survey-thankyou'){
                    this[NavigationMixin.Navigate]({    
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'Transplant_Caretaker_Survey_Thankyou__c'
                        },
                    });
                }
                else if(window.location.href.includes("transplant-consent")){
                    this.isSpinner = false;
                }
            }

        })
    })
        .catch(error => {
            console.log("error =========== "+error.body);
        });
    }

    exitHandler(){
        //window.location.href='https://www.patientslikeme.com/users/sign_in';
        this.isShowModal = true;
        
    }
    // exitLabel() {
    //     this.isShowModal  = true;
    // }
    hideModalBox(){
        this.isShowModal = false;
    }
    plmRedirection(){
        window.location.replace("https://www.patientslikeme.com/users/sign_in");
        transplantUserStamp({ lastStamp: window.location.href.split('/s/')[1] })
            .then(data => {
                console.log("data ",data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
    }
    redirecttoconsent(){
        var currentPageName = window.location.href.split('/')[5]
        var updatedPageName;
        this.lastLog.forEach((currentElemnt,currentElemntidx) =>{
            let currentValueIndex = currentElemntidx;
            if(currentElemnt == currentPageName){
                currentValueIndex++;
                updatedPageName  = this.lastLog[currentValueIndex];
            }
         });
        transplantUserStamp({ lastStamp: updatedPageName })
            .then(data => {
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
        window.scroll(0,0);
        // this.transplantlanding=true;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
               // name: 'TransplantIntroScreen__c'
                name: 'Transplant_survey_consent__c'
            },
        });


    }

    checkboxValidator(event){
        var currentPageName = window.location.href.split('/')[5]
        var updatedPageName;
        this.lastLog.forEach((currentElemnt,currentElemntidx) =>{
            let currentValueIndex = currentElemntidx;
            if(currentElemnt == currentPageName){
                currentValueIndex++;
                updatedPageName  = this.lastLog[currentValueIndex];
            }
         });
        transplantUserStamp({ lastStamp: updatedPageName })
            .then(data => {
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
        this.isChecked= event.target.checked;
        if(event.target.checked === true){
             this.disable = false;
             this.buttoncolor = "btn_capsule slds-float_right";
        }
        else{
           this.disable = true;
           this.buttoncolor = "btn_capsulecolor slds-float_right";
        }
    }
    
    scrollHandler(event){
        let ele = this.template.querySelector('[data-scroll]');
        (Math.ceil(ele.offsetHeight + ele.scrollTop) >= ele.scrollHeight) && (this.isGreyed=true)
    }

    handleAccept(event){
        if(this.isChecked){
            fetchCheckedRecord()
            .then(result => {
               // alert('HI Hello');
            })
            .catch(error => {
                console.log("error "+error.body);
            });
        }
            if(event.target.label == this.acceptLabel){
                this.studyConsentId.Existing_Record__c = true;
                console.log(this.studyConsentId.Existing_Record__c);
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                       // name: 'TransplantIntroScreen__c'
                        name: 'TransplantSurveyWelcomePage__c'
                    },
                });
           
        }
      /*  else if(this.checkfortotalScreen2){
            console.log("label "+event.target.label);
            this.checkforScreen2 = false;
            this.acceptLabel = 'Continue';
            this.exitLabel = 'Save and Exit';
            this.progressBarValue = 20;
            this.selectedStep = '2';
        }*/
       /* else{
           // this.checkfortotalScreen2 = false;
            this.progressBarValue = 30;
            fetchRec()
            .then(result => {
                this.questions = result;
                console.log('result '+JSON.stringify(result));
            })
            .catch(error => {
                console.log("error "+error);
            });
        }*/
    }

    
    
  
}