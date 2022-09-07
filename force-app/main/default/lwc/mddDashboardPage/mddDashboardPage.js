import { LightningElement } from 'lwc';
import getExistingSurvey from '@salesforce/apex/SurveyController.getExistingSurvey';
import getGoals from '@salesforce/apex/SurveyController.getGoalsCount';
import getPROCount from '@salesforce/apex/SurveyController.getPROCount';
import fetchConsentData from '@salesforce/apex/SurveyController.fetchConsentData';
import { NavigationMixin } from 'lightning/navigation';
import starsymbol from '@salesforce/resourceUrl/starsymbol';
export default class MddDashboardPage extends NavigationMixin(LightningElement) {
    isFirstStep = false;
    isSurvey1 = false;
    isSurvey2 = false;
    isSurvey3 = false;
    isgoal = false;
    isPro = false;
    goalHead='h2plus';
    goalPara='pt-10p fs-16lh24';

    connectedCallback() {

        getExistingSurvey()
            .then(data => {
                console.log("data in mddDashboardPage", data);
                this.isFirstStep = (data.completeWeek1__c == false) ? true : false;
                console.log('data', data.completeWeek1__c);
                if (!data.completeWeek1__c) {
                    this.isFirstStep = true;
                    this.isSurvey1 = true;
                }
                else if (data.completeWeek1__c && data.Current_Wk__c == undefined) {
                    console.log('else-1'+data.completeWeek1__c && data.Current_Wk__c == null);
                    this.isFirstStep = false;
                }
                else if (!data.completeWeek2__c) {
                    this.isFirstStep = true;
                    this.isSurvey1 = true;
                }
                else if (data.completeWeek2__c && data.Current_Wk__c == 2) {
                    this.isFirstStep = false;
                }
                else if (!data.completeWeek12__c) {
                    this.isFirstStep = true;
                    this.isSurvey2 = true;
                }
                else if (data.completeWeek12__c && data.Current_Wk__c == 12) {
                    this.isFirstStep = false;
                }
                else if (!data.completeWeek13__c) {
                    this.isFirstStep = true;
                    this.isSurvey2 = true;
                }
                else if (data.completeWeek13__c && data.Current_Wk_Session2__c == undefined ) {
                    this.isFirstStep = false;
                }
                else if (!data.completeWeek23__c) {
                    this.isFirstStep = true;
                    this.isSurvey3 = true;
                }
                else if (data.completeWeek23__c && data.Current_Wk_Session2__c == 11) {
                    this.isFirstStep = false;
                }
                else if (!data.completeWeek24__c) {
                    this.isFirstStep = true;
                    this.isSurvey3 = true;
                }
                else if (data.completeWeek24__c && data.Current_Wk_Session2__c == 12) {
                    this.isFirstStep = false;
                }
            })
            .catch(error => {
                console.log("error in mddDashboardPage", error)
            })


             getGoals()
            .then(data=>{
                console.log("goals",JSON.stringify(data));
                if(data>0){
                        this.isgoal = true;
                }
                else{
                    this.isgoal = false;
                }
            })
            .catch(error=>{
                console.log("error in 74",error);
            })

             getPROCount()
            .then(data=>{
                console.log("goals",JSON.stringify(data));
                if(data>0){
                        this.isPro = true;
                }
                else{
                    this.isPro = false;
                }
            })
            .catch(error=>{
                console.log("error in 74",error);
            }) 
    }
    starsymbol = starsymbol;

    surveyPage() {
        /* this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Goals__c'
            },
        }); */
        this.template.querySelector('c-mdd-goals-chart-container').handleChildFromDashboard();
    }
    surveyPageRedirection(event) {
        fetchConsentData()
            .then(data=>{
                console.log("data",data);
             if(!data){
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'MddLandingPage__c'
                    },
                }); 
             }
             else {
                window.location.href = window.location.href + 'surveys?c__ismodalopen=true';
             }
            })
            .catch(error=>{
                console.log("error in 74",error);
            }) 
      
        /* this[NavigationMixin.Navigate]({
           type: 'comm__namedPage',
           attributes: {
               name: 'Surveys__c'
           },
           state: {
               c__ismodalopen : true
           }
       }); */
    }

    callFromChild(event){    
         this.template.querySelectorAll('c-pro-results').forEach(each=>{ each.className ='slds-no-print'
         console.log(each.classname)})
            window.print();
            this.template.querySelectorAll('c-pro-results').forEach(each=>{ each.className =''
         console.log(each.classname)})
    }

    callFromChild1(event){
        this.template.querySelectorAll('c-mdd-goals-chart-container').forEach(each => { each.className = 'slds-no-print' 
        console.log(each.className)})
        this.goalHead='slds-no-print';
        this.goalPara='slds-no-print';
            window.print();
            this.template.querySelectorAll('c-mdd-goals-chart-container').forEach(each => { each.className = '' 
        console.log(each.className)})
        this.goalHead='h2plus';
        this.goalPara='pt-10p fs-16lh24';
    }

}