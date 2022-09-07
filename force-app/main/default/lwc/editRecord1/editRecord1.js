import { LightningElement, api } from 'lwc';
export default class FieldValueCreateExample extends LightningElement {
   myValue = "My Account Name";
    overrideValue(event) {
       this.myValue = "My New Name";
   }
}