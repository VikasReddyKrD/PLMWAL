import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import uId from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import { NavigationMixin } from 'lightning/navigation';
import transplantUserStamp from '@salesforce/apex/TransplantSurveyController.transplantUserStamp';
//import { loadScript, loadStyle } from "lightning/platformResourceLoader";
// //import scripts from '@salesforce/resourceUrl/assets';
// import fonts from '@salesforce/resourceUrl/fontsplmcrt';
// import icons from '@salesforce/resourceUrl/icons_svg';
// //import styles from '@salesforce/resourceUrl/appstyles';

const fields = [NAME_FIELD];

export default class Header_2 extends NavigationMixin(LightningElement) {

    userId = uId;
    isShowModal = false;

    @wire(getRecord, { recordId: '$userId', fields })
    user;

    get name() {
        return getFieldValue(this.user.data, NAME_FIELD);
    }

    /*connectedCallback() {
        console.log('inside the header.js connectedcallback '+ uId);
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://www.patientslikeme.com/member_home'
            }
        }, true);
    }*/


    //     renderedCallback() {
    //         Promise.all([

    //             loadStyle(this, fonts + '/fonts_type.css'),
    //             loadStyle(this, icons + '/fonts_type.css'),
    //             //loadStyle(this, styles + '/appstyles.css')

    //         ]).then(() => {
    //             window.console.log('Files loaded.');
    //         }).catch(error => {
    //             window.console.log("Error " + error.body.message);
    //         });
    //     }
    handleClick() {
        // window.location.replace("https://www.patientslikeme.com/users/sign_in");
        // window.location.replace("https://val-servicecloudtrial-155c0807bf-16246540dc1.cs2.force.com/wal/s/login/");
        window.location.replace("https://www.patientslikeme.com/users/sign_in");
        transplantUserStamp({ lastStamp: window.location.href.split('/s/')[1] })
            .then(data => {
                console.log("data ",data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
        /* this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Login'
            },
        }); */
    }
    handleBackClick() {
        // if (window.location.href.includes('alpha-survey1')){
            this.isShowModal = true;
            transplantUserStamp({ lastStamp: window.location.href.split('/s/')[1] })
            .then(data => {
                console.log("data ",data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
        // }
        // else{
        //     "https://www.patientslikeme.com/";
        // }
    }
    hideModalBox(){
        this.isShowModal = false; 
    }
    plmRedirection(){
        transplantUserStamp({ lastStamp: window.location.href.split('/s/')[1] })
            .then(data => {
                console.log("data ",data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
        window.location.href = "https://www.patientslikeme.com/";
    }
}