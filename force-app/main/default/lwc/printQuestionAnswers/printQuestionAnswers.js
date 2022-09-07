import { LightningElement } from 'lwc';

export default class PrintQuestionAnswers extends LightningElement {
    displayToggle="display:none";
    handleClick(event){
    this.displayToggle = "display:block";
    }
}