//import { LightningElement } from 'lwc';
import getCurrentPageDetails from '@salesforce/apex/StudyConsentController.getCurrentPage';
//import { NavigationMixin } from 'lightning/navigation';
//import transplantUserStamp from '@salesforce/apex/TransplantSurveyController.transplantUserStamp';
import transplantUserStamp from '@salesforce/apex/TransplantSurveyController.transplantUserStamp';
import userType from '@salesforce/apex/TransplantSurveyController.getSurveyType';
function verifyLastVisitPage(currentCmp,NavigationMixin){
        let lastVisitPagePromise = new Promise(function(resolve,reject){
            console.log("inside transplantCurrentPAge");
         let currentPage =window.location.href.split('/s/')[1]; 
         //let currentCmp  = this;
            getCurrentPageDetails()
            .then(result=>{
                if(result){
                     let isConsent = result.split(":")[0];
                     let lastLoginPage =  result.split(":")[1];
                     let nextPage = '';

                     let pageInfo = new Map([['transplant-questions','Transplant_questions__c'],
                     ['transplant-survey-consent','Transplant_survey_consent__c'],
                     ['transplantsurveywelcomepage','TransplantSurveyWelcomePage__c'],
                     ['transplant-webinar-welcome','Transplant_Webinar_Welcome__c'],
                     ['transplant-baseline-survey','Transplant_Baseline_Survey__c'],
                     ['transplant-pre-webinar','Transplant_Pre_Webinar__c'],
                     ['transplantwebinar','TransplantWebinar__c'],
                     ['transplant-post-webinar-questions','Transplant_Post_Webinar_Questions__c'],
                     ['transplant-survey-link','Transplant_Survey_Link__c'],
                     ['transplant-survey-welcome','Transplant_Survey_Welcome__c'],
                     ['transplant-survey-completion','Transplant_Survey_Completion__c'],
                     ['transplantsurveydatasync','TransplantSurveyDataSync__c'],
                     ['transplant-caretaker-survey-thankyou','Transplant_Caretaker_Survey_Thankyou__c']
                    ]);

                     if(currentPage != lastLoginPage){
                        if(pageInfo.has(lastLoginPage)){
                            nextPage =pageInfo.get(lastLoginPage);
                        }
                        else{
                            nextPage ='Transplant_Consent__c'; 
                        }
                        currentCmp[NavigationMixin.Navigate]({
                            type: 'comm__namedPage',
                            attributes: {
                                name: nextPage
                            }
                        });
                        reject('Patient has already visited the current survey page');
                     }
                     else{
                        resolve("Patient can continue on the current page");
                     }
                }
            })
            .catch(error=>{
                console.log("error",error);
            })
        });
        return lastVisitPagePromise;
      
    } 
/* login(){    
    transplantUserStamp({ lastStamp: window.location.href.split('/s/')[1] })
            .then(data => {
                console.log("data ",data);
            })
            .catch(error => {
                console.log("error in insertSurveyAnswers", JSON.stringify(error));
            })
        }*/
function updateNextPageName(currentPageName,usertype){
    let updatePage = new Promise(function(resolve,reject){
                var updatedPageName;
                var lastLog =[];
                console.log("usertype",usertype);
                if(usertype == "Patient" || !usertype)
                    lastLog = ["transplant-consent","transplant-survey-consent","transplantsurveywelcomepage","transplant-baseline-survey","transplant-webinar-welcome","transplant-pre-webinar","transplantwebinar","transplant-post-webinar-questions","transplant-survey-link","transplant-survey-welcome","transplant-questions","transplant-survey-completion","transplantsurveydatasync"];
                else if(usertype == "Caretaker")
                lastLog = ["transplant-consent","transplant-survey-consent","transplantsurveywelcomepage","transplant-baseline-survey","transplant-webinar-welcome","transplant-pre-webinar","transplantwebinar","transplant-post-webinar-questions","transplant-survey-link","transplant-survey-welcome","transplant-questions","transplant-caretaker-survey-thankyou"];
                lastLog.forEach((currentElemnt,currentElemntidx) =>{
                    let currentValueIndex = currentElemntidx;
                    if(currentElemnt == currentPageName){
                        currentValueIndex++;
                        console.log("this.lastLog[currentValueIndex]",lastLog[currentValueIndex]);
                        updatedPageName  = lastLog[currentValueIndex];
                    }
                 });
                 transplantUserStamp({ lastStamp: updatedPageName })
                 .then(data => {
                    resolve("succesfully updated the next visit page");
                    console.log(data);
                 })
                 .catch(error => {
                    reject("Error ewhile updating the next page name");
                     console.log("error in insertSurveyAnswers", JSON.stringify(error));
                 })
                 
                })
                return updatePage
            
}

export{
    verifyLastVisitPage,
    updateNextPageName
}