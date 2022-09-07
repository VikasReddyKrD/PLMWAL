import { LightningElement, track, wire} from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import Logic__c from '@salesforce/schema/Logic__c';
import Name from '@salesforce/schema/Logic__c.Name';
import Symbol__c from '@salesforce/schema/Logic__c.Symbol__c';

export default class PicklistValuesDemo extends LightningElement {
    @track value;

    @wire(getObjectInfo, { objectApiName: Logic__c })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Symbol__c})
    TypePicklistValues;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Name})
    IndustryPicklistValues;

    handleChange(event) {
        this.value = event.detail.value;
    }
}