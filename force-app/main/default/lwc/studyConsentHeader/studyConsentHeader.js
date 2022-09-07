import { LightningElement,api} from 'lwc';


export default class StudyConsentHeader extends LightningElement {

    @api mainHeader;
    @api contentHeader;
    @api contentHeader2;
}