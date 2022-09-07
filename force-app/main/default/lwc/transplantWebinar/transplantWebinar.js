import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { loadScript } from 'lightning/platformResourceLoader';
import YouTubePath from '@salesforce/resourceUrl/YouTubeJS';
import TransplantEmailscheduleJob from '@salesforce/apex/TransplantSurveyController.TransplantEmailscheduleJob';
import TransplantRemainderEmailscheduleJob from '@salesforce/apex/TransplantSurveyController.TransplantRemainderEmailscheduleJob';
import { verifyLastVisitPage, updateNextPageName } from 'c/transplantCurrentPage';
import transplantUserStamp from '@salesforce/apex/TransplantSurveyController.transplantUserStamp';

export default class TransplantWebinar extends NavigationMixin(LightningElement) {
    lastLog = ["transplant-consent", "transplant-survey-consent", "transplantsurveywelcomepage", "transplant-baseline-survey", "transplant-webinar-welcome", "transplant-pre-webinar", "transplantwebinar", "transplant-post-webinar-questions", "transplant-survey-link", "transplant-survey-welcome", "transplant-questions", "transplant-survey-completion", "transplantsurveydatasync"];

    progress = 75;
    youTubeId = '8B4cDIGpg3A';
    isShowModal = false;
    isContinue = false;
    connectedCallback() {
        verifyLastVisitPage(this, NavigationMixin)
            .then(result => { })
            .catch(error => { })
    }
    handleExit() {
        this.isShowModal = true;
    }
    hideModalBox() {
        this.isShowModal = false;
    }
    plmRedirection() {
        window.location.href = "https://www.patientslikeme.com/users/sign_in";
    }

    continueValidationHandler(event) {
        console.log("testing")
        console.log("event.detail", event.detail);
        this.isContinue = event.detail;
    }

    handleContinue() {
        updateNextPageName(window.location.href.split('/')[5])
            .then(result => {
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'Transplant_Post_Webinar_Questions__c'
                    },
                });  
            })
            .catch(error => { })
        
        TransplantEmailscheduleJob().then(result => {
            console.log(result);
        })
            .catch(error => {
                console.log("error " + error.body);
            });

        TransplantRemainderEmailscheduleJob().then(result => {
            console.log(result);
        })
            .catch(error => {
                console.log("error " + error.body);
            });
    }
}