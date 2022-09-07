import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getSurveyType from '@salesforce/apex/TransplantSurveyController.getSurveyType';
import updateSurveyType from '@salesforce/apex/TransplantSurveyController.updateSurveyType';
import transplantUserStamp from '@salesforce/apex/TransplantSurveyController.transplantUserStamp';
import { verifyLastVisitPage, updateNextPageName } from 'c/transplantCurrentPage';

export default class TransplantStudySurvey extends NavigationMixin(LightningElement) {

    progress = 10;
    isShowModal = false;

    @api navigation;
    @api questionType;
    isWelcomePage = true;
    selectedValue = '';
    isModalOpen = false;
    get options() {
        return [
            { label: 'I am a transplant patient', value: 'Patient' },
            { label: 'I am the care partner of a transplant patient', value: 'Caretaker' },
            { label: 'None of the above', value: 'None of the above' }
        ];
    }

    connectedCallback() {
        verifyLastVisitPage(this, NavigationMixin)
            .then(result => { })
            .catch(error => { })

        getSurveyType({})
            .then(data => {
                if (data != undefined) {
                    this.selectedValue = data;
                    this.isWelcomePage = false;
                }
            })
            .catch(error => {
                console.log("inside getSurveyType apex call", JSON.stringify(e))
            })
    }
    handleChange(event) {
        this.selectedValue = event.target.value;
        if (this.selectedValue == "None of the above") {
            this.isModalOpen = true;
        }
    }

    handleBack() {
        this.selectedValue = undefined;
        this.isModalOpen = false;
    }
    hideModalBox() {
        this.isShowModal = false;
    }

    navigateToSurvey(event) {
        updateNextPageName(window.location.href.split('/')[5])
            .then(result => {
                this.isWelcomePage = false;
                console.log('event.target.label', this.selectedValue);
                updateSurveyType({ type: this.selectedValue })
                    .then(data => {
                        //  this.selectedValue

                        console.log('updateSurveyType', data);
                        this[NavigationMixin.Navigate]({
                            type: 'comm__namedPage',
                            attributes: {
                                name: 'Transplant_Baseline_Survey__c'
                            },
                        })

                    })
                    .catch(error => {
                        console.log('error', error);

                    })
            })
            .catch(error => { })

    }

    okHandler(event) {

        wiindow.location.href = "https://www.patientslikeme.com/users/sign_in";
    }

    handleExit() {
        this.isShowModal = true;
        transplantUserStamp({ lastStamp: window.location.href.split('/s/')[1] })
            .then(data => {
                console.log("data ", data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
        // window.location.href = "https://www.patientslikeme.com/users/sign_in";
    }
    handleCancel() {
        this.isShowModal = true;
        //window.location.href = "https://www.patientslikeme.com/users/sign_in";
    }
    plmRedirection() {
        window.location.replace("https://www.patientslikeme.com/users/sign_in");
    }

    closeModal() {
        // to close modal set isModalOpen track value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
        // this.isModalContent = true;
        /* this.dispatchEvent(new CustomEvent('tolastpage', {
            detail: this.isModalContent
        })); */
        window.location.href = "https://www.patientslikeme.com/users/sign_in";

    }
}