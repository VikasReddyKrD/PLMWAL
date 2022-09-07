import { LightningElement, track, wire, api } from 'lwc';
import getQuestions from '@salesforce/apex/GoalQuestions.getQuestions';

import refreshChecklist from '@salesforce/messageChannel/refreshChecklist__c';
import { MessageContext, publish } from 'lightning/messageService';
import insertSurveyResponse from '@salesforce/apex/GoalQuestions.insertSurveyResponse';

export default class Mdd_content_main extends LightningElement {

    @api periodType;
    @api accountId;
    @api currentGoalCount;
    questionsMap = new Map();
    questionsList = new Array();
    section;
    showPreviousNext = false;
    showNext = false;
    showSave = false;
    openModal = false;
    isModalOpen= false;
    sectionName;
    answerMap = new Map();
    answersSelected;
    isDisplayQuestions = true;
    isSummary = false;
    valueMap = { "0x per week": "0", "1x per week": "1", "2x per week": "2", "3x per week": "3", "4x per week": "4", "5x per week": "5", "6x per week": "6", "1x per day": "7", "2x per day": "14", "3x per day": "21" };
    dayMap = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    summary={'goal':'','startdate':{},'importance':''}
    nextHandler() {

        try {
            this.showPreviousNext = true;
            this.showNext = false;
            console.log("this.questionsMap.size is", this.questionsMap.size, "this.section is", this.section);
            if (this.section + 1 >= this.questionsMap.size) {
                this.showPreviousNext = false;
                this.showNext = false;
                this.showSave = true;
            }
            this.answersSelected = [];
            let currentAnswers = [];
            this.answerMap.forEach(function (value, key) {
                currentAnswers.push(key + "=>" + value);
            })
            this.answersSelected = currentAnswers;
            this.template.querySelectorAll('c-mdd_goal_question').forEach(each => {
                each.refreshValues();

            })
            this.section++;
            this.questionsList = this.questionsMap.get(this.section);
            this.sectionName = JSON.parse(this.questionsList[0].Step_Name__c).name;
            console.log("this.questionsList in next handler", this.questionsList);
            //if(this.se)
        }
        catch (e) {
            console.log("error ", e)
        }
    }


    previousHandler() {

        if (this.section == 1) {
            this.showNext = true;
            this.showPreviousNext = false;
        }
        this.section--;
        this.answersSelected = new Array();
        this.answerMap.forEach(function (value, key) {
            this.answersSelected.push(key + "=>" + value);
        })
        /* this.template.querySelectorAll('c-mdd_goal_question').forEach(each=>{
            each.answersMapFromParent(answersSelected);
            console.log("in loop",each.answerMap);
        }) */
        this.questionsList = this.questionsMap.get(this.section);
        this.sectionName = JSON.parse(this.questionsList[0].Step_Name__c).name;
        console.log("this.questionsList in previous handler", this.questionsList);
    }



    @api
    openModalPopup() {
        /* if (this.currentGoalCount >= 2) {
            this.isShowAnotherDis = true;
        } */
        if (this.periodType != 'Session 1') {
            this.session = 2;
        }
        else
            this.session = 1;
        this.showNext = true;
        this.openModal = true;
        this.section = 1;
        getQuestions()
            .then(data => {
                data.forEach(currentItem => {
                    let step = JSON.parse(currentItem.Step_Name__c).step;
                    if (this.questionsMap.has(step)) {
                        let questionsList = this.questionsMap.get(step);
                        questionsList.push(currentItem);
                        this.questionsMap.set(step, questionsList);
                    }
                    else {
                        let questionsList = new Array();
                        questionsList.push(currentItem);
                        this.questionsMap.set(step, questionsList);
                    }
                });

                console.log("this.questionsMap", this.questionsMap);
                this.questionsList = this.questionsMap.get(this.section);
                this.sectionName = JSON.parse(this.questionsList[0].Step_Name__c).name;
            })
            .catch(error => {
                console.log("error in fetching goals", +JSON.stringify(error));
            })
    }

    closeModal() {
        this.openModal = false;
    }
    Closepopup(){
        this.openModal = false;
    }
    answersChangeHandler(event) {
        this.answerMap.set(event.detail.questionno, event.detail.answer);
        console.log("this.answerMap after setting is", this.answerMap)
        let answersSelected = [];

        this.answerMap.forEach(function (value, key) {
            answersSelected.push(key + "=>" + value);
        })

        this.template.querySelectorAll('c-mdd_goal_question').forEach(each => {
            each.fetchAnswersInsamePage(answersSelected);

        })
        console.log("in loop", answersSelected);
    }


    handleFinish() {

        try {
            console.log("periodType", this.periodType);
            console.log("accountId", this.accountId);
            console.log("currentGoalCount", this.currentGoalCount);
            let goalResponse = { 'sobjectType': 'Goal_Response__c' };
            goalResponse.Account__c = this.accountId;
            goalResponse.Goal_Seq__c = this.currentGoalCount + 1;
            goalResponse.Period_Type__c = this.periodType;
            goalResponse.Performance__c = this.answerMap.get(2);
            goalResponse.Condition__c = this.answerMap.get(3);
            goalResponse.Difficult__c = this.answerMap.get(6);
            goalResponse.Importance__c = this.answerMap.get(7);
            goalResponse.Baseline__c = this.answerMap.get(5);
            goalResponse.Baseline_Value__c = this.valueMap[this.answerMap.get(5)];
            goalResponse.Criterion__c = this.answerMap.get(4);
            goalResponse.Criterion_Value__c = this.valueMap[this.answerMap.get(4)];
            goalResponse.Frequency_Surp_12_wks__c = this.answerMap.get(9);
            goalResponse.Frequency_Surp_12_wks_Value__c = this.valueMap[this.answerMap.get(9)];
            goalResponse.Frequency_Significant_Surp_12_wks__c = this.answerMap.get(10);
            goalResponse.Frequency_Significant_Surp_12_wks_Value__c = this.valueMap[this.answerMap.get(10)];
            goalResponse.Frequency_6_wks__c = this.answerMap.get(8);
            goalResponse.Frequency_6_wks_Value__c = this.valueMap[this.answerMap.get(8)];
            goalResponse.Main_Category__c = this.answerMap.get(1).split(",")[0];
            goalResponse.Category__c = this.answerMap.get(1).split(",")[1];

            insertSurveyResponse({ goalResponse: goalResponse })
                .then(data => {
                    if (data) {
                        this.openModal = false;
                        // const selectedEvent = new CustomEvent("cmprefresh", {
                        //     detail: true
                        // });

                        // // Dispatches the event.
                        // this.dispatchEvent(selectedEvent);
                    location.reload();
                    console.log("Goal reponse inserted successfully")

                }
       })
       
       .catch (error=> {
            console.log("error in response insertion", error);
        })
    } catch(e) {
        console.log(e)
    }

    
    //performane = 2nd sec 1 st q
    //conditino =2nd sec 2 nd q
    //difficult =2nd sec  5 ques
    //Importance = 2 nd sec 6 q
    //baseline = 2nd sec 4 q
    //criterion = 3 rd q
    // freq srp 12 weeks=3 rd section 2nd q
    // freq srp 6 weeks=3 rd section 1nd q
    //sig surpass 12 week = 3rd sec srd q

}

    handleNext(event){
        console.log("test");
        this.summary.goal = this.answerMap.get(2);
        let today = new Date();
        this.summary.startdate = this.dayMap[today.getDay()]+", "+this.month[today.getMonth()]+" "+today.getDate();
        this.summary.importance = this.answerMap.get(7);
        this.summary.difficulty = this.answerMap.get(6);
        this.isDisplayQuestions = false;
    }   
}