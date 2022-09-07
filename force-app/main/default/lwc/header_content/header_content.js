import { LightningElement,api } from 'lwc';

export default class Header_content extends LightningElement {
    @api isCrisis;
    @api isLooking;
    connectedCallback(){
        console.log("location",window.location.href);
        console.log("isCrisis",this.isCrisis);
    }
}