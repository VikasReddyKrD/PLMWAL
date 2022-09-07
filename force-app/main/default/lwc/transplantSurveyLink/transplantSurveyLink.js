import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import sendEmail from '@salesforce/apex/EmailTriggerTransplant.sendEmail';
import transplantUserStamp from '@salesforce/apex/TransplantSurveyController.transplantUserStamp';
import { verifyLastVisitPage } from 'c/transplantCurrentPage';
export default class TransplantSurveyLink extends NavigationMixin(LightningElement) {
    lastLog = ["transplant-consent","transplant-survey-consent","transplantsurveywelcomepage","transplant-baseline-survey","transplant-webinar-welcome","transplant-pre-webinar","transplantwebinar","transplant-post-webinar-questions","transplant-survey-link","transplant-survey-welcome","transplant-questions","transplant-survey-completion","transplantsurveydatasync"];
    isShowModal = false;
   
    isprewebinarexit123(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Transplant_Survey_Welcome__c'
            },
        });
    }
    isRendered = false;
renderedCallback(){
    if(window.location.href.includes('transplant-survey-link') && !this.isRendered){
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
hideModalBox(){
    this.isShowModal = false;
}
plmRedirection(){
    transplantUserStamp({ lastStamp: window.location.href.split('/s/')[1] })
            .then(data => {
                console.log("data ",data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })

    window.location.href = "https://www.patientslikeme.com/users/sign_in";

}

connectedCallback(){
    verifyLastVisitPage(this,NavigationMixin)
    .then(result=>{})
    .catch(error=>{})
}

redirectToNextThankyou(){
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
    this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'Transplant_Survey_Welcome__c'
        },
    });
}
handleExit(){
    this.isShowModal = true;
}
}