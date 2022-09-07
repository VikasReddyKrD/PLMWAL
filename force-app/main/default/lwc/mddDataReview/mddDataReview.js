import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import updateMddDiagnosis from '@salesforce/apex/SurveyController.updateMddDiagnosis';

export default class MddDataReview extends NavigationMixin(LightningElement) {
    isStepDataReview = true;
    isStepStudyCompleted = false;
    handleCancel() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Surveys__c'
            },
        });
    }
    handleContinue() {
        this.isStepDataReview = false;
        updateMddDiagnosis()
        .then(data=>{
            
        })
        .catch(error=>{
            console.log('error',error);
        })
        this.isStepStudyCompleted = true;

        
    }
    handleExit() {
        window.open('https://www.patientslikeme.com/users/sign_in');
    }
    handleSaveAndExit() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            },
        });
    }
}