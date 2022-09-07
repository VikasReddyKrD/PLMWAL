import { LightningElement, track, wire } from 'lwc';

import getAccounts from '@salesforce/apex/GoalQuestions.getOptionsetting';
const DELAY = 300;

export default class ExploreAccountLookup extends LightningElement {
    @track search = '';
    @track error;
    @track searchOption;
    @track selectedAccount;
    @track showAccountsListFlag = false;

    @wire(getAccounts, {
        searchKeyWord : 'Performance',
        searchKeyOption : 'r'
    })
    accounts;

    handleKeyUp(event) {
        if (!this.showAccountsListFlag) {
            
            this.showAccountsListFlag = true;
            this.template
                .querySelector('.accounts_list')
                .classList.remove('slds-hide');
        }
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.searchOption = this.searchKey;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.search = searchKey;
        }, DELAY);
    }

    handleOptionSelect(event) {
        this.selectedAccount = event.currentTarget.dataset.name;
        this.template
            .querySelector('.selectedOption')
            .classList.remove('slds-hide');
        this.template
            .querySelector('.accounts_list')
            .classList.add('slds-hide');
        this.template
            .querySelector('.slds-combobox__form-element')
            .classList.add('slds-input-has-border_padding');
    }

    handleRemoveSelectedOption() {
        this.template
            .querySelector('.selectedOption')
            .classList.add('slds-hide');
        this.template
            .querySelector('.slds-combobox__form-element')
            .classList.remove('slds-input-has-border_padding');

        this.showAccountsListFlag = false;
    }
}