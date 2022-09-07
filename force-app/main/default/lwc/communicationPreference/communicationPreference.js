import { LightningElement ,api,track, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import CONTENTHEADER1 from '@salesforce/label/c.Conent_Header1';
import CONTENTHEADER2 from '@salesforce/label/c.Conent_Header2';
import CONTENTHEADER3 from '@salesforce/label/c.Conent_Header3';
import Contentcentre from '@salesforce/label/c.Contentcentre';
//import CONTENTHEADER4 from '@salesforce/label/c.Content_Header4';
//import CONTENTHEADER5 from '@salesforce/label/c.Consent_Header5';
//import CONTENTHEADER6 from '@salesforce/label/c.Content_Header3';
import TITLE from '@salesforce/label/c.TITLE';
import TITLECONTENT from '@salesforce/label/c.TITLE_CONTENT';
import PROTOCOLNO from '@salesforce/label/c.PROTOCOLNO';
import ProtocolDetails from '@salesforce/label/c.Protocol_Details';
import SPONSOR from '@salesforce/label/c.SPONSOR';
import SPONSORDETAILS from '@salesforce/label/c.SPONSOR_DETAILS';
import Investigator from '@salesforce/label/c.Investigator';
import InvestigatorDetails from '@salesforce/label/c.Investigator_Details';
import SRPhoneNumber from '@salesforce/label/c.SR_PhoneNumber';
import SRNumber from '@salesforce/label/c.SR_Number';
import COLLABORATOR from '@salesforce/label/c.COLLABORATOR';
import COLLABORATORDETAILS from '@salesforce/label/c.COLLABORATOR_DETAILS';
import ComQue1 from '@salesforce/label/c.ComQue_1';
import comque11 from '@salesforce/label/c.comque11';
import conQue12 from '@salesforce/label/c.conQue_12';
import conque13 from '@salesforce/label/c.conque_13';
import comQue14 from '@salesforce/label/c.comQue_14';
import Study from '@salesforce/label/c.Study';
import Study1 from '@salesforce/label/c.Study_1';
import INStudy from '@salesforce/label/c.INStudy';
import INStudy1 from '@salesforce/label/c.INStudy_1';
import INStudy2 from '@salesforce/label/c.INStudy2';
import INStudy3 from '@salesforce/label/c.INStudy3';
import INStudy4 from '@salesforce/label/c.INStudy4';
import INStudy5 from '@salesforce/label/c.INStudy5';
import Participating from '@salesforce/label/c.Participating';
import Participating1 from '@salesforce/label/c.Participating_1';
import content1 from '@salesforce/label/c.Content1_step2';
import content2 from '@salesforce/label/c.Content2_step2';
import content3 from '@salesforce/label/c.Content3_step2';
import fetchStudyRec from '@salesforce/apex/StudyConsentController.fetchStudyConsentRecords';
import fetchCheckedRecord from '@salesforce/apex/StudyConsentController.fetchCheckedRecord';
import updateAccountConsent from '@salesforce/apex/SurveyController.updateAccountConsent';
import starsymbol from '@salesforce/resourceUrl/starsymbol';
import 	Joinstudy1 from '@salesforce/resourceUrl/Joinstudy1';
//import CONTENTHEADER3 from '@salesforce/label/Conent_Header3';
export default class StudyConsent extends NavigationMixin(LightningElement){
    label = {
        CONTENTHEADER1,
        CONTENTHEADER2,
        CONTENTHEADER3,
        Contentcentre,
    
        TITLE,TITLECONTENT,
        SPONSOR,SPONSORDETAILS,
        PROTOCOLNO,ProtocolDetails,
        Investigator,InvestigatorDetails,
        SRPhoneNumber,SRNumber,
        COLLABORATOR,COLLABORATORDETAILS,
        ComQue1,comque11,conQue12,conque13,comQue14,Study,Study1,
        INStudy,INStudy1,INStudy2,INStudy3,INStudy4,INStudy4,INStudy5,Participating,
        Participating1,
  //      CONTENTHEADER4,
    //    CONTENTHEADER5,
      //  CONTENTHEADER6,
        content1,content2,content3       
    };
    islandingpage=false;
     disable = true;
     checkDisable=true;
     selectedStep = 'Step1';
     acceptLabel='Next';
     exitLabel='Cancel';  
     isChecked;
     isCommunicationPreference;
    studyConsentId = '';
    @api consentDisclosure; 
    @api disclosure;
    buttoncolor = "btn_capsulecolor slds-float_right";
    checkboxchecks=[];
    showvideotemplate=false;

    Joinstudy1url=Joinstudy1;

    starsymbol = starsymbol;


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
                        name: 'StudyComunicationPreference__c'
                    },
                });
            }
            else if(this.studyConsentId.Existing_Record__c){
               this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'Home'
                    },
                }); 
            }
        })
        .catch(error => {
            console.log("error "+error.body);
        });
    }

    onCommunicationPreferenceHandle(event){
        
        this.isCommunicationPreference= event.target.checked; 
        console.log(event.target.value);
        if(event.target.checked == true){
           
            this.checkDisable=false;
        }else{
            this.checkDisable=true;
        }
      
         
        }
        
        
    
    

    checkboxValidator(event){
        
        this.isChecked= event.target.checked;
        
        // if(event.target.checked === true){
        //     this.checkboxchecks.push(event.target.checked); 
        // }
        // if(event.target.checked === false){
        //     this.checkboxchecks.length--; 
        // }
    //    console.log(this.isChecked.length);
    //     if(this.checkboxchecks.length >= 2){
    //         this.disable = false;
    //          this.buttoncolor = "btn_capsule fs-16 mr-1 slds-m-left_x-small";
    //          this.template.querySelector('[data-accept="ok"]').variant = "brand";
    //         }
    //     // if(event.target.checked === true){
    //     //      this.disable = false;
    //     //      this.buttoncolor = "btn_capsule slds-float_right";
    //     // }
    //     else if(this.checkboxchecks.length <=1){
    //        this.disable = true;
    //        this.template.querySelector('[data-accept="ok"]').variant = "";
    //        this.buttoncolor = "btn_capsule fs-16";
           
    //     }
        if(this.isChecked){
            this.disable = false;
            this.buttoncolor = "btn_capsule fs-16 mr-1 slds-m-left_x-small";
            this.template.querySelector('[data-accept="ok"]').variant = "brand";
            this.buttoncolor = "btn_capsule slds-float_right";
        }else{
            this.disable = true;
            this.template.querySelector('[data-accept="ok"]').variant = "";
            this.buttoncolor = "btn_capsule fs-16";    
        }
    }

    handleNext(){  
            
        this.showvideotemplate=true;
        if(this.isChecked){
            fetchCheckedRecord()
            .then(result => {
               console.log("result",result);
            })
            .catch(error => {
                console.log("error "+error.body);
            });
        }
    }
    handleCancel(){
        const config = {
            type: 'standard__webPage',
            attributes: {
                url: 'https://www.patientslikeme.com/users/sign_in'
            }
        };
        this[NavigationMixin.Navigate](config);

    }
  
    redirecttoconsent(){
        this.islandingpage=true;
    }
    keyPressHandler(event){
            if([75, 77, 84, 66, 69, 44, 45, 46, 107, 109, 98, 116, 101, 43].includes(event.keyCode)){
               event.preventDefault();
            }
    }


    // redirecttoconsent(){
     
    //     this[NavigationMixin.Navigate]({
    //         type: 'comm__namedPage',
    //         attributes: {
    //             name: 'Home'
    //         },
    //     });
    // }

    handleAccept(event){

        
            if(event.target.label == this.acceptLabel){
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'StudyComunicationPreference__c'
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