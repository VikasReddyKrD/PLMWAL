import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import sendEmail from '@salesforce/apex/EmailTriggerTransplant.sendEmail';
import transplantUserStamp from '@salesforce/apex/TransplantSurveyController.transplantUserStamp';
import { verifyLastVisitPage,updateNextPageName } from 'c/transplantCurrentPage';
export default class TransplantNavigation extends NavigationMixin(LightningElement) {
@api buttonsData;
@api isContinue;
@api isCancel;
@api exitLabel;
@api isClose;
lastLog = ["transplant-consent","transplant-survey-consent","transplantsurveywelcomepage","transplant-baseline-survey","transplant-webinar-welcome","transplant-pre-webinar","transplantwebinar","transplant-post-webinar-questions","transplant-survey-link","transplant-survey-welcome","transplant-questions","transplant-survey-completion","transplantsurveydatasync"];
isShowModal = false;
connectedCallback(){
    if(!this.exitLabel){this.exitLabel = 'Exit'}
    verifyLastVisitPage(this,NavigationMixin)
        .then(result=>{})
		.catch(error=>{})
}
navigateToNextstep(){
    updateNextPageName(window.location.href.split('/')[5])
    .then(result=>{
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {name: this.buttonsData}});
    })
    .catch(error=>{})
   
}
handleExit() {
    this.isShowModal = true;
        transplantUserStamp({ lastStamp: window.location.href.split('/s/')[1] })
            .then(data => {
                console.log("data ",data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })

}
hideModalBox() {
    this.isShowModal = false;
}
plmRedirection() {
    window.location.replace("https://www.patientslikeme.com/users/sign_in");
}
handleCancel(){
    this.isShowModal = true;
        transplantUserStamp({ lastStamp: window.location.href.split('/s/')[1] })
            .then(data => {
                console.log("data ",data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
}
isRendered = false;
renderedCallback(){
    var currentPageName = window.location.href.split('/')[5]
    var updatedPageName;
    this.lastLog.forEach((currentElemnt,currentElemntidx) =>{
        let currentValueIndex = currentElemntidx;
        if(currentElemnt == currentPageName){
            currentValueIndex++;
            updatedPageName  = this.lastLog[currentValueIndex];
        }
     });
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


}