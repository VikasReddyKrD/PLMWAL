import { LightningElement } from 'lwc';
import seqsterNavigate from '@salesforce/apex/PLM_Seqester.registerUser';
import getWebToken from '@salesforce/apex/PLM_Seqester.getWebToken';
export default class AlphaThankYouButtons extends LightningElement {
    saveHandler(event){
        window.location.href = "https://www.patientslikeme.com/users/sign_in";
    }
    handleCancel(event){
        window.location.href = "https://www.patientslikeme.com/users/sign_in";
    }
    returntoSequester(){
        seqsterNavigate({ redirectionurl: 'https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/alpha-survey-thank-you' })
                .then(res => {
                  let   timer = setTimeout(this.fetchWebToken, 3000);

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
            //     window.open(
            //         url,
            //         "height=200,width=200,modal=yes,alwaysRaised=yes",'_blank');
             })
    }
}