import { LightningElement,api,wire,track } from 'lwc';
import getAccount from '@salesforce/apex/PLMGetPatientFromAccount.getAccountDetails';
import getSurveyDetails from '@salesforce/apex/TransplantSurveyController.getSurveyDetails';
import {getFieldValue } from "lightning/uiRecordApi";

export default class TransplantStudyConsentProgressBar extends LightningElement {
    @api selectedStep ;
    details;
    tranType;
    mydata;
    patientType;
    careTaker;

    @api surveyType;
    @api surveyid;
    connectedCallback(){
        getSurveyDetails()
        .then(result => {
            console.log('transplant type===>',result);
            if(result=='Patient'){
                this.tranType=true;
                this.patientType=true;
            }else{
                this.tranType=false;
                this.patientType=false;
            }
            
            

        })
       
    }        

    handleStepBlur(event) {
        const stepIndex = event.detail.index;
       
    }
    

//@wire(careTaker) accountDetails;
// @wire(careTaker)
//     wiredData({ error, data }) {
//       if (data) {
// this.mydata=data;
//         console.log('Data', data);
//       } else if (error) {
//          console.error('Error:', error);
//       }
//     }

// get transplantPatientType() {
// alert('mydata')
//     return getFieldValue(this.mydata.data, Transplant_Patient_Type__c);
//   }

//   if(transplantPatientType='Patient')
//   {
//       type=true;
//   }
  

 }