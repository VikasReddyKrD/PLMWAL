import { LightningElement } from 'lwc';
import starsymbol from '@salesforce/resourceUrl/starsymbol';
import 	Joinstudy1 from '@salesforce/resourceUrl/Joinstudy1';
import { NavigationMixin } from 'lightning/navigation';

export default class Mdd_JoinTheStudy extends  NavigationMixin(LightningElement) {

    Joinstudy1url=Joinstudy1;

    starsymbol = starsymbol;

    redirecttoconsent(){
     
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'MDD_Dashboard__c'
            },
        });
    }

}