import { LightningElement } from 'lwc';

export default class DataImport extends LightningElement {
    acptCon(){
        window.location.href = "https://www.patientslikeme.com/account/data_device_linking";
    }

}