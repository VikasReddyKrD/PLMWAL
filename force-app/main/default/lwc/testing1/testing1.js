import { LightningElement} from 'lwc';
import FeedBackForm__c from '@salesforce/schema/FeedBackForm__c';

import Name from '@salesforce/schema/FeedBackForm__c.Name';

import Date_Of_Interview__c from '@salesforce/schema/FeedBackForm__c.Delivery_Date__c';

import Interviewer__c from '@salesforce/schema/FeedBackForm__c.PO_Ref__c';

import Position__c from '@salesforce/schema/FeedBackForm__c.Customer_SPOC__c';
import {showToastEvent} from 'lightning/platformshowToastEvent';

import {createRecord} from 'lightning/uiRecordApi';
import {NavigationMixin} from 'lightning/navigation';
 
export default class CustomTypeA extends NavigationMixin (LightningElement) {
    Name='';
    Date_Of_Interview__c='';
    Interviewer='';
    Position__c='';
    createrecord(event){
        if(event.target.label == 'Name'){
            this.Name=event.target.value;
        }
        if(event.target.label == 'Date_Of_Interview__c'){
            this.Date_Of_Interview__c =event.target.value;
        }
        if(event.target.label == 'Interviewer__c'){
            this.Interviewer__c=event.target.value;
        }
        if(event.target.label == 'Position__c'){
            this.Position__c=event.target.value;
        }
    }
    createAccount(){
        const fields = {};
        fields [Name.fieldApiName] =this.Name;
        fields [Date_Of_Interview__c.fieldApiName] =this.Date_Of_Interview__c;
        fields [Interviewer__c.fieldApiName] =this.Interviewer__c;
        fields [Position__c.fieldApiName] =this.Position__c;
        const recordInput = {apiName: FeedBackForm__c.objectApiName, fields};
        createRecord(recordInput)
        .then(FeedBackForm => {
            this.accountId=FeedBackForm.Id;
            this.dispatchEvent(
                new showToastEvent({
                    title:'sucess',
                    message: 'Account created',
                    variant:'sucess',
                }),
            );
            this[NavigationMixin.Navigate]({
                type: 'standard_recordPage',
                attributes: {
                    recordId: FeedBackForm.id,
                    objectApiName: 'FeedBackForm__c',
                    actionName : 'view'
                },
            });
        })
        .catch(error => {
            this.dispatchEvent(
                new showToastEvent({
                    title:'error',
                    message: error.body.message,
                    variant:'error',
                }),
            );
            });


    }
}