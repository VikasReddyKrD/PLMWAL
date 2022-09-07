import { LightningElement ,api,track, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import CONTENTHEADER1 from '@salesforce/label/c.Conent_Header1';
import CONTENTHEADER2 from '@salesforce/label/c.Conent_Header2';
import CONTENTHEADER3 from '@salesforce/label/c.Conent_Header3';
import CONTENTHEADER4 from '@salesforce/label/c.Content_Header4';
import CONTENTHEADER5 from '@salesforce/label/c.Consent_Header5';
import CONTENTHEADER6 from '@salesforce/label/c.Content_Header3';
import content1 from '@salesforce/label/c.Content1_step2';
import content2 from '@salesforce/label/c.Content2_step2';
import content3 from '@salesforce/label/c.Content3_step2';
import fetchStudyRec from '@salesforce/apex/StudyConsentController.fetchStudyConsentRecords';
import fetchCheckedRecord from '@salesforce/apex/StudyConsentController.fetchCheckedRecord';
//import CONTENTHEADER3 from '@salesforce/label/Conent_Header3';

export default class transplant_StudyConcent extends NavigationMixin(LightningElement){
    label = {
        CONTENTHEADER1,
        CONTENTHEADER2,
        CONTENTHEADER3,
        CONTENTHEADER4,
        CONTENTHEADER5,
        CONTENTHEADER6,
        content1,content2,content3       
    };
     disable = true;
     selectedStep = 'Step1';
     acceptLabel='Accept and Continue';
     exitLabel='Reject and Exit';  
     isChecked;
    studyConsentId = '';
    @api consentDisclosure; 
    @api disclosure;
    buttoncolor = "btn_capsulecolor slds-float_right";
    

    connectedCallback(){
        fetchStudyRec()
        .then(result => {
            this.studyConsentId = result;
           // console.log('result '+JSON.stringify(result));
          //  console.log('this.studyConsentId '+this.studyConsentId);           
           //this.spinnerCheck=false;
            if(this.studyConsentId.Existing_Record__c && !this.consentDisclosure){
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'Alpha_Survey1__c'
                    },
                });
            }
        })
        .catch(error => {
            console.log("error "+error.body);
        });
    }

   
    

    checkboxValidator(event){
        this.isChecked= event.target.checked;
        if(event.target.checked === true){
             this.disable = false;
             this.buttoncolor = "btn_capsule slds-float_right";
        }
        else{
           this.disable = true;
           this.buttoncolor = "btn_capsulecolor slds-float_right";
        }
    }
    handleAccept(event){
        if(this.isChecked){
            fetchCheckedRecord()
            .then(result => {
               // alert('HI Hello');
            })
            .catch(error => {
                console.log("error "+error.body);
            });
        }
            if(event.target.label == this.acceptLabel){
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'Alpha_Survey1__c'
                    },
                });
           
        }
      /*  else if(this.checkfortotalScreen2){
            console.log("label "+event.target.label);
            this.checkforScreen2 = false;
            this.acceptLabel = 'Continue';
            this.exitLabel = 'Save and Exit';
            this.progressBarValue = 20;
            this.selectedStep = '2';
        }*/
       /* else{
           // this.checkfortotalScreen2 = false;
            this.progressBarValue = 30;
            fetchRec()
            .then(result => {
                this.questions = result;
                console.log('result '+JSON.stringify(result));
            })
            .catch(error => {
                console.log("error "+error);
            });
        }*/
    }

    
    
  
}