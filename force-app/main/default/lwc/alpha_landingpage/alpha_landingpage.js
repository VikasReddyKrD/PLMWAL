import { LightningElement } from 'lwc';
import starsymbol from '@salesforce/resourceUrl/starsymbol';
import 	alphalanding1 from '@salesforce/resourceUrl/alphalanding1';
import { NavigationMixin } from 'lightning/navigation';

export default class Alpha_landingpage extends NavigationMixin(LightningElement) {

    starsymbol = starsymbol;
    alphalanding1url = alphalanding1;


    redirecttoconsent(){
     
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'AlphaSurvey_StudyConsent__c'
            },
        });
    }

}