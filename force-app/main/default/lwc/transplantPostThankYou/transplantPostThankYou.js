import { LightningElement } from 'lwc';
import 	transplantlanding1 from '@salesforce/resourceUrl/transplantlanding1';
export default class TransplantPostThankYou extends LightningElement {
    transplantlanding1url = transplantlanding1;

    redirectToDataSync(){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Transplant_Thank_You__c'
            },
            state: {
                ncc: this.questionType
            }
        });
       
    }
    handleCancel(){
        window.location.href = "https://www.patientslikeme.com/users/sign_in";
    }
}