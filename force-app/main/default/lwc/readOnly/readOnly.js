import { LightningElement, api } from 'lwc';



export default class MyComponent extends LightningElement {



    @api recordId;



    @api objectApiName;

    connectedCallback()

    {

        this.objectName=this.objectApiName;

    }

}