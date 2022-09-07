// myComponent.js
import { LightningElement, api } from 'lwc';
export default class MyComponent extends LightningElement {
    @api recordId;
    @api objectApiName;
    fields = ['AccountId', 'Name', 'Title', 'Phone', 'Email'];
}