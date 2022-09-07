import { LightningElement } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
export default class AlphaSurveyIntroduction extends NavigationMixin(LightningElement) {
    nextHandler(event){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Alpha_Survey1__c'
            },
        });
    }
}