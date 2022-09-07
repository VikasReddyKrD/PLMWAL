import { LightningElement } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import TransplantTankYouMessage from '@salesforce/apex/TransplantSurveyController.getSurveyType';
export default class TransplantThankyouMassage extends NavigationMixin(LightningElement) {

    patientThankyouScreen=false;
    careTakerThankyouScreen=false;
    connectedCallback() {
        
        TransplantTankYouMessage({})
        .then(data=>{
            if(data!=undefined){
                console.log('thankyou',data);
          if(data=='Patient'){
              this.patientThankyouScreen=true;
          }else {
            this.patientThankyouScreen=false;
          }

          if(data=='Caretaker'){
            this.careTakerThankyouScreen=true;
        }else {
          this.careTakerThankyouScreen=false;
        }

            
            }
        })
        .catch(error=>{
                console.log("inside getSurveyType apex call",JSON.stringify(e))
        })
    }

    navigateToNextstep(){
        // this[NavigationMixin.Navigate]({
        //     type: 'comm__namedPage',
        //     attributes: {
        //         name: 'Home'
        //     },
        // });
        window.location.href="www.google.com";       
    }
 
    patientnavigateToNextstep(){
        window.location.href="www.google.com";  
    }
    

    handleExit(){
        window.location.href="https://www.patientslikeme.com/users/sign_in";
    }

    handleCancel(){
        window.location.href="https://www.patientslikeme.com/users/sign_in";
    }

}