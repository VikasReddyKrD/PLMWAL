import { LightningElement, wire, api, track } from 'lwc';
import getQuestionsWithSections from '@salesforce/apex/SurveyController.getQuestionsWithSections';
import insertSurveyAnswer from '@salesforce/apex/SurveyController.insertSurveyAnswer';
import surveyFlow from '@salesforce/apex/SurveyController.surveyFlow';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';
import { NavigationMixin } from 'lightning/navigation';

export default class SurveyContainerNew extends NavigationMixin(LightningElement) {
    surveyQuestionData;
    sectionsData;
    sectionName;
    transitionMessage;
    @track surveyData;
    section = 0;
    progress;
    hidePrevious = false;
    hideNext = false;
    isLoading = false;
    selectedAnswers;
    @api surveyNumber;
    @api accountId;
    @api responseId;
    @api week;
    @api surveyid;
    @api surveyName;
    @track lastpage = false;
    currentSection = "";
    isSpinner = false;
    nextLabel = "Next";
    isIntro = false;
    questionsDisplay = false;
    displaythankyou = false;
    survey1thankyou = false;
    survey2thankyou = false;
    survey3thankyou = false;
    isFooterDisplay = true;
    isModalOpen;
    @track pdq5MultiScreen=false;
    
    connectedCallback() {
        
        if (this.surveyNumber == "MDD-Survey-1") {
            this.survey1thankyou = true;
        }
         else if (this.surveyNumber == "MDD-Survey-2") {
            this.survey2thankyou = true;
        } 
        else if (this.surveyNumber == "MDD-Survey-3") {
            this.survey3thankyou = true;
        }
        this.isSpinner = true;
        surveyFlow({ surveyNumber: this.surveyNumber })
            .then(data => {
                console.log('data', JSON.stringify(data));

                this.surveyid = data.surveyId;
                this.responseId = data.responseId;
                this.accountId = data.accountId;
                if (data.message == "response created successfully") {
                    this.isIntro = true;
                    console.log("data in surveyFlow========>", data);
                }
                console.log('week', this.week, 'isIntro', this.isIntro, this.surveyNumber, 'surveyNumber', 'surveyName', this.surveyName);

                this.getQuestionsData();
                this.progress = ((this.section + 1) / this.sectionsData.length) * 100;
               
            })
            .catch(error => {

            })          
}
    getQuestionsData(previous, next) {
        console.log("previous", previous, "next", next);
        getQuestionsWithSections({ surveyId: this.surveyid, week: this.week })
            .then((data, index) => {
                try{

                console.log('week number', this.week, 'surveyid', this.surveyid);
                console.log('data from apex ' + JSON.stringify(data));
                this.sectionsData = data;
                console.log("in 37", this.currentSection)
                this.currentSection = this.sectionsData[this.section].currentSection != undefined ? this.sectionsData[this.section].currentSection : undefined;
                if (this.sectionsData.length == 1 || this.currentSection == this.sectionsData.length - 1) {
                    // this.nextLabel = "Finish";
                }
                console.log("in 40");

                if (this.currentSection != undefined && previous == undefined) {
                    console.log("tesingggg", this.section);
                    //commenting for part2
                   // this.section = Number(this.currentSection);
                }
                console.log("in 46");
                if (previous == undefined && next == undefined) {
                    this.sectionName = JSON.parse(this.sectionsData[this.section].section).name;
                    this.transitionMessage = JSON.parse(this.sectionsData[this.section].section).transitionmessage;
                    this.surveyData = this.sectionsData[this.section].surveyInformation;
                    if(this.sectionsData[this.section]?.surveyInformation[0]?.questions.Question_Text__c=="Perceived Deficits Questionnaire - Depression (PDQ-D5)"){
                        this.isFooterDisplay=false
                     }else{
                         this.isFooterDisplay=true
                     }
                }
                else if (previous && !next) {
                    this.sectionName = JSON.parse(this.sectionsData[this.section].section).name;
                    this.transitionMessage = JSON.parse(this.sectionsData[this.section].section).transitionmessage;
                    this.surveyData = this.sectionsData[this.section].surveyInformation;
                    console.log("In previous stage====>", this.surveyData);
                    if(this.sectionsData[this.section]?.surveyInformation[0]?.questions.Question_Text__c=="Perceived Deficits Questionnaire - Depression (PDQ-D5)"){
                        this.isFooterDisplay=false
                     }else{
                         this.isFooterDisplay=true
                     }
                }
                else if (!previous && next) {
                    this.sectionName = JSON.parse(this.sectionsData[this.section].section).name;
                    this.transitionMessage = JSON.parse(this.sectionsData[this.section].section).transitionmessage;
                    this.surveyData = this.sectionsData[this.section].surveyInformation;
                    if(this.sectionsData[this.section]?.surveyInformation[0]?.questions.Question_Text__c=="Perceived Deficits Questionnaire - Depression (PDQ-D5)"){
                       this.isFooterDisplay=false
                    }else{
                        this.isFooterDisplay=true
                    }
                }
                console.log("(this.surveyData", this.sectionsData.length);
                this.hidePrevious = (this.section > 0) ? false : true;
                console.log("section value in connected callback====>", +this.section);
                if(this.sectionsData[0].progressBarValue!=undefined){
                this.progress= this.sectionsData[0].progressBarValue;
            }
                this.isSpinner = false;  
        }
        catch(e){
            console.log("exception ===>",e)
        }
    })
            .catch(error => {
      console.log(JSON.stringify(error));
            })
    }
    //modal popup validation
    modalPopUpHandler(event){
        console.log("inside modalPopUpHandler",event.detail);
        this.isModalOpen = event.detail;
    }
    nextSection(event) {
        console.log('vinay')
        console.log( this.template.querySelectorAll('c-survey-question').length);
        let flag = true;
        this.template.querySelectorAll('c-survey-question').forEach(each => {
            if (!each.validations()) {
                flag = false;
                console.log('valid1');
            }
        })

        
             this.template.querySelectorAll('c-survey-question').forEach(each => {
                console.log('vinay1'); 
                console.log(each.phq9validation());
            if (each.phq9validation()<5) {
                flag = false;
                console.log('valid1');
                each.phq9validationPopup();
                
            }
        })
        



        console.log('flag' + flag)
        if (!flag) {
            return flag;
        }
        if(this.isModalOpen!=undefined){
            if(this.isModalOpen)
            return;
        }
        this.isSpinner = true;
        console.log('section' + this.section);
        console.log('sectionsData' + this.sectionsData.length - 1);
        if (this.sectionsData.length - 1 == this.section) {
            this.displaythankyou = true;
            this.questionsDisplay = true;
            this.isSpinner = false;
        }
        this.currentSection = JSON.parse(this.sectionsData[this.section].section).section;
        this.progress = ((this.section + 1) / this.sectionsData.length) * 100;
        this.saveAnswer();
        this.section++;
        window.scroll(0, 0);
        this.getQuestionsData(false, true);
        
        console.log("this.progress", this.progress);

        

        /* this.template.querySelectorAll('c-survey-question').forEach(each => {
            
            console.log("answer selected in child for question",each.question.Order__c,"is",each.selectedAnswer());
            if(each.selectedAnswer() == undefined){
                each.validations(each.question.Order__c);
            }
        }); */



        /* if(this.section<=this.sectionsData.length){
            this.surveyData = this.sectionsData[this.section].surveyInformation;
        } */
        console.log("this.currentSection", this.currentSection, "this.sectionsData.length - 1", this.sectionsData.length - 1, "this.section", this.section);
        if (this.currentSection == this.sectionsData.length) {
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
            //this.hideNext = true;
            //this.nextLabel ="Finish";
            /* this[NavigationMixin.Navigate]({
           type: 'comm__namedPage',
           attributes: {
               name: 'Home'
           },
       }); */
        }
        if (this.section > this.sectionsData.length - 1) {
            //  location.href = "https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys";
        }
        //this.hidePrevious = false;
        //this.sectionName = JSON.parse(this.sectionsData[this.section].section).name;
 }

     
progressBarValue(Progress){
let newProgressValue=Progress;
    console.log('progressBarValue');
    console.log('Value1'+newProgressValue);
    console.log('Value2'+this.accountId);
    //, progressBarValue:newProgressValue
}


    handleSaveAndContinueLater() {
        this.isSpinner = true;
        console.log('section' + this.section);
        console.log('sectionsData' + this.sectionsData.length - 1);
        if (this.sectionsData.length - 1 == this.section) {
            this.displaythankyou = true;
            this.questionsDisplay = true;
            this.isSpinner = false;
        }
        this.currentSection = JSON.parse(this.sectionsData[this.section].section).section;
        this.saveAnswer();
        window.location.href = 'https://www.patientslikeme.com/users/sign_in';
    }
    saveAnswer() {
        try{
          
        
        let answersList = [];
        this.template.querySelectorAll('c-survey-question').forEach(each => {
            //need to set it to true
            this.isLoading = false;
            let surveyAnswer = { 'sobjectType': 'Advanced_Survey_Answer__c' };
            surveyAnswer.Advanced_Survey_Question__c = each.question.Id;
            surveyAnswer.Advanced_Survey_Response__c = this.responseId;
            surveyAnswer.PLM_User__c = this.accountId;

            surveyAnswer.Week__c = this.week;
            console.log("display type in save answer", each.question.Display_Type__c,each.question.Order__c);
            surveyAnswer.Text_Response_Value__c = each.selectedAnswer()!=undefined?JSON.parse(each.selectedAnswer()):'';
            console.log("displayed answers",each.selectedAnswer());
            surveyAnswer.Other_Response_Value__c = each.saveOtherValues();
            console.log("each.question.Week_Number__c", each.question.Week_Number__c);
            surveyAnswer.Week__c = each.question.Week_Number__c;
            console.log("surveyAnswer", surveyAnswer);
            answersList.push(surveyAnswer);
            
        })
        console.log("answers data from a ssection screen", answersList);
        console.log('insert'+this.progress);
        insertSurveyAnswer({ answerList: answersList, surveyid: this.surveyid, week: this.week, accountId: this.accountId, currentSection: (this.currentSection != undefined) ? this.currentSection.toString() : "" ,
        progressBarValue:this.progress})
            .then(result => {
                this.isSpinner = false;
                result ? console.log("inserted successfully") : console.log("insertion failed");

            })
          .catch(error=>{
             console.log("error",error);
         }) 
        }
        catch(e){
            console.log("print",e);
        }
    }
    previousSection(event) {
        if(this.pdq5MultiScreen){
            this.pdq5MultiScreen = false;
        }
        this.section--;
        window.scroll(0, 0);
        console.log("this.section", this.section);
        this.getQuestionsData(true, false);
        this.hideNext = false;
        if (this.section == 0) {
            this.hidePrevious = true;
            return;
        }
    }
    navigateToResource() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Resources__c'
            },
        });
    }
     endRedirect() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Goals__c'
            },
        });
    }
    navigateToSurvey() {
       window.location.href=window.location.href 
    }

pdq5Elemnt(event){
    console.log('contest',event.detail);
    this.pdq5MultiScreen=event.detail
    console.log('contest',this.pdq5MultiScreen);
    this.isFooterDisplay=event.detail
}

    /*  handleLastPage(event){
    console.log("lastpage :::",event.detail);
    this.lastpage = event.detail;
    this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Home'
                },
            });
    }   */

}