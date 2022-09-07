import { LightningElement } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
export default class AlphaMedicalPage extends NavigationMixin(LightningElement)  {
    handleNext(){
        window.scroll(0, 0);
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'disclosure__c'
            },
        });
    }
}