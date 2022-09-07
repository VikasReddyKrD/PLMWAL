/* eslint-disable no-alert */
import { LightningElement, api } from 'lwc';

export default class ChildCmpnt extends LightningElement {
    @api myName="first value";

    @api testChildMethod(parentParam){
        alert('this is child method '+parentParam.firstName);
    } 
}