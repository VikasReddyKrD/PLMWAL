import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class TransplantIntroPage extends NavigationMixin(LightningElement) {
    progress = 10;
  handleContinue(){
        this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'Transplant_Webinar_Questions__c'
                        // name: 'transplant-pre-webinar-questions'
                    },
                }); 
    }
}