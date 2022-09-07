import { LightningElement, api } from 'lwc';
import getQuestionsWithSections from '@salesforce/apex/TransplantSurveyController.getQuestionsWithSections';
import surveyFlow from '@salesforce/apex/SurveyController.surveyFlow';
import insertSurveyAnswer from '@salesforce/apex/TransplantSurveyController.insertMulitipleSurveyAnswers';
//import TransplantSurveyEmailSchedule from '@salesforce/apex/TransplantSurveyController.TransplantSurveyEmailSchedule';
import userType from '@salesforce/apex/TransplantSurveyController.getSurveyType';
import transplantUserStamp from '@salesforce/apex/TransplantSurveyController.transplantUserStamp';
import { NavigationMixin } from 'lightning/navigation';
import getCurrentPageDetails from '@salesforce/apex/StudyConsentController.getCurrentPage';

import { verifyLastVisitPage, updateNextPageName } from 'c/transplantCurrentPage';

export default class TransplantMultiQuestionsContainer extends NavigationMixin(LightningElement) {
    lastLog = ["transplant-consent", "transplant-survey-consent", "transplantsurveywelcomepage", "transplant-baseline-survey", "transplant-webinar-welcome", "transplant-pre-webinar", "transplantwebinar", "transplant-post-webinar-questions", "transplant-survey-link", "transplant-survey-welcome", "transplant-questions", "transplant-survey-completion", "transplantsurveydatasync"];
    @api surveyType;
    @api surveyid;
    @api surveyNumber;
    @api questionType;
    @api navigation;
    @api thankyouexit = false;
    currentSectioncheck = "";
    patientType;
    lastLoginPage;
    sectionsData;
    isSpinner = true;
    tableValidation;
    isShowModal = false;
    hiddenQuestions;
    isprogressStap = false;

    sectionName;
    transitionMessage;
    accountId;
    responseId;
    surveyid;
    surveyNumber;

    // sectionData;
    // currentSec="";

    questionsMap = new Map();
    questionsList = new Array()
    section = 1;
    isHidePrevious = true;
    isHideNext = true;
    //verifyLastVisitPage = verifyLastVisitPage.bind(this);

    connectedCallback() {
        console.log("inside connectedCallback");
        verifyLastVisitPage(this, NavigationMixin)
            .then(result => {
                this.surveyFlow();
                if (this.section == 1) {
                    this.isHidePrevious = true;
                }
                userType({})
                    .then(data => {
                        if (data) {
                            console.log('thankyou', data);
                            this.patientType = data;
                        }
                    })
            })
            .catch(error => {
                console.log("error", error);
            })

    }
    //used to create the survey responses or edit the survey response (duplicated from the flow)
    surveyFlow() {
        // surveyFlow({ surveyNumber: 'Transplant-Survey-1' })
        surveyFlow({ surveyNumber: this.questionType })//'Transplant-Baseline'
            // surveyFlow({ surveyNumber: 'Transplant-Pre-webinar' })
            .then(data => {
                console.log('data', JSON.stringify(data));
                this.surveyid = data.surveyId;
                this.responseId = data.responseId;
                this.accountId = data.accountId;
                console.log(' this.surveyid', this.surveyid, 'this.responseId', this.responseId, 'this.accountId', this.accountId)
                this.getQuestionsData("change section");
            })
            .catch(error => {
                console.log("inside survey flow", error);
            })
    }
    getQuestionsData(change) {
        console.log("this.surveyType", this.surveyType);
        //   getQuestionsWithSections({type:this.surveyType,surveyId:'a1ee000000fSZl8AAG'})
        getQuestionsWithSections({ type: this.surveyType, surveyId: this.surveyid }) //'a1ee000000fSaKGAA0' type:this.surveyType,surveyId: this.surveyid
            // getQuestionsWithSections({type:this.surveyType,surveyId:'a1ee000000fSZxwAAG'})
            .then(data => {
                /* if(this.surveyNumber == "Transplant-Survey-1"){
                    this.section++;
                } */
                console.log("data===>", data);
                console.log('lastStamp', data.lastStamp);
                // this.currentSectioncheck = this.data[this.section].currentSectioncheck != undefined ? this.data[this.section].currentSectioncheck : undefined;
                // this.sectionData = data;
                if (data.currentSection != undefined) {
                    console.log('this currebtsession', data.currentSection);

                    console.log('current progress', this.progress);
                }

                this.questionsMap = new Map();
                data.questions.forEach(each => {
                    var section;
                    if (each.question.Section_Name__c != undefined && this.questionType == 'Transplant-Survey-1') {
                        section = JSON.parse(each.question.Section_Name__c).section;
                    }
                    else {
                        section = 1;
                    }
                    if (this.questionsMap.has(section)) {
                        var questionsLists = this.questionsMap.get(section);
                        questionsLists.push(each);
                        this.questionsMap.set(section, questionsLists)
                    }
                    else {
                        var questionsLists = new Array();
                        questionsLists.push(each);
                        this.questionsMap.set(section, questionsLists);
                    }
                })

                this.questionsList = undefined;
                console.log("testing bdhfs");

                if (data.lastStamp != '' || data.lastStamp != null) {
                    if (data.lastStamp == 'transplant-caretaker-survey-thankyou') {
                        this.isSpinner = false;
                    }
                }
                if (data.lastStamp == 'transplant-questions') {
                    this.isprogressStap = true;
                } else {
                    this.isprogressStap = false;
                }


                if (data.currentSection != undefined && change == "change section") {
                    if (this.questionType == 'Transplant-Survey-1' && data.currentSection) {
                        this.section = Number(data.currentSection);
                    }
                    if (this.section < this.questionsMap.get(this.section)) {
                        this.isHidePRevious = false;
                    }
                    else {
                        this.isHidePRevious = true;
                    }
                    if (this.section == 2) {
                        this.isHidePRevious = false;
                    }
                }
                else if (change == "next" && change != undefined) {
                    this.section++;
                    if (data.userType == 'Caretaker' && data.skipSectionAnswer && this.section == 6 && (data.skipSectionAnswer.includes('No') || data.skipSectionAnswer.includes('Don’t know'))) {
                        this.isSpinner = true;
                        console.log("this.section care", this.section);
                        updateNextPageName(window.location.href.split('/')[5],this.patientType)
                            .then(result => {
                                this.navigate('Transplant_Caretaker_Survey_Thankyou__c');
                            })
                            .catch(error => { })

                        return;
                    }
                }
                else if (change == "previous" && change != undefined) {
                    this.section--;
                    if (this.section == 2) {
                        this.isHidePRevious = false;
                    }
                }
                if (this.patientType == "Patient" && this.section == 6 && data.skipSectionAnswer && data.skipSectionAnswer == '<6 months') {
                    this.questionsList = this.questionsMap.get(this.section);
                    this.questionsList.splice(1, 1);
                    this.isSpinner = false;
                }
                else if (this.patientType == "Patient" && this.section == 6 && data.skipSectionAnswer && (data.skipSectionAnswer == '6mos-1 year' || data.skipSectionAnswer == '1-2 years' || data.skipSectionAnswer == '2-3 years')) {
                    this.questionsList = this.questionsMap.get(this.section);
                    this.questionsList.splice(0, 1);
                    this.isSpinner = false;

                }
                else if (this.patientType == "Caretaker" && this.section == 5 && data.skipSectionAnswer && (data.skipSectionAnswer.length == 2) && (data.skipSectionAnswer[1].answer == 'No' || data.skipSectionAnswer[1].answer == "Don't know") && (change != "previous") && (change != "next")) {
                    this.isSpinner = true;
                    this.section++;
                    this.questionsList = this.questionsMap.get(this.section);
                    this.isSpinner = false;
                }
                else if (change == "previous" && this.patientType == "Caretaker" && this.section == 6 && data.skipSectionAnswer && (data.skipSectionAnswer.length == 2) && (data.skipSectionAnswer[1].answer == 'No' || data.skipSectionAnswer[1].answer == "Don't know")) {
                    this.section--;
                    this.questionsList = this.questionsMap.get(this.section);
                    this.isSpinner = false;
                }
                else {
                    this.questionsList = this.questionsMap.get(this.section);
                    this.isSpinner = false;
                    if (this.section == 2 && this.patientType == 'Patient') {
                        let q1ans = '';
                        this.questionsList && this.questionsList.forEach(each => {
                            if (each.question.Order__c == 1 && each.answer && each.answer.Text_Response_Value__c) {
                                q1ans = each.answer.Text_Response_Value__c
                            }
                            if (each.question.Order__c == 12 && each.answer) {
                                each.answer.q1ans = q1ans;
                            }
                        })
                    }
                    console.log("this.questionsList ", this.questionsList);
                }
                if (this.patientType == "Caretaker" && this.section == 6 && data.sec1q5 == "I currently take care of the patient") {
                    this.questionsList.splice(3, 2);
                    this.isSpinner = false;
                }
                else if (this.patientType == "Caretaker" && this.section == 6 && data.sec1q5 == "I no longer take care of the patient") {
                    this.questionsList.splice(0, 3);
                    this.isSpinner = false;
                }

                this.questionsList && this.questionsList.forEach(currentItem => {
                    currentItem.isFirstTime = false;
                    currentItem.display = true;
                });
                if (this.questionsMap && this.questionsMap.get(this.section) && this.questionsMap.get(this.section)[0].question) {
                    this.sectionName = JSON.parse(this.questionsMap.get(this.section)[0].question.Section_Name__c).name;
                    this.transitionmessage = JSON.parse(this.questionsMap.get(this.section)[0].question.Section_Name__c).transitionmessage;
                    console.log("questions length", this.questionsMap.get(this.section).length);
                    console.log("questions in this section", this.questionsMap.get(this.section));
                }
                this.template.querySelectorAll('c-transplant-multi-questions').forEach(each => {
                    each.question.className == "questiondisplay";
                    if (change == "previous") {
                        this.questionsList && this.questionsList.forEach(currentItem => {
                            currentItem.isFirstTime = true;
                        });
                    }
                })
                if (this.questionsMap.size == 1) {
                    this.isHidePRevious = false;
                }
                this.progress = this.section ? ((((this.section) - 1) / 10) * 100) + 40 : 0;
                console.log('this section', this.section);
                console.log('the progress', this.progress);

                let tempList = [];

                try {

                    this.questionsList && this.questionsList.forEach(each => {
                        if (each.question.skipNumberTransplant__c) {
                            console.log(each.question.Order__c);
                            JSON.parse(each.question.skipNumberTransplant__c).forEach(skipValue => {
                                if (skipValue.value == each?.answer?.Text_Response_Value__c && skipValue.hiddenquestions.length > 0) {
                                    skipValue.hiddenquestions.forEach(item => {
                                        tempList.push(item);
                                    })
                                }
                            })
                        }
                    })
                } catch (e) {
                    console.log("error  in skip handler", e);
                }
                this.hiddenQuestions = tempList.join();
                this.questionsList && this.questionsList.forEach(each => { each.question.className = "questiondisplay" })
                console.log("this.hiddenQuestionst", this.hiddenQuestions);
                console.log("each tempList", JSON.stringify(tempList));
                this.questionsList && this.questionsList.forEach(each => {
                    tempList.forEach(hiddenqno => {
                        if (each.question.Order__c == hiddenqno) {
                            each.question.className = "questionhide"
                        }
                    })
                })
            })
            .catch(error => {
                console.log("error in getQuestionsData", error);
            })


    }



    saveAnswer() {
        let answersList = [];
        this.template.querySelectorAll('c-transplant-multi-questions').forEach(each => {

            let surveyAnswer = { 'sobjectType': 'Advanced_Survey_Answer__c' };
            surveyAnswer.Advanced_Survey_Question__c = each.question.Id;
            surveyAnswer.Advanced_Survey_Response__c = this.responseId;
            surveyAnswer.PLM_User__c = this.accountId;
            surveyAnswer.Text_Response_Value__c = each.selectedValue;
            surveyAnswer.Other_Response_Value__c = each.otherResponseValue;
            surveyAnswer.NestedOptionsData__c = JSON.stringify(each.nestedOptionsData);
            answersList.push(surveyAnswer);
        })
        console.log("answers data from a section screen in js", answersList);

        insertSurveyAnswer({ answerList: answersList, surveyid: this.surveyid, accountId: this.accountId, currentSection: (this.section + 1).toString(), surveyType: this.surveyType })
            .then(data => {
                console.log("data", data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
    }

    previousHandler(event) {
        window.scroll(0, 0);
        // this.isLoading = false;
        //         var flagCheck = false;
        //         let i=1;
        //         while(this.questionMap.get(this.question.Order__c-i).answer==null){
        //             i++;
        //         }
        //         this.question=this.questionMap.get(this.question.Order__c-i).question;
        //         this.lastAnsweredQn = this.question.Order__c -i;
        if (this.section == 1) {
            this.isHidePrevious = false;
        }
        else {
            this.getQuestionsData("previous");
            this.template.querySelectorAll('c-transplant-multi-questions').forEach(each => {
                each.clearAnswer();
                this.questionsList && this.questionsList.forEach(curItem => {
                    if (each.question.Order__c == curItem.question.Order__c) {
                        console.log("question display", each.question.Order__c, "diplsy type is", curItem.display);
                    }
                })

            })
        }
    }
    handleExit() {
        this.isShowModal = true;
    }
    hideModalBox() {
        this.isShowModal = false;
    }
    plmRedirection() {
        transplantUserStamp({ lastStamp: window.location.href.split('/s/')[1] })
            .then(data => {
                console.log("data ", data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
        window.location.replace("https://www.patientslikeme.com/users/sign_in");
    }



    nextHandler(event) {
        //newly added 
        window.scroll(0, 0);
        console.log("test", this.section);

        console.log("questiosns", this.questionType);
        let flag = true;
        this.template.querySelectorAll('c-transplant-multi-questions').forEach(each => {
            if (each.className == "questiondisplay") {
                if (!each.validations()) {
                    flag = false;
                    console.log('valid1');
                }
            }
        })
        console.log('flag' + flag)
        if (!flag) {
            return flag;
        }
        if (this.section == 1) {
            this.isHideNext = true;
            console.log("test", this.section);
            console.log("questiosns", this.questionType);
            updateNextPageName(window.location.href.split('/')[5],this.patientType)
                .then(result => {
                    switch (this.questionType) {
                        case "Transplant-Baseline":
                            this.navigate('Transplant_Webinar_Welcome__c');
                            break;
                        case "Transplant-Pre-webinar":
                            this.navigate('TransplantWebinar__c');
                            break;
                        case "Transplant-Survey-1":
                            this.navigate('Transplant_Survey_Completion__c');
                            break;
                        case "Transplant-Post-webinar":
                            this.navigate('Transplant_Survey_Link__c');
                            console.log('vikas');
                            break;
                        case "Transplant-Questions":
                            this.navigate('Transplant_Webinar_Welcome__c');
                            break;
                    }
                })
                .catch(error => { })

        }
        else if (this.section == 6 && this.patientType == 'Patient') {
            updateNextPageName(window.location.href.split('/')[5])
                .then(result => {
                    this.navigate('Transplant_Survey_Completion__c');
                })
                .catch(error => { })

        }
        else if (this.section == 6 && this.patientType == 'Caretaker') {
            updateNextPageName(window.location.href.split('/')[5],this.patientType)
                .then(result => {
                    this.navigate('Transplant_Caretaker_Survey_Thankyou__c');
                })
                .catch(error => { })

        }

        // else {
        this.isHideNext = true;
        console.log("test", this.section);
        this.saveAnswer();
        this.template.querySelectorAll('c-transplant-multi-questions').forEach(each => {
            each.clearAnswer();
        })
        this.getQuestionsData("next");
        // }
        console.log('testsec', this.section)
        this.isHidePRevious = true;

    }

    navigate(navigateToPageName) {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: { name: navigateToPageName }
        });
    }

    skipChangeHandler(event) {
        try {
            console.log('skiptest', JSON.stringify(event.detail));
            var visibleQuestions = JSON.parse(JSON.stringify(event.detail.visiblequestions));
            var hideQuestions = JSON.parse(JSON.stringify(event.detail.hidequestions));
            var currentqno = Number(event.detail.qno);
            this.template.querySelectorAll('c-transplant-multi-questions').forEach(each => {
                let skippedQuestions = [];
                if (visibleQuestions.includes(each.question.Order__c) && visibleQuestions.length != 0) {
                    each.className = "questiondisplay";
                }
                if (hideQuestions.includes(each.question.Order__c) && hideQuestions.length != 0) {
                    each.className = "questionhide";
                    skippedQuestions.push(hideQuestions);
                    if (each.question.Order__c == currentqno) {
                        each.skippedquestion = JSON.stringify(skippedQuestions);
                    }
                }
            })
            /* this.template.querySelectorAll('c-transplant-multi-questions').forEach(each => {
                if (hideQuestions.includes(each.question.Order__c) && hideQuestions.length != 0) {
                    each.className = "questionhide";
                }
            }) */
            console.log("questionsList", this.questionsList);
        }
        catch (e) {
            console.log("error  in skip handler", e);
        }
    }

    tableValiadtionHandler(event) {
        console.log("evnt.target.value", event.detail);
        // this.tableValidation = event.detail;
        this.tableValidation = event.detail;
        this.template.querySelectorAll('c-transplant-multi-questions').forEach(each => {
            if (each.question.Order__c == 12)
                each.tableDisable(this.tableValidation);
        })

    }
    tableDataHandler() {
        this.template.querySelectorAll('c-transplant-multi-questions').forEach(each => {
            if (each.question.Order__c == 12)
                each.tableDisable(this.tableValidation);
        })
    }
}