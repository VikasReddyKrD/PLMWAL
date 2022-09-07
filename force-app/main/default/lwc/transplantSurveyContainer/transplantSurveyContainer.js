import { LightningElement, wire, track, api } from 'lwc';
import getSurveyQuestions from '@salesforce/apex/TransplantSurveyController.getSurveyQuestions';
import insertSurveyAnswer from '@salesforce/apex/TransplantSurveyController.insertSurveyAnswer';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import existingSurveyAnswersList from '@salesforce/apex/TransplantSurveyController.fectchAnswers';
import getQuestions from '@salesforce/apex/TransplantSurveyController.getSurveyQuestions';

export default class transplantSurveyContainer extends NavigationMixin(LightningElement) {

    surveyQuestionData;
    questionList;
    questionNumList = [];
    questionMap;
    surveyanswer;
    checkboxValue;
    //questionNum;
    //reinitializeChild = true;
    progress;
    @track question;
    error;
    totalNoofQuestions = 1;
    isResume = false;
    existingAnswers;
    //index=0;
    //@api currentQNo;
    @api surveyId;
    @api accountId;
    @api responseId;
    @api nextQuestionJson;
    @api lastAnsweredQn;
    @api lastAnswerObj;
    @api isQnoDisplay=false;
    //@api finishPage;
    @api saveandExitPage;//='{"type":"comm__namedPage","nameorurl":"Resources__c"}';
    @api surveyNumber;
    @track isLoading = false;
    flagForBack = false;
    modalPopupFlag = false;
    navigateTolastFlag = {"type":"","value":false};
    otherexistinganswer;
    
    connectedCallback(){
        console.log("surveyId "+this.surveyId);
        getQuestions({surveyId: this.surveyId})
        .then(data => {
            this.questionList = undefined;
            this.questionMap = undefined;
            this.questionList = JSON.parse(data);
        if (this.questionList && this.questionList.length > 0) {
            this.totalNoofQuestions = this.questionList.length;
            this.questionMap = new Map();
            for (let i = 0; i < this.questionList.length; i++) {
                if (this.questionMap.has(this.questionList[i].question.Order__c))
                    throw 'multiple questions cannot have same Order Number:' + this.questionList[i].question.Order__c;
                else {
                    this.questionMap.set(this.questionList[i].question.Order__c, this.questionList[i]);
                    this.questionNumList.push(this.questionList[i].question.Order__c);
                }
            }
        }
        console.log('the questionsmap is ' + JSON.stringify(this.questionMap));
            console.log('the questionsmap is ' + JSON.stringify(this.questionMap.get(1)));
            console.log('next question json is ' + this.nextQuestionJson);

            this.lastAnsweredQn = this.lastAnsweredQn ? this.lastAnsweredQn : 0;
            let lastAnsIndex;
            if (this.lastAnsweredQn > 0)    {
                let qns = this.questionMap.keys();  //iterator Object
                console.log('typeof keys is '+ typeof qns);
                //lastAnsIndex = this.questionMap.keys().findIndex((key) => key == this.lastAnsweredQn);
                
                for(let i=0;i<this.questionMap.size;i++)    {
                    if(qns.next().value === this.lastAnsweredQn)    {
                        lastAnsIndex = i+1;
                        break;
                    }
                }
            }
            else
                lastAnsIndex = 0;
            this.progress = (lastAnsIndex / this.totalNoofQuestions)*100;
            //this.progress = 100;
            console.log('lastansIndex: ' + lastAnsIndex + ' lastAnsweredQn:' + this.lastAnsweredQn);

            let qno;
            if (this.nextQuestionJson != null && this.nextQuestionJson != '' && typeof this.nextQuestionJson != undefined && this.nextQuestionJson) {
                console.log('the last answer is '+ JSON.stringify(this.lastAnswerObj));
                this.isResume = true;
                qno = this.findNextQuestion(this.nextQuestionJson, this.lastAnswerObj);
                this.isResume = false;
            }
            else
                qno = this.questionList[0].question.Order__c;

            console.log(' the question number is ' + qno);

            if(qno !== "End")   {
                
                this.question = this.questionMap.get(qno).question;
                this.nextQuestionJson = this.question.Next_Question__c;
                if(qno !=  1 ){
                    this.flagForBack = true;
                       
                }
            }
            else   {
                const navigateNextEvent = new FlowNavigationNextEvent();
                this.dispatchEvent(navigateNextEvent);
            }
        })
        .catch(error => {
            this.error = error;
            console.log("error "+error);
        });
    }
    refreshApex(navigation){
        getQuestions({surveyId: this.surveyId})
        .then(data => {
            this.questionList = undefined;
            this.questionMap = undefined;
            this.questionList = JSON.parse(data);
            console.log('questionList::'+data);
        if (this.questionList && this.questionList.length > 0) {
            this.totalNoofQuestions = this.questionList.length;
            this.questionMap = new Map();
            for (let i = 0; i < this.questionList.length; i++) {
                if (this.questionMap.has(this.questionList[i].question.Order__c))
                    throw 'multiple questions cannot have same Order Number:' + this.questionList[i].question.Order__c;
                else {
                    this.questionMap.set(this.questionList[i].question.Order__c, this.questionList[i]);
                    this.questionNumList.push(this.questionList[i].question.Order__c);
                }
            }
        }
        console.log('in back the questionsmap is ' + JSON.stringify(this.questionMap.get(this.question.Order__c-1)?.answer));
           // console.log('the questionsmap is ' + JSON.stringify(this.questionMap.get(1)));
            //console.log('next question json is ' + this.nextQuestionJson);

            if(navigation === "back"){
                this.isLoading = false;
                this.question=this.questionMap.get(this.question.Order__c-1).question;
                this.lastAnsweredQn = this.question.Order__c -1;
                let lastAnsIndex = this.questionNumList.findIndex((key) => key == this.lastAnsweredQn);
                 this.progress = ((lastAnsIndex + 1) / this.totalNoofQuestions) * 100;
             //To make the back but invisible for the introduction question
            if(this.question.Order__c == 1){
                this.flagForBack  = false;
            }
            let surveyanswer;
            console.log("in bck this.question.Order__c "+this.question.Order__c);
            surveyanswer = this.questionMap.get(this.question.Order__c)?.answer;
            if(surveyanswer!=null){               
            let answerFlag= false;
            if(surveyanswer?.Text_Response_Value__c!=null){
                answerFlag = true;
                this.surveyanswer = surveyanswer.Text_Response_Value__c;
            }
            else if(surveyanswer?.Number_Response_Value__c!=null){
                answerFlag = true;
                this.surveyanswer = surveyanswer.Number_Response_Value__c;
            }
            else if(surveyanswer?.Date_Response_Value__c!=null){
                answerFlag = true;
                this.surveyanswer = surveyanswer.Date_Response_Value__c;
            }
            if(!answerFlag){
                this.surveyanswer=undefined;
            }
            }
            else if(surveyanswer== null) {
                this.surveyanswer=surveyanswer;
            }
            if(this.question.Display_Type__c === 'Checkbox Group' || this.question.Display_Type__c === 'Report Score'|| this.question.Display_Type__c === 'Multi Checkbox Picklist' || this.question.Display_Type__c === 'Table'){
                this.surveyanswer = surveyanswer;
            }
            if( surveyanswer?.Other_Response_Value__c != undefined){
                this.otherexistinganswer = surveyanswer.Other_Response_Value__c ;
            }
            console.log('this.surveyanswer '+JSON.stringify(this.surveyanswer));

            }

            else if(navigation === "next"){
                console.log('this.modalPopupFlag '+this.modalPopupFlag);
                if(this.modalPopupFlag){
                    this.template.querySelector('c-transplant-survey-question').popupvalidation();
                }
                console.log('inside Next Handler')  ;
                
                const returnVal = this.template.querySelector('c-transplant-survey-question').validations();
                console.log('returnVal --->>>' + returnVal);
                if (returnVal === true ) {
                    if(this.question.Display_Type__c !=="Intro"){
                        if(!this.modalPopupFlag ){
                        this.saveAnswer();
                        }
                    }
                    else{
                        this.navigateNextQuestion();
                    }
                }
                
            }
    }).catch(error=>{
        this.error = error;
        console.log("error "+error);
    })
    }
    /*@wire(getSurveyQuestions,{surveyId: '$surveyId' })
    wiredSurveyQuestions(wiredSurveyData) {
        try {
            this.surveyQuestionData = wiredSurveyData;
            const { error, data } = wiredSurveyData;

            if (data) {
                console.log('wiredSurveyQuestions: received data is ' + JSON.stringify(data));
                //this.questionList = data;
                //this.questionList = data.map((qn) => qn); 
                //let str = JSON.stringify(data)
                this.questionList = JSON.parse(data);
                console.log('questionlist--->>>>' + this.questionList.length);
                //this.question = this.questionList[0];

                if (this.questionList && this.questionList.length > 0) {
                    this.totalNoofQuestions = this.questionList.length;
                    this.questionMap = new Map();
                    for (let i = 0; i < this.questionList.length; i++) {
                        if (this.questionMap.has(this.questionList[i].question.Order__c))
                            throw 'multiple questions cannot have same Order Number:' + this.questionList[i].question.Order__c;
                        else {
                            this.questionMap.set(this.questionList[i].question.Order__c, this.questionList[i]);
                            this.questionNumList.push(this.questionList[i].question.Order__c);
                        }
                    }
                }
                console.log('the questionsmap is ' + JSON.stringify(this.questionMap));
                console.log('the questionsmap is ' + JSON.stringify(this.questionMap.get(1)));
                console.log('next question json is ' + this.nextQuestionJson);

                this.lastAnsweredQn = this.lastAnsweredQn ? this.lastAnsweredQn : 0;
                let lastAnsIndex;
                if (this.lastAnsweredQn > 0)    {
                    let qns = this.questionMap.keys();  //iterator Object
                    console.log('typeof keys is '+ typeof qns);
                    //lastAnsIndex = this.questionMap.keys().findIndex((key) => key == this.lastAnsweredQn);
                    
                    for(let i=0;i<this.questionMap.size;i++)    {
                        if(qns.next().value === this.lastAnsweredQn)    {
                            lastAnsIndex = i+1;
                            break;
                        }
                    }
                }
                else
                    lastAnsIndex = 0;
                this.progress = (lastAnsIndex / this.totalNoofQuestions)*100;
                //this.progress = 100;
                console.log('lastansIndex: ' + lastAnsIndex + ' lastAnsweredQn:' + this.lastAnsweredQn);

                let qno;
                if (this.nextQuestionJson != null && this.nextQuestionJson != '' && typeof this.nextQuestionJson != undefined && this.nextQuestionJson) {
                    console.log('the last answer is '+ JSON.stringify(this.lastAnswerObj));
                    this.isResume = true;
                    qno = this.findNextQuestion(this.nextQuestionJson, this.lastAnswerObj);
                    this.isResume = false;
                }
                else
                    qno = this.questionList[0].question.Order__c;

                console.log(' the question number is ' + qno);

                if(qno !== "End")   {
                    
                    this.question = this.questionMap.get(qno).question;
                    this.nextQuestionJson = this.question.Next_Question__c;
                    if(qno !=  1 ){
                        this.flagForBack = true;
                           
                    }
                }
                else   {
                    const navigateNextEvent = new FlowNavigationNextEvent();
                    this.dispatchEvent(navigateNextEvent);
                }
                
                

                

                //this.questionNum = this.question.Order__c;
                /*let qMap = JSON.parse(str);
                //this.question = this.questionMap.get(1.0);
                this.questionmap = qMap => {
                    const keys = Object.keys(qMap);
                    const map = new Map();
                    for(let i = 0; i < keys.length; i++){
                        //inserting new key value pair inside map
                        map.set(keys[i], qMap[keys[i]]);
                    };
                    return map;
                };
                this.question = this.questionMap.get(1.0);*/
                
                /*this.question ={
                        Question_Text__c : this.questionList[0].Question_Text__c,
                        Options__c: this.questionList[0].Options__c,
                        Option_Other__c : this.questionList[0].Option_Other__c,
                        Display_Type__c : this.questionList[0].Display_Type__c,
                };*/

                //this.question.Question_Text__c = data[0].Question_Text__c;
                //this.question.Options__c = data[0].Options__c;
                //this.question.Option_Other__c = data[0].Option_Other__c;
                //this.question.Display_Type__c = data[0].Display_Type__c;
                //this.question.
            /*}
            else if (error) {
                console.log('error1:' + error);
                this.questionList = undefined;
                this.error = error;
            }
        }
        catch (error) {
            console.log('encountered error in wiredSurveyQuestions');
            this.error = error;
        }

    }*/


    validationForModalPopup(event){
        this.modalPopupFlag = event.detail;
    }

    handleNext(event) {
        this.refreshApex("next");
    }
    findNextQuestion(nextQnStr, answerObj) {
        try {
            let retVal;
            let nextQnJson = JSON.parse(nextQnStr);
            if (!nextQnJson.isSkip)
                retVal = nextQnJson.nextQues;
            else {
                

                let ans;
                if(this.isResume)   {
                    let dispType=answerObj.Question_Display_Type__c;
                    if(dispType === "Number")   
                        ans=answerObj.Number_Response_Value__c;
                    else if(dispType === "Date")
                        ans=answerObj.Date_Response_Value__c;
                    else 
                        ans=answerObj.Text_Response_Value__c;
                }
                else 
                    ans= this.template.querySelector('c-transplant-survey-question').selectedAnswer();
                let nav = nextQnJson.navMap;
                console.log('the ans is:' + ans + ' navMap is :' + nav);
                let x = nav[ans];
                console.log('the value is' + x);
                retVal = nav[ans];
            }
            console.log('the nextquestion computed from findNextQuestion is ' + retVal);
            return retVal;
        }
        catch (error) {
            this.questionList = undefined;
            this.error = error;
            console.log('error occured while calculating Next Question ' + error);
        }

    }
    handleContinue(event) {
        console.log('the target name is ' + event.target.name);
        if(this.saveandExitPage != '' && this.saveandExitPage)    {
            const pageDetails = JSON.parse(this.saveandExitPage);
            this.saveAnswer();
            if(pageDetails.type ==="comm__namedPage")   {
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: pageDetails.nameorurl,
                    },
                });
            }
            else if (pageDetails.type ==="standard__webPage")   {
                /*  //this commented code is opening the webpage in new window instead of same window
                this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: {
                        url: pageDetails.nameorurl,
                    },
                },
                true  //replaces the history
                );*/
                window.open(pageDetails.nameorurl,"_self");
            }
            else    {
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'Home'
                    },
                });
            }
        } 
        else  {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Home'
                },
            });
        }
        
    }
    saveAnswer()    {
       // this.flagForBack = true;
       this.isLoading = true;
        let surveyAnswer = { 'sobjectType': 'Advanced_Survey_Answer__c' };  
        surveyAnswer.Advanced_Survey_Question__c=this.question.Id;
        surveyAnswer.Advanced_Survey_Response__c=this.responseId;
        surveyAnswer.PLM_User__c=this.accountId;
        const questionEle = this.template.querySelector('c-transplant-survey-question');
        const ans=questionEle.selectedAnswer();
        if(this.question.Display_Type__c === "Date")
            surveyAnswer.Date_Response_Value__c=ans;
        else if(this.question.Display_Type__c==="Number")
            surveyAnswer.Number_Response_Value__c =ans;
        else {
            surveyAnswer.Text_Response_Value__c=ans;
            if(ans === "Other" || (this.question?.Display_Type__c === "Checkbox Group" && ans?.includes("Other")) ) {
                const ansOther = questionEle.otherAnswer();
                console.log("other answer"+ansOther);
                surveyAnswer.Other_Response_Value__c=ansOther;
            }
            else if(this.question?.Display_Type__c ==='Table'){
                let jsonArray = JSON.parse(ans);
                let json = jsonArray[jsonArray.length-1];
                if(json.beforetreatment==true || json.aftertreatment==true|| json.currenttreatment==true){
                    const ansOther = questionEle.otherAnswer();
                    console.log("other answer"+ansOther);
                    surveyAnswer.Other_Response_Value__c=ansOther;
                }
            }
        }
        console.log("ans "+ans);
        console.log('answer object before saving is '+surveyAnswer);
        insertSurveyAnswer({answer: surveyAnswer})
        .then(result => {
            let isSuccess = result;
          this.isLoading = false;

            /*this.dispatchEvent(
                new ShowToastEvent({
                    title: 'success',
                    message: 'Survey Answer has been created successfully!',
                    variant: 'success',
                }),
            );*/
            this.navigateNextQuestion();
            
        }).catch(error => {

            this.error = error;
            this.isLoading = false;
            console.log(this.error);
        });
    }
    navigateEndScreen(event){
        console.log("test in survey container")
        this.navigateTolastFlag = event.detail;
        if(event.detail.value && event.detail.type=="date"){
            console.log("inside if");
            this.navigateNextQuestion();
        }
    }
    navigateNextQuestion(event)  {
        
        let qno = this.findNextQuestion(this.question.Next_Question__c);/*{"isSkip":false, "navMap":{}, "nextQues": "End"}*/
        this.template.querySelector('c-transplant-survey-question').refreshOtherValue();
        let qes =this.questionMap.get(qno)?.question;
        if(qes?.Display_Type__c =='Intro'){
            this.flagForBack = false;
        }
        else{
            this.flagForBack = true;
        }
        // if(event === undefined)
        //     this.navigateTolastFlag = true;
        if (qno != "End" && !(this.navigateTolastFlag.value) && 
        (this.navigateTolastFlag.type==""||this.navigateTolastFlag?.type=="date")) {
            this.lastAnsweredQn = this.question?.Order__c;
            let lastAnsIndex = this.questionNumList?.findIndex((key) => key == this.lastAnsweredQn);
            //let keyAr = this.questionMap.keys();
            //console.log('keyAr is '+keyAr);
            //console.log('typeof the keyAr is '+ typeof keyAr);
            console.log('check question no' + qno);
            this.progress = ((lastAnsIndex + 1) / this.totalNoofQuestions) * 100;
            this.question = undefined;
            this.question = this.questionMap?.get(qno)?.question;
            //this.questionNum = this.question.Order__c;
            console.log('the question in handleNext is ' + this.question?.Order__c);
            this.nextExistingSurveyAnswer(this.questionMap.get(qno)?.answer);
            let qnTmplt = this.template.querySelector('c-transplant-survey-question');
            qnTmplt.refreshNextQuestion();
            //qnTmplt.resetSelectedAnswer();
        }
        else {
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }
    }
    previousQuestion(event){
        this.template.querySelector('c-transplant-survey-question').refreshOtherValue();
        this.isLoading = true;
        this.refreshApex("back");
    }
    /* used to show existing response in next handler*/
    nextExistingSurveyAnswer(existingAnswer){
            console.log('test existing' + existingAnswer);
               if(existingAnswer!=null) {
                        let surveyanswer;
                        surveyanswer = existingAnswer;
                    if(surveyanswer?.Text_Response_Value__c!=null){
                        this.surveyanswer = surveyanswer.Text_Response_Value__c;
                    }
                    else if(surveyanswer?.Number_Response_Value__c!=null){
                        this.surveyanswer = surveyanswer.Number_Response_Value__c;
                    }
                    else if(surveyanswer?.Date_Response_Value__c!=null){
                        this.surveyanswer = surveyanswer.Date_Response_Value__c;
                    }
                    if(this.question.Display_Type__c === 'Checkbox Group' || this.question.Display_Type__c === 'Report Score'|| this.question.Display_Type__c === 'Multi Checkbox Picklist' || this.question.Display_Type__c === 'Table'){
                        this.surveyanswer = surveyanswer;
                    }
                    if(surveyanswer?.Other_Response_Value__c != null && surveyanswer?.Other_Response_Value__c != undefined){
                        this.otherexistinganswer = surveyanswer.Other_Response_Value__c ;
                    }

                    console.log('this.surveyanswer '+JSON.stringify(this.surveyanswer));
                    console.log("me testing "+this.otherexistinganswer);
               }
                else if(existingAnswer== null) {
                    this.surveyanswer=existingAnswer;
                }
    }
}