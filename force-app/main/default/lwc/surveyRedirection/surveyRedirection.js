import { LightningElement } from 'lwc';
import getAdvanceSurvey from '@salesforce/apex/SSOUserCreation.getAdvanceSurvey';
import { NavigationMixin } from 'lightning/navigation';
export default class SurveyRedirection extends NavigationMixin(LightningElement) {
    data;
    mddResult = false;
    alphaResult = false;
    transplantResult = false;
    connectedCallback(){
        getAdvanceSurvey()
            .then(result => {
                console.log('sdvdv',result);
                if(result == 'Alpha-Survey-1'){
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'alpha_survey_thank_you__c'
                        },
                    });
                }

            })
            .catch(error => {
                this.error = error;
            });
    }

    }