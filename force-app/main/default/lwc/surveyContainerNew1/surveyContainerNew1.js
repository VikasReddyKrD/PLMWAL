import { LightningElement,wire ,api} from 'lwc';
import getQuestionsWithSections from '@salesforce/apex/SurveyController.getQuestionsWithSections';
export default class SurveyContainerNew1 extends LightningElement {
    surveyQuestionData;
    sectionsData;
    questionList;
    section = 0;
    hidePrevious = false;
    hideNext = false;
    @api week;
    @api surveyId;
    connectedCallback() {
       this.hidePrevious = true;
       getQuestionsWithSections({surveyId:this.surveyId,week: this.week})
       .then((data,index)=>{
           //alert('week6');
           console.log('vinay');
           console.log('vinay'+JSON.stringify(data));
           console.log('data '+data[1].questions.length);
           this.sectionsData=data;
           this.questionList = this.sectionsData[this.section].questions;
       }) 
       .catch(error=>{

       })
    }
    nextSection(event){
     
      console.log('inside Next Handler');
      
        const returnVal = this.template.querySelector('c-survey-question').validations();
        console.log('returnVal --->>>' + returnVal);
        if (returnVal === true) {
            if(this.question.Display_Type__c !=="Intro"){
             //   if(!this.modalPopupFlag ){
                this.saveAnswer();
            //    }
            }
            else 
            console.log('hello next');
                this.navigateNextQuestion();
            }
            
        this.section++;
        this.questionList = this.sectionsData[this.section].questions;
        if(this.section == this.sectionsData.length-1 ){
            this.hideNext = true;
        }
        this.hidePrevious = false;
         
        
        


    }
    previousSection(event){
        this.hideNext = false;
        if(this.section == 0){
            this.hidePrevious = true;
            return;
        }
        this.section--;
        this.questionList = this.sectionsData[this.section].questions;
    }

}