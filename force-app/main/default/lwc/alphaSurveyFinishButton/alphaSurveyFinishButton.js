import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class AlphaSurveyFinishButton extends NavigationMixin(LightningElement) {
    handleContinue(event){ 
        window.location.href="https://www.patientslikeme.com/member_home";
                 
          }
}