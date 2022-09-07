import { LightningElement } from 'lwc';
import starsymbol from '@salesforce/resourceUrl/starsymbol';
import 	Joinstudy1 from '@salesforce/resourceUrl/Joinstudy1';
import { NavigationMixin } from 'lightning/navigation';
import getConsentStatus from '@salesforce/apex/SurveyController.getConsentStatus';
export default class Mdd_JoinTheStudy extends  NavigationMixin(LightningElement) {

    Joinstudy1url=Joinstudy1;
    isConsented = false;
    starsymbol = starsymbol;
    connectedCallback() {
        getConsentStatus()
        .then(data=>{
            console.log("data====>",data);
            this.isConsented =data;
        })
        .catch(error=>{
            console.log("error ",error);
        })

        }
    
    redirecttoconsent(){ 
        if(this.isConsented){
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            },
        });
    }
    else{
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'MddLandingPage__c'
            },
        });
    }
    }

}