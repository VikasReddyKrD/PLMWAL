import { LightningElement,api } from 'lwc';

export default class TransplantStudyConsentProgressBar extends LightningElement {
    @api selectedStep ;

    handleStepBlur(event) {
        const stepIndex = event.detail.index;
    }
}