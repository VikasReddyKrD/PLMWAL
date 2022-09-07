import { LightningElement, api, wire, track } from 'lwc';
import sendEmail from '@salesforce/apex/ContentSupportEmail.sendEmail';
import contentEmailSupport from '@salesforce/label/c.contentEmailSupport';
import getAccountId from '@salesforce/apex/ContentSupportEmail.getAccountId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Mdd_content_support extends LightningElement {


    @track emailBody;
    error;
    accId;

    label = {
        contentEmailSupport
    };

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

     connectedCallback(){
        getAccountId()
        .then(result=>{
            console.log("result",result);
            if(result){
                this.accId = result;
            }
        })
        .catch(error=>{
            this.error = error;
        })
    } 


    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        //alert('No. of files uploaded : ' + uploadedFiles.length);
    }

    handleChange(event) {
        this.emailBody = event.target.value;
    }



    clearHandler(event) {
        eval("$A.get('e.force:refreshView').fire();");
    }

    sendEmailHandler(event) {
        // send mail
        let toAddresses = this.label.contentEmailSupport.split(",");

        //const validity = this.template.querySelector('lightning-textarea').reportValidity();
        //if(validity)    {

        if (this.emailBody == null || this.emailBody ==='') {
            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Please enter the text before sending the email',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }
        else {
            sendEmail({ toAddress: toAddresses, subject: "MDD Survey Support", body: this.emailBody })
                .then(result => {
                    const evt = new ShowToastEvent({
                        title: 'Success',
                        message: 'Email has been sent successfully.',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(evt);

                    eval("$A.get('e.force:refreshView').fire();");

                }).catch(error => {
                    const evt = new ShowToastEvent({
                        title: 'Error',
                        message: 'Error encountered while sending the email',
                        variant: 'error',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(evt);

                    this.error = error;
                    console.log(this.error);
                });

        }

        // }
    }
}