import { LightningElement,api,wire } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import getQuestionsWithSections from '@salesforce/apex/TransplantSurveyController.getQuestionsWithSections';
import sendEmail from '@salesforce/apex/EmailTriggerTransplant.sendEmail';
import 	transplantlanding1 from '@salesforce/resourceUrl/transplantlanding1';
import TransplantTankYouEmailAlert from '@salesforce/apex/TransplantSurveyController.TransplantTankYouEmailAlert';
import transplantUserStamp from '@salesforce/apex/TransplantSurveyController.transplantUserStamp';
export default class TransplantThankyou extends NavigationMixin(LightningElement) {
   contacts;
    progress = 100;
    selectedStep = 'Step1';
    disable = true;
    selectedStep = 'Step1';
    acceptLabel='Continue';
    exitLabel='Cancel';  
    exit='Exit';
    isShowModal;
    controlFlow = true;
    @api Exitthankyou;
    @api surveyNumber;
    @api thankyouScreen;
    transplantlanding1url = transplantlanding1;
    isprewebinarexit = false;
    issameThankYou = true;
    beforePrewebinar=false;
    newWelcomePage= false;
    buttoncolor = "btn_capsulecolor slds-float_right";
    navigateToSurveyWelcomePage() {
        this.apexWindowStamp();
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'transplant_questions__c'
            },
        });

    }

    afterCompleteSurveyThankyou(){
        TransplantTankYouEmailAlert().then(result => {
            console.log(result);
         })
         .catch(error => {
             console.log("error "+error.body);
         });
    }
    getQuestionsData(change) {
        getQuestionsWithSections({ type: this.surveyType, surveyId: this.surveyid })
            .then(data => {
             
            });
        }
    
connectedcallback(){
    // console.log("testing in connectedCallback")
    // if(this.questionType == "Transplant-Baseline") {
    //     this.Exitthankyou = true;
    //     console.log("spass>>",Exitthankyou);
    // }
    // if(data.lastStamp == 'transplant-thank-you?ncc=Transplant-Post-webinar'){
    //     this.isPreWebinarNew = true;
    //     this.issameThankYou = true;
    // }
}
@wire(CurrentPageReference)
CurrentPageReference;

get istransplantbaseline(){
    return this.CurrentPageReference.state.questionType == "Transplant-Baseline" ? true : false;
}
get isthankyouscreen(){
    return this.CurrentPageReference.state.nc == "Transplant-Baseline" ? true : false;
}
get isPreWebinarNew(){
    return this.CurrentPageReference.state.ncc == "Transplant-Post-webinar" ? true : false;
}
// get isprewebinarexit(){
//    return this.CurrentPageReference.state.ncc == "Transplant-Post-webinar" ? true : false;
// }
get afterPatientSurveyThankYou(){
    return this.CurrentPageReference.state.datasync == "Transplant-Survey-1" ? true : false;
}

get careTakerThankYou(){
    return this.CurrentPageReference.state.careTaker == "Transplant-Survey-1" ? true : false;
}
handleExit(){
        this.isShowModal = true;

        //window.location.href = "https://www.patientslikeme.com/users/sign_in";
    }
handleCancel(){
        this.isShowModal = true;
        //window.location.href = "https://www.patientslikeme.com/users/sign_in";
    }
   
        navigateToNextstep() {
            // this.beforePrewebinar = true;
            // this.controlFlow = false;
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Transplant_Pre_Webinar__c'
                },
            });

            
    var a=window.location.href.split('/')[5]
        transplantUserStamp({lastStamp:a})
        .then(data => {                            
        })
        .catch(error => {
            console.log("error in insertSurveyAnswers", JSON.stringify(error));
        })
        }
        redirectToDataSync(){
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'TransplantSurveyDataSync__c'
                },
            });
        }
     isprewebinarexit123(){
        this.isprewebinarexit = true;
            this.issameThankYou = false; 
           this.apexWindowStamp();
     }
     apexWindowStamp(){
     transplantUserStamp({lastStamp:window.location.href.split("/s/")[1]})
     .then(data => { 
         console.log("data ",data);                            
     })
     .catch(error => {
         console.log("error in insertSurveyAnswers", JSON.stringify(error));
     })  
    }
       
        redirectToNextThankyou(){
            window.scroll(0,0);
            this.isprewebinarexit = true;
            this.issameThankYou = false;
            //this.isPreWebinarNew = false;
        }
        // redirectToPreWebinar(){
        //     this[NavigationMixin.Navigate]({
        //         type: 'comm__namedPage',
        //         attributes: {
        //             name: 'Transplant_Pre_Webinar__c'
        //         },
        //     });
        // }
        hideModalBox(){
            this.isShowModal = false;
        }
        plmRedirection(){
            window.location.replace("https://www.patientslikeme.com/users/sign_in");
        }
    
    // navigateToNextstep(){
    //     window.location.href = "https://www.patientslikeme.com/users/sign_in";
    // }
    isRendered = false;
    renderedCallback(){
        if(window.location.href.includes('ncc=Transplant-Post-webinar') && !this.isRendered){
            this.isRendered = true;
        console.log("rendered testing in")
        sendEmail()
        .then(result =>{
         console.log('result',result);  
        
        })
        .catch(e=>{
            console.log('error',e);
        })
    }
    }
}