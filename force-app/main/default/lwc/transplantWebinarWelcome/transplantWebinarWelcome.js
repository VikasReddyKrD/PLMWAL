import { LightningElement,wire } from 'lwc';
import userType from '@salesforce/apex/TransplantSurveyController.getSurveyDetails';
import starsymbol from '@salesforce/resourceUrl/starsymbol';


export default class TransplantWebinarWelcome extends LightningElement {
    isCaretaker=false;
    starsymbol = starsymbol;

    connectedCallback(){
        userType({})
        .then(user=>{
            if(user == "Caretaker")
                this.isCaretaker = true;
            else
                this.isCaretaker = false;
        })
        .catch(error=>{

        })
        
    }
}