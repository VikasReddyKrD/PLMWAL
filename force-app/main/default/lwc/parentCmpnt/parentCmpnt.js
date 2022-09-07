import { LightningElement,track } from 'lwc';

export default class ParentCmpnt extends LightningElement {
    @track parentvalue = "second value";

    handleChange(){
        this.parentvalue = "third value";
    }
    handleCall(){
        var childCompVar = this.template.querySelector('c-Child-Cmpnt');
        var sendParam = {'firstName':'shiva'};
        childCompVar.testChildMethod(sendParam);
    }
}