import { LightningElement, api } from 'lwc';
import { reduceErrors } from 'c/mddLdsUtils';

export default class MddErrorPanel extends LightningElement {
    /** Single or array of LDS errors */
    @api errors;
    /** Generic / user-friendly message */
    @api friendlyMessage = 'Error retrieving data';
    /** Type of error message **/
    @api type;

    viewDetails = false;

    get errorMessages() {
        return reduceErrors(this.errors);
    }

    handleShowDetailsClick() {
        this.viewDetails = !this.viewDetails;
    }

    /*render() {
        if (this.type === 'inlineMessage') return inlineMessage;
        return noDataIllustration;
    }*/
}