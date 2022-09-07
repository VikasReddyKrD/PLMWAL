import { LightningElement } from 'lwc';

export default class Connect_emr extends LightningElement {
    checkboxValidator(event){
        
        this.isChecked= event.target.checked;
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
    handleCancel(){
        const config = {
            type: 'standard__webPage',
            attributes: {
                url: 'https://www.patientslikeme.com/users/sign_in'
            }
        };
        this[NavigationMixin.Navigate](config);

    }
    handleNext(){
        if(this.isChecked){
            fetchCheckedRecord()
            .then(result => {
            })
            .catch(error => {

            });
        }
    }



 
    
}