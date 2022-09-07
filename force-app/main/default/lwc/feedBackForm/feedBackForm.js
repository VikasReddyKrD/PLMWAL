import { LightningElement} from 'lwc';
    import FeedBackForm__c from '@salesforce/schema/FeedBackForm__c';
    import Name from '@salesforce/schema/FeedBackForm__c.Name';
    import Date_Of_Interview__c from '@salesforce/schema/FeedBackForm__c.Delivery_Date__c';
    import Interviewer__c from '@salesforce/schema/FeedBackForm__c.PO_Ref__c';
    import Position__c from '@salesforce/schema/FeedBackForm__c.Customer_SPOC__c';




    export default class FeedBackForm extends LightningElement {



    FeedBackForm__c=FeedBackForm__c;
    myFields=[Name, Date_Of_Interview__c, Interviewer__c, Position__c];
    handleformCreated(){

    // Run code when account is created.
    }
    }