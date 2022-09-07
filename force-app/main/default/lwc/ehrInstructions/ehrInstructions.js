import { LightningElement } from 'lwc';
import bulb from '@salesforce/resourceUrl/Idea_bulb';
import seqsterNavigate from '@salesforce/apex/PLM_Seqester.registerUser';
import getWebToken from '@salesforce/apex/PLM_Seqester.getWebToken';

export default class EhrInstructions extends LightningElement {
    alpha_bulb = bulb;
    webToken;
    isSpinner = false;
    handleContinue() {
        seqsterNavigate({ redirectionurl: 'https://servicecloudtrial-155c0807bf-16246540dc1.force.com/wal/s/alpha-survey-thank-you' })
            .then(res => {
                let timer = setTimeout(this.fetchWebToken, 5000);
                this.isSpinner = true;

            })
            .catch(error => {
                console.log("error " + JSON.stringify(error.body));
            });
    }

    fetchWebToken() {
        getWebToken({})
            .then(result => {
                this.webToken = result;
                console.log('seqt', this.webToken);
                let url = "https://alpha1.uat.seqster.com/login/token/" + this.webToken;
                window.location.href = url;
              /*   window.open(
                    url,
                    "height=200,width=200,modal=yes,alwaysRaised=yes"); */
                this.isSpinner = false;
            })
    }
}