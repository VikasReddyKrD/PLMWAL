import { LightningElement, track } from 'lwc';

export default class ComboboxBasic extends LightningElement {
@track value = 'inProgress';

get options() {
    return [
             { label: ' Equal', value: '=' },
             { label: 'Greaterthan  ', value: '>' },
             { label: ' GreaterthanOrEqaulTo', value: '>=' },
             { label: 'LessThan  ', value: '<' },
             { label: ' LessthanOrEqalTo', value: '<=' },
             { label: ' NotEqual', value: '!=' },
        
           ];
}
handleChange(event) {
        this.value = event.detail.value;
     }
}