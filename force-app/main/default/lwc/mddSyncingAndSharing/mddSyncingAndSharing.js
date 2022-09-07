import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import registerUser from '@salesforce/apex/PLM_Seqester.registerUser';

export default class MddSyncingAndSharing extends NavigationMixin(LightningElement) {

    redirectionurl;
    consented;
    webToken;
    checkboxValidator(event) {
        if (event.target.checked) {
            this.consented = true;
        }
    }
    handleAcceptAndContinue() {
        if (this.consented) {
            this.redirectionurl = 'https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/mdd-data-review';
            registerUser({ redirectionurl: this.redirectionurl })
                .then(result => {
                    this.webToken = result;
                    let url="https://alpha1.uat.seqster.com/login/token/"+ this.webToken;
                    window.open(
                        url,
                        "height=200,width=200,modal=yes,alwaysRaised=yes");
                    })
                .catch(error => {
                    console.log(error, 'error');
                })
        }
    }
    handleCancel() {
        window.open('https://www.patientslikeme.com/users/sign_in');
    }

}