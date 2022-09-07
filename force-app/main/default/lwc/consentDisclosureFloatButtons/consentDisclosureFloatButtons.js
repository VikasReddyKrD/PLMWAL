import { api, LightningElement } from 'lwc';
import seqsterNavigate from '@salesforce/apex/PLM_Seqester.registerUser';
import getWebToken from '@salesforce/apex/PLM_Seqester.getWebToken';
import { NavigationMixin } from 'lightning/navigation';

export default class ConsentDisclosureFloatButtons extends NavigationMixin(LightningElement) {
    @api thankYou;
    @api disclosure;
    @api thankYouAfterSeqster;
    webToken;
    connectedCallback() {

    }

    // handleAccept() {

    //     console.log('Testing123');
    //     if (this.thankYou) {
    //         console.log('Testing' + this.thankYou);
    //         this[NavigationMixin.Navigate]({
    //             type: 'comm__namedPage',
    //             attributes: {
    //                 name: 'Alpha_medical_records_page__c'
    //             },
    //         });
    //     }
    //     else {
    //         console.log('Testing seqster' + this.thankYou);
    //         seqsterNavigate({ redirectionurl: 'www.google.com' })
    //             .then(res => {
    //               let   timer = setTimeout(this.fetchWebToken, 2000);

    //             })
    //             .catch(error => {
    //                 console.log("error " + JSON.stringify(error.body));
    //             });
    //     }
    // }

    handleAccept(){
        this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'EHR_Instructions__c'
                        },
                    });
    }

    fetchWebToken() {
        getWebToken({})
            .then(result => {
                this.webToken = result;
                console.log('seqt', this.webToken);
                let url = "https://alpha1.uat.seqster.com/login/token/" + this.webToken;
                window.open(
                    url,
                    "height=200,width=200,modal=yes,alwaysRaised=yes");
            })
    }

    handleContinue(event) {
        window.location.href = "https://www.patientslikeme.com/member_home";
        //alert('hihi');
        // this[NavigationMixin.Navigate]({
        //             type: 'comm__namedPage',
        //             attributes: {
        //                name: "www.google.com" //https://www.patientslikeme.com/member_home",
        //                // name: nameorurl,
        //             },
        //         });           
    }
}