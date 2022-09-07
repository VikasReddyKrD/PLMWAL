import { LightningElement, wire, track, api } from 'lwc';

export default class SurveyContainerProgressbarStatic extends LightningElement {
   @api progress;
    @api surveyNumber;
    @api surveyName;
    curentStatus;
    // connectedCallback(){
    //     this.curentStatus = this.progress;
    //     console.log(' this.curentStatus', this.curentStatus);
    // }
}