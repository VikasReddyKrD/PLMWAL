import { LightningElement } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';

export default class AlphaSurveyThankYou extends NavigationMixin(LightningElement) {


nextHandler(event){
     this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'disclosure__c'
        },
    });
}

exitHandler(event){

}
}