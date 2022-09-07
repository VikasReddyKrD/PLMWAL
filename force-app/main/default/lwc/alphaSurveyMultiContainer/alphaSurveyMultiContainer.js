import { LightningElement, api } from 'lwc';
import surveyFlow from '@salesforce/apex/AlphaSurveyMultiQuestionsController.surveyFlow';
import getSurveyQuestions from '@salesforce/apex/AlphaSurveyMultiQuestionsController.getQuestionsWithSections';
import insertMulitipleSurveyAnswers from '@salesforce/apex/AlphaSurveyMultiQuestionsController.insertMulitipleSurveyAnswers';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
export default class AlphaSurveyMultiContainer extends NavigationMixin(LightningElement) {

    transitionmessage;
    sectionName;
    isHidePrevious = true;
    isHideNext = true;
    questionsMap = new Map();
    questionsList = new Array()
    surveyid;
    section = 1;
    hiddenQuestions;
    isDividedTransitionMessage = false;
    transitionMesagePart2
    @api surveyNumber;
    @api questionType;
    @api navigation;
    @api surveyType;
    isContinue = false;
    isShowModal = false;

    connectedCallback() {
        this.surveyFlow();
        console.log('test==>', this.surveyFlow);
    }

    surveyFlow() {
        surveyFlow({ surveyNumber: 'Alpha-Survey-1' })
            .then(data => {
                console.log('data', JSON.stringify(data));
                this.surveyid = data.surveyId;
                this.responseId = data.responseId;
                this.accountId = data.accountId;
                this.getQuestionsData("change section");

            })
            .catch(error => {
                console.log("inside survey flow", error);
            })
    }

    getQuestionsData(change) {
        getSurveyQuestions({ type: this.surveyType, surveyId: this.surveyid })
            .then(data => {
                console.log("data===>", data);
                console.log("change in",change);
                
               
                if (data.currentSection == 10) {
                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'alpha_survey_thank_you__c'
                        },
                    });
                }
                
                this.questionsMap = new Map();
                data.questions.forEach(each => {
                    var section;
                    if (each.question.Section_Name__c) {
                        section = JSON.parse(each.question.Section_Name__c).section;
                    }
                    if (this.questionsMap.has(section)) {
                        var questionsLists = this.questionsMap.get(section);
                        questionsLists.push(each);
                        this.questionsMap.set(section, questionsLists);
                    }
                    else {
                        var questionsLists = new Array();
                        questionsLists.push(each);
                        this.questionsMap.set(section, questionsLists);
                    }
                })
                this.questionsList = undefined;
                if (data.currentSection != undefined && change == "change section") {
                    this.section = (Number(data.currentSection) == 0) ? 1 : (Number(data.currentSection));
                    if (this.section < this.questionsMap.get(this.section) || this.section == 1) {
                        this.isHidePRevious = false;
                    }
                    else {
                        this.isHidePRevious = true;
                    }
                    console.log("current this.section",this.section);
                    
                }
                else if (change == "next") {
                    this.section++;
                    if (this.section != 1) {
                        this.isHidePRevious = true;
                    }
                }
                else if (change == "previous") {
                    this.section--;
                    if (this.section == 1) {
                        this.isHidePRevious = false;
                    }
                }
                if (!this.questionsMap.get(this.section)) {
                    this.section++;
                }
                this.questionsList = this.questionsMap.get(this.section);
                this.questionsList.forEach(each => { each.className = "questiondisplay" })
                console.log("this.questionsList", this.questionsList);
                let tempList = [];
                this.questionsList.forEach(each => {
                    if (each.question.skipNumberTransplant__c) {
                        JSON.parse(each.question.skipNumberTransplant__c).forEach(skipValue => {
                            if (skipValue.value == each?.answer?.Text_Response_Value__c && skipValue.hiddenquestions.length > 0) {
                                skipValue.hiddenquestions.forEach(item => {
                                    tempList.push(item);
                                })
                            }
                            
                        })
                    }
                    if(each.question.Order__c==29 && each?.answer && Number(each?.answer?.Text_Response_Value__c)==0 ||each.question.Order__c==29 && each?.answer && Number(each?.answer?.Text_Response_Value__c)<=1){
                        tempList.push(30, 31, 32);
                    }
                })
                this.hiddenQuestions = tempList.join();
                console.log("this.hiddenQuestionst", this.hiddenQuestions);
                console.log("each tempList", JSON.stringify(tempList));
                this.questionsList.forEach(each => {
                    tempList.forEach(hiddenqno => {
                        if (each.question.Order__c == hiddenqno) {
                            each.className = "questionhide"
                        }
                    })
                })
                this.questionsList.forEach(currentItem => {
                    currentItem.isFirstTime = false;
                    currentItem.answerflag = 0;
                    currentItem.display = true;
                });

                if (this.questionsMap.get(this.section)[0].question) {
                    this.sectionName = JSON.parse(this.questionsMap.get(this.section)[0].question.Section_Name__c).name;
                    let transitionMessage = JSON.parse(this.questionsMap.get(this.section)[0].question.Section_Name__c).transitionmessage;
                    if (transitionMessage.includes("*-")) {
                        this.isDividedTransitionMessage = true;
                        this.transitionmessage = transitionMessage.split("*-")[0];
                        this.transitionMesagePart2 = transitionMessage.split("*-")[1];
                    }
                    else {
                        this.transitionmessage = transitionMessage;
                    }
                }
                this.template.querySelectorAll('c-alpha-survey-multi-questions').forEach(each => {
                    //  each.style = "display:block";
                    if (change == "previous") {
                        this.questionsList.forEach(currentItem => {
                            currentItem.isFirstTime = true;
                        });
                    }
                })
                if(this.section == 9){
                    this.isContinue = true;
                }
                else{
                    this.isContinue = false; 
                }

            })
            .catch(error => {
                console.log("error in getQuestionsData", error);
            })
    }

    saveAnswer() {
        let answersList = [];
        this.template.querySelectorAll('c-alpha-survey-multi-questions').forEach(each => {

            let surveyAnswer = { 'sobjectType': 'Advanced_Survey_Answer__c' };
            surveyAnswer.Advanced_Survey_Question__c = each.question.Id;
            surveyAnswer.Advanced_Survey_Response__c = this.responseId;
            surveyAnswer.PLM_User__c = this.accountId;
            surveyAnswer.Text_Response_Value__c = each.selectedAnswer();
            surveyAnswer.Other_Response_Value__c = each.selectedOtherAnswer();
            //surveyAnswer.skippedQuestions__c=each.skippedquestion
            answersList.push(surveyAnswer);
        })
        console.log("answers data from a section screen in js", answersList);

        insertMulitipleSurveyAnswers({ answerList: answersList, surveyid: this.surveyid, accountId: this.accountId, currentSection: (this.section + 1).toString(), surveyType: this.surveyType })
            .then(data => {
                console.log("data", data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
    }
    scoreSubmitHandler(event){
     this.isContinue = false;
    }
    nextHandler() {
        // this.section++;
        console.log('this.section1',this.section);
       if(this.section == 7 || this.section == 8){
        this.isDividedTransitionMessage = false;
       }

        if (this.section == 9) {
            console.log("TESTING INSIDE IF")
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'alpha_post_survey__c'
                },
            });
        }
        let flag = true;
        this.template.querySelectorAll('c-alpha-survey-multi-questions').forEach(each => {
            if (each.className == "questiondisplay") {
                if (!each.validations()) {
                    flag = false;
                }
            }
        })
        if (!flag) {
            return flag;
        }
        this.saveAnswer();
        this.template.querySelectorAll('c-alpha-survey-multi-questions').forEach(each => {
            each.clearAnswer();
            //each.clearCache();                       
        })
        this.getQuestionsData("next");
        setTimeout(function () { window.scroll(0, 0); }, 500);

    }

    previousHandler() {
        this.isDividedTransitionMessage = false;
        this.isContinue = false;
        window.scroll(0, 0);
        if (this.section == 1) {
            this.isHidePrevious = false;
        } else {
            this.getQuestionsData("previous");
            this.template.querySelectorAll('c-alpha-survey-multi-questions').forEach(each => {
                each.clearAnswer();
                // each.clearCache();
                this.questionsList.forEach(curItem => {
                    if (each.question.Order__c == curItem.question.Order__c) {
                        console.log("question display", each.question.Order__c, "diplsy type is", curItem.display);
                    }
                })

            })
        }
    }

    skipChangeHandler(event) {

        try {

            console.log('skiptest', JSON.stringify(event.detail));
            var visibleQuestions = JSON.parse(JSON.stringify(event.detail.visiblequestions));
            var hideQuestions = JSON.parse(JSON.stringify(event.detail.hidequestions));
            var currentqno = Number(event.detail.qno);
            this.template.querySelectorAll('c-alpha-survey-multi-questions').forEach(each => {
                let skippedQuestions = [];
                if (visibleQuestions.includes(each.question.Order__c) && visibleQuestions.length != 0) {
                    each.className = 'questiondisplay';
                }
                if (hideQuestions.includes(each.question.Order__c) && hideQuestions.length != 0) {
                    each.className = 'questionhide';
                    skippedQuestions.push(hideQuestions);
                    console.log('skippedQuestions', skippedQuestions);
                    console.log('eskip', each.skippedquestion)
                    if (each.question.Order__c == currentqno) {
                        each.skippedquestion = JSON.stringify(skippedQuestions);
                    }
                }
            })
            console.log("questionsList", this.questionsList);
        }
        catch (e) {
            console.log("error  in skip handler", e);
        }

    }

    handleExit() {
        // window.href="https://www.patientslikeme.com/users/sign_in";
        //window.location.replace("https://www.patientslikeme.com/users/sign_in");
        this.isShowModal  = true;
    }
    plmRedirection(){
        window.location.replace("https://www.patientslikeme.com/users/sign_in");
    }
    hideModalBox(){
        this.isShowModal = false;
    }
}