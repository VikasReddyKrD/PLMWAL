import { LightningElement, wire, api, track } from 'lwc';
import getQuestionsWithSections from '@salesforce/apex/SurveyController.getQuestionsWithSections';
import insertSurveyAnswer from '@salesforce/apex/SurveyController.insertSurveyAnswer';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';
import { NavigationMixin } from 'lightning/navigation';

export default class PrintMddSurvey extends NavigationMixin(LightningElement) {
    surveyQuestionData;
    sectionsData;
    sectionName;
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
    @api surveyId;
    @track lastpage = false;
    currentSection = "";
    isSpinner = false;
    nextLabel = "Next";
    connectedCallback() {
        this.isSpinner = true;
        this.getQuestionsData();

    }

    getQuestionsData(previous, next) {
        console.log('week number', this.week, 'surveyid', this.surveyId);
        getQuestionsWithSections({ surveyId: 'a1ee000000fSJc7AAG', week: 'Week1' })
            .then((data, index) => {
                console.log('week number', this.week, 'surveyid', this.surveyId);
                console.log(JSON.stringify(data));
                this.sectionsData = data;
                this.isSpinner = false;
            })
            .catch(error => {
            })
    }

     downloadSurvey(event) {
        try {
            // const chartObjs = this.template.querySelectorAll('c-pro-results');
            this.template.querySelectorAll('c-mdd-report-chart-j-s-chart-l-w-c').forEach(each => { each.className = 'slds-no-print' })


            window.print();
        }
        catch (error) {
            console.error('Error occured while downloading the chart: ' + error.message);
        }
    }


}