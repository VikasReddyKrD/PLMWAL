import { LightningElement, api, wire, track } from 'lwc';
import getSurveyQuestions from '@salesforce/apex/SurveyController.getSurveyQuestions';

export default class SurveyQuestion extends LightningElement {
    @api question;
    //@api questionNum;
    //@api questionInitialized = false;
    //questionText;
    //isText = false;
    //isTextArea = false;
    //isCombo = false;
    //isRadio = false;
    //isCheckgroup = false;
    //isIntro = false;
    //isDate = false;
    @api order;
    qlesCheckBox1;
    qlesCheckBox2;
    qlesCheckBox3;
    qlesCheckBox4;
    medicationFlag= false;
    @api surveyanswer;
    value;
    answer;
    phq9selectedjson = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    phq9selectedCheckboxes = [false, false, false, false];
    noofoptions;
    totalVal = 0;
    proTotal = 0;
    phq9total = 0;
    isother;
    otherLabel;
    otherOption;
    selectedValue;
    otherValue;
    isCheckboxValidnFailed = false;
    @api
    isModalOpen = false;
    modalContent;
    isModalContent = false;
    selected = {}
    finalValue;
    errorScoreFlag = false;
    score = 0;
    scoreDiv1;
    scoreDiv2;
    phqStyle;
    displayExitbtn = true;
    selectedWHOList = [];
    phq9 = [];
    phqTotalScore;
    phq9totalValue;
    isCancelButton = true;
    isOkButton = true;
    phq9Flag = true;
    answerList;
    tableArray = new Map();
    selValues = [];
    count;
    dosage;
    frequency;
    isNestedOptions = false;
    nestedOptions = [];
    isFirstTime = true;
    checkOtherValue;
    isProIntialscreen = true;
    pdq5IntialScreen = false;
    pdq5Index = 0;
    pdq5LastScreen = false;
    pdq5validation = false;
    isSubQuestion = false;
    qlesSubOptions = [];//= [{"label":"test","value":"test","isChecked":false}];
    options = [
        { label: 'Ross', value: 'option1' },
        { label: 'Rachel', value: 'option2' },
    ];
    pdq5AnswerList = [];
    pdq5Map = {
        'Never in the past 7 days': 0,
        'Rarely (once or twice)': 1,
        'Sometimes (3 to 5 times)': 2,
        'Often (about once a day)': 3,
        'Very often (more than once a day)': 4
    }
    @track pd5TempOptions = { "head": '', "body": '', "rating": [] };

    whoMap = { 'At no time': 0, 'Some of the time': 1, 'Less than half of the time': 2, 'More than half of the time': 3, 'Most of the time': 4, 'All the time': 5 };
    whoAnswersList = [0, 0, 0, 0, 0, 0];
    @api
    refreshNextQuestion() {
        this.selectedValue = '';
        this.isother = false;
        this.otherValue = '';
        this.isCheckboxValidnFailed = false;
    }
    multiplePROInstructions = false;
    instructionsList = [];
    @api
    selectedAnswer() {
        console.log('this.selectedValue', this.selectedValue);
        let response = { "answer": this.selectedValue, "questionid": this.question.id }
        return JSON.stringify(this.selectedValue);

    }
    @api
    otherAnswer() {
        return this.otherValue;
    }

    get questionText() {
        // this.selectedValue='';
        return this.question.Question_Text__c;
    }


    get proInstructions() {
        return this.question.PRO_Intructions__c;
        console.log("inside the proInstructions")
        /* if(q.includes('</br>')){
            this.multiplePROInstructions = true;
             this.instructionsList =q.split('<br/>');
             console.log("inside the loop")
             return q.split('<br/>');
        }
        else{
            return q;
        } */
    }
    get questionsOrder() {
        return this.order + 1;
    }

    get optionValues() {
        //console.log('option values' + this.question.Options__c);
        let options = (this.question.Options__c) ? JSON.parse(this.question.Options__c) : undefined;
        this.otherOption = (this.question.Option_Other__c) ? JSON.parse(this.question.Option_Other__c) : undefined;
        this.noofoptions = (this.question.Option_Other__c) ? JSON.parse(this.question.Option_Other__c).noofoptions : undefined;

        if (this.question.Question_Text__c == 'Perceived Deficits Questionnaire - Depression (PDQ-D5)') {
            this.pd5TempOptions.rating = options.rating;
        }
        console.log("tesing==>",options.suboptions); 
        if (options.suboptions != undefined) {
            this.qlesCheckBox1=options.suboptions.option1;
            this.qlesCheckBox2=options.suboptions.option2;
            this.qlesCheckBox3=options.suboptions.option3;
            this.qlesCheckBox4=options.suboptions.option4;
        }
        return options;
    }

    get modalData() {
        if (this.question.modelContent__c != undefined) {
            return JSON.parse(this.question.modelContent__c);
        }
        else
            return undefined;
    }

    get isRadio() {
        return (this.question.Display_Type__c === 'Radio Button') ? true : false;
    }
    get isDate() {
        return (this.question.Display_Type__c === 'Date') ? true : false;
    }
    get isRadioNumberInput() {
        return (this.question.Display_Type__c === 'Radio - Number Input') ? true : false;
    }
    get isCombo() {
        return (this.question.Display_Type__c === 'Combo Box') ? true : false;
    }
    get isCheckgroup() {
        //console.log('ischeckbox group' + (this.question.Display_Type__c === 'Checkbox Group') ? true : false);
        return (this.question.Display_Type__c === 'Checkbox Group') ? true : false;
    }
    get isText() {
        return (this.question.Display_Type__c === 'Text') ? true : false;
    }
    get isTextArea() {
        return (this.question.Display_Type__c === 'Text Area') ? true : false;
    }
    get isIntro() {
        return (this.question.Display_Type__c === 'Intro') ? true : false;
    }
    get isNumber() {
        return (this.question.Display_Type__c === 'Number') ? true : false;
    }
    get introText() {

        return (this.question.Options__c);
    }
    get isTable() {
        return (this.question.Display_Type__c === 'Table') ? true : false;
    }
    get isReportScore() {
        return (this.question.Display_Type__c === 'Report Score') ? true : false;

    }
    get isCheckpicklistgroup() {
        return (this.question.Display_Type__c === 'Multi Checkbox Picklist') ? true : false;
    }
    get isTableWithSection() {
        return (this.question.Display_Type__c === 'Table with section') ? true : false;

    }
    get isCheckboxText() {
        return (this.question.Display_Type__c === 'Checkbox Text') ? true : false;

    }
    get qLesQsf() {
        return (this.question.Display_Type__c === 'Custom Pro - qLesQsf') ? true : false;
    }

    get customPro() {

        return (this.question.Display_Type__c === 'Custom pro') ? true : false;

    }

    get customProPDQ() {

        return (this.question.Display_Type__c === 'Custom Pro - PDQ') ? true : false;

    }

    get isCancel() {
        let c = JSON.parse(this.question.Next_Question__c).iscancel;
        if (c == undefined)
            return true;
        else
            return false;

    }

    @api
    popupvalidation(event) {
        this.isModalOpen = true;

        if (this.phqTotalScore != undefined) {
            if (this.phqTotalScore < 5) {

                this.isModalOpen = true;
                this.isModalContent = true;
                this.modalContent = 'Thank you for your interest in the Real-World Comparison Study of Antidepressant Treatments in Patients with Major Depressive Disorder Study. Unfortunately, your responses indicate that you are ineligible to continue in this study.To ensure that we only invite you to the studies that are the right fit for you, we ask that you please update your PatientsLikeMe profile.This will help us identify research opportunities that fit your experiences. We hope to continue to see you in our community. Thank you for your time!.'
                return false;
            }
        }
        return this.phqTotalScore;
    }

    @api clearPreviousAnswer() {
        //this.selectedValue = undefined;
        /* this.template.querySelectorAll("[data-qnorder]").forEach(each=>{
            each.value=undefined;
        }) */
    }

    @api popupScroll() {
        return this.template.querySelectorAll('modal-content-id-1');
    }

    /* modal popup methods start*/
    openModal() {
        // to open modal set isModalOpen tarck value as true

        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen track value as false
        this.isModalOpen = false;
    }
    keyPressHandlers(event){
        if([75, 77, 84, 66, 69, 44, 45, 46, 107, 109, 98, 116, 101, 43].includes(event.keyCode)){
           event.preventDefault();
        }
       
        
   }
    handleClick(event) {     //new changes for istable

        this.template.querySelectorAll("[data-coltable]").forEach(each => {
            if (each.dataset.rowtable == event.target.dataset.rowtable) {
                if (each.dataset.coltable == event.target.dataset.coltable) {
                    each.checked = true;
                } else {
                    each.checked = false;
                }
            }
        })
        //used to uncheck all the checkboxes when none of the above is checked==>start
        this.tableArray.set(event.target.dataset.checked, event.target.dataset.title);
        console.log("tableArray", this.tableArray);
        let obj = Object.fromEntries(this.tableArray);

        this.selectedValue = JSON.stringify(obj);
        console.log('this.selectedValue',this.selectedValue);
    }

    customproqLesQsf(event) {
        console.log("event=====>",)
        if(!(event.target.dataset.optionval == "...medication?" && this.medicationFlag)){
        this.template.querySelectorAll('[data-customproqlesqsfcol]').forEach(each => {
            if (each.dataset.customproqlesqsfrow == event.target.dataset.customproqlesqsfrow) {
                if (each.dataset.customproqlesqsfcol == event.target.dataset.customproqlesqsfcol) {
                    each.className = "phqScore";
                }
                else {
                    each.className = "phqdefaultScore";
                }
            }
        })
        console.log("test");
        
        this.template.querySelectorAll('[data-qlesqsf]').forEach(each => {
            if (each.dataset.qlesqsf == event.target.dataset.optionval 
                && event.target.dataset.optind == each.dataset.mainoptionindex){
                if( ['Very Poor','Poor','Fair'].includes(event.target.dataset.currval)) {
                each.style.display = "block";
            }
            else{
                each.style.display = "none";
            }
        }
        })
        }
    }

    medicationHandler(event){
        this.medicationFlag = event.target.checked;
        this.template.querySelectorAll('[data-optionval="...medication?"]').forEach(each=>{
             each.className = 'phqdefaultScore';
             console.log("testing inseid")
        })
    }


    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
        this.isModalContent = true;
        /* this.dispatchEvent(new CustomEvent('tolastpage', {
            detail: this.isModalContent
        })); */
        window.location.href = "https://www.patientslikeme.com/users/sign_in";

    }
    handleNumber(event) {
        if(event.target.value != null){
        if (event.target.type === "number") {
            if (event.target.value < 18 && event.target.value > 0) {
                this.modalContent = JSON.parse(this.question.Next_Question__c).modalcontent;
                this.isModalOpen = true;
                this.isModalContent = true;
                return;
            }
            else {
                this.selectedValue = event.target.value;
            }

        }
    }
    }
    /*modal popup methods ends*/
    handleChange(event) {
        //if(this.optionValues[0].hidetext != undefined && this.optionValues[1].hidetext != undefined){
        /* this.optionValues[0]?.hidetext=true;
        this.optionValues[1]?.hidetext=true; */
        //}
        console.log("is survey", event.target.value);
        // console.log("event.target.name", event.detail.value);

        console.log('inside the handleChange Event for ' + event.target.name + 'target type:' + event.target.type);

        if (event.target.type === "Date" || event.target.type === "radio") {
            if (!(event.target.value === 'Other' || event.target.value === 'Side effects [specify]')) {
                this.isother = false;
            }
            this.selectedValue = event.target.value;
            if (event.target.type === "radio" && this.question.Display_Type__c == 'Radio - Number Input') {
                this.selValues.push('selectedvalue' + this.selectedValue);
                this.selectedValue = JSON.stringify(this.selValues);
            }
            let currentDate = new Date();
            let enteredDate = new Date(event.detail.value);
            //let enteredDate = event.detail.value;
            //let convertedNumber=Number(enteredDate);
            // console.log('convertedNumber'+convertedNumber)
            this.modalContent = JSON.parse(this.question.Next_Question__c).modalcontent;
            /*  if (currentDate.getFullYear() - enteredDate.getFullYear() < 18) {
                 // if ( convertedNumber < 18) {
                 this.isModalOpen = true;
                 this.isModalContent = true;
                 return;
             } */
            if (this.modalData != undefined) {

                if (event.target.value === this.modalData.answer) {
                    this.isModalOpen = true;
                    this.isModalContent = true;
                    this.modalContent = JSON.parse(this.question.modelContent__c).modalcontent;
                    this.isOkButton = true;
                    this.isCancelButton = true;
                    return;

                }


                if (event.target.value === this.modalData.answer1) {
                    //yes content
                    //If we need popup for yes option we need to write modalcontent2 in nextquestion field
                    if (JSON.parse(this.question.modelContent__c).modalcontent1 != undefined) {
                        this.modalContent = (JSON.parse(this.question.modelContent__c).modalcontent1) ? JSON.parse(this.question.modelContent__c).modalcontent1 : JSON.parse(this.question.modelContent__c).modalcontent1;
                        // this.modalContent=this.modalData.modalcontent1; 
                        this.isModalOpen = true;
                        this.isModalContent = true;
                        this.isCancelButton = false;
                        this.isOkButton = false;
                        return;
                    }
                }
                if (event.target.value === this.modalData.answer) {
                    //If we need popup for No option we need to write modalcontent1 in nextquestion field
                    // if (JSON.parse(this.question.modelContent__c).modalcontent != undefined) {
                    this.modalContent = JSON.parse(this.question.modelContent__c).modalcontent;
                    //console.log('this.modalData.modalcontent'+this.modalData.modalcontent);
                    // this.modalContent=this.modalData.modalcontent;
                    this.isModalOpen = true;
                    this.isModalContent = true;
                    this.isOkButton = true;
                    this.isCancelButton = true;
                    return;
                    //  }
                }
            }
        }
        else {
            this.selectedValue = event.target.value;
            this.isModalContent = false;
            this.dispatchEvent(new CustomEvent('tolastpage', {
                detail: this.isModalContent
            }));
        }
        this.selectedValue = this.values + '-' + this.score;
        let scoreString = (this.score + '').length == 1 ? ("0" + this.score) : (this.score + "");
        let scoreArray = scoreString.split("");
        if (scoreArray[0] !== undefined)
            this.scoreDiv1 = scoreArray[0];
        else
            this.scoreDiv1 = "0";
        if (scoreArray[1] !== undefined)
            this.scoreDiv2 = scoreArray[1];
        else
            this.scoreDiv2 = "0";
        let answerOther = '';
        if (event.target.type === "checkbox") {
            if (event.target.checked && event.target.name === "None") {
                this.template.querySelectorAll('lightning-input').forEach(each => {
                    console.log('Not NONE --the value is ' + each.name + ' ischecked:' + each.checked + ' type is:' + each.type);
                    if (each.checked && each.name !== "None")
                        each.checked = false;
                });
                this.selectedValue = event.target.name;
            }
            else {
                let values = [];

                this.template.querySelectorAll('lightning-input').forEach(each => {
                    console.log('the value is ' + each.name + ' ischecked:' + each.checked + ' type is:' + each.type);
                    if (each.checked) {
                        values.push(each.name);
                    }

                    if (each.checked && each.name === "Other")
                        answerOther = "Other";
                    let selectedLength = 0;

                    this.template.querySelectorAll("[data-name='checkboxInput']").forEach(each => {
                        if (each.checked) {
                            selectedLength++;
                        }
                    })
                    if (selectedLength > this.noofoptions) {
                        // event.preventDefault();
                        event.target.checked = false;
                    }
                });
                this.selectedValue = values.join(',');
                if (!(this.selectedValue.includes('Other') || this.selectedValue.includes('Side effects [specify]'))) {
                    this.isother = false;
                }
                let eleNone = this.template.querySelector('lightning-input[data-id="None"]');
                if (eleNone)
                    eleNone.checked = false;
            }
        }
        else {
            this.selectedValue = event.detail.value;
            answerOther = event.detail.value;
        }
        try {


            if (JSON.parse(this.question.Option_Other__c).disableoption != undefined) {
                // if(event.target.name == JSON.parse(this.question.Option_Other__c).disableoption){
                let checking = event.target.checked;
                let selectedOption = event.target.name;

                this.template.querySelectorAll('[data-name="checkboxInput"]').forEach(each => {
                    if (event.target.name == JSON.parse(this.question.Option_Other__c).disableoption) {
                        if (checking == true && selectedOption != each.name) {
                            each.checked = false;
                        }
                    } else {
                        if (each.name == JSON.parse(this.question.Option_Other__c).disableoption) {
                            each.checked = false;
                        }
                    }

                })
            }
            // }

        } catch (e) {
            console.log(e);
        }
        let ans = event.detail.value;
        console.log('the selected value is :' + this.selectedValue);


        if ((this.otherOption.isApplicable) && (this.otherOption.forValue == answerOther) && (answerOther === 'Other') || (answerOther === 'Side effects [specify]')) {
            this.isother = true;
            this.otherLabel = this.otherOption.forlabel;
        }
        else {
            this.isother = false;
        }
        console.log('isotherValue ----->>>' + this.isother);

    }

    cdfSave(event) {
        if (event.target.dataset.freq == 'count') {
            if (!JSON.stringify(this.selValues).includes('count')) {
                this.selValues.push(event.target.dataset.freq + '' + event.target.value);
                this.selectedValue = JSON.stringify(this.selValues);
            } else {
                this.selValues[1] = event.target.dataset.freq + '' + event.target.value;
            }
        }

        else if (event.target.dataset.freq == 'dosage') {
            if (!JSON.stringify(this.selValues).includes('dosage')) {
                this.selValues.push(event.target.dataset.freq + '' + event.target.value);
                this.selectedValue = JSON.stringify(this.selValues);
            } else {
                this.selValues[2] = event.target.dataset.freq + '' + event.target.value;
            }
        }

        else if (event.target.dataset.freq == 'frequency') {
            if (!JSON.stringify(this.selValues).includes('frequency')) {
                this.selValues.push(event.target.dataset.freq + '' + event.target.value);
                this.selectedValue = JSON.stringify(this.selValues);
            } else {
                this.selValues[3] = event.target.dataset.freq + '' + event.target.value;
            }
        }
    }

    proCalculation(event) {

        this.template.querySelectorAll("[data-tablerow]").forEach(each => {

            if (each.dataset.tablerow == event.target.dataset.tablerow) {
                console.log("inside row", each.dataset.tablerow)
                if (each.dataset.tablecol != event.target.dataset.tablecol && each.className == 'selectedScore slds-border_left slds-border_right') {

                    this.proTotal = this.proTotal - Number(each.innerHTML);
                    this.template.querySelectorAll("[data-tabletr]").forEach(rows => {
                        if (rows.dataset.tablerow == event.target.dataset.tabletr) {
                            rows.dataset.flagtable = "true";
                        }
                    })
                }
                if (each.dataset.tablecol != event.target.dataset.tablecol) {
                    each.className = "slds-border_left slds-border_right";
                }
            }
        })

        let selectedJson = this.optionValues;
        this.template.querySelectorAll("[data-tablerow]").forEach(each => {
            if (each.dataset.tablerow == event.target.dataset.tablerow) {
                if (each.dataset.tablecol == event.target.dataset.tablecol) {
                    each.className = 'selectedScore slds-border_left slds-border_right';
                    this.selectedWHOList.push({ "index": each.dataset.tablecol, "value": each.dataset.value });
                    //var quationofexclude=event.target.dataset.label;
                    this.proTotal = this.proTotal + Number(each.innerHTML);
                    console.log("score", this.proTotal);
                }
                else {
                    each.className = "slds-border_left slds-border_right";
                }
            }
        })

        selectedJson.finalScore = this.selectedWHOList;
        selectedJson.calculation = this.proTotal.toString()
        console.log("selectedJson", selectedJson);
        this.selectedValue = JSON.stringify(selectedJson);

    }

    phq9Calculation(event) {

        console.log("testing in phq9Calculation");
        let existingAnswer = this.answerList


        if (existingAnswer != undefined) {
            this.phq9selectedjson = (typeof existingAnswer == "string") ? existingAnswer.split(',') : existingAnswer;//[1,1,1,1,1,1,1,1]           


        }

        this.template.querySelectorAll("[data-tableprorow]").forEach(each => {

            if (each.dataset.tableprorow == event.target.dataset.tableprorow) {
                if (each.dataset.tableprocol != event.target.dataset.tableprocol && each.className == 'phqScore slds-border_left slds-border_right') {
                    this.phq9selectedjson[event.target.dataset.tableprorow] = event.target.dataset.tablevalue; //[1,2,1,1,1,1,1,1]              
                    this.phq9total = this.phq9total - Number(each.innerHTML);

                }
                each.className = (each.dataset.tableprocol != event.target.dataset.tableprocol) ? "slds-border_left slds-border_right" : undefined;
            }
        })
        this.template.querySelectorAll("[data-tablepro]").forEach(row => {
            if (row.dataset.tablepro == event.target.dataset.tableprorow) {
                row.dataset.flagprotable = "true";
            }
        })
        this.template.querySelectorAll("[data-tableprorow]").forEach(each => {

            if (each.dataset.tableprorow == event.target.dataset.tableprorow) {
                if (each.dataset.tableprocol == event.target.dataset.tableprocol) {
                    each.className = 'phqScore slds-border_left slds-border_right';
                    this.phq9selectedjson[event.target.dataset.tableprorow] = event.target.dataset.tablevalue;
                    this.phq9total = this.phq9total + Number(each.innerHTML);
                    console.log("score", this.phq9total);
                }
                else {
                    each.className = "phqdefaultScore slds-border_left slds-border_right";

                }
            }
        })

        this.answerList = this.phq9selectedjson;
        // this.phq9selectedjson = this.phq9selectedjson;
        this.selectedValue = this.phq9selectedjson.toString();
        console.log('this.selectedValue', this.selectedValue.toString());
        let selectedJson = this.optionValues;
        let splitValue = this.selectedValue.split('-');

        let totalvalue = 0;
        splitValue = splitValue[0].split(',');
        for (let i = 0; i < splitValue.length; i++) {
            totalvalue = totalvalue + Number(splitValue[i]);
        }
        selectedJson['finalscore'] = totalvalue;
        this.phq9totalValue = totalvalue;
        this.phqTotalScore = totalvalue;


    }

    pdq5MultiScreen() {
        this.pdq5IntialScreen = true;
        this.pd5TempOptions.head = this.optionValues.head[this.pdq5Index].value;
        this.pd5TempOptions.body = this.optionValues.body[this.pdq5Index].value;

        /* const custEvent = new CustomEvent(
            'pdq5parent', {
            detail: true
        });
        this.dispatchEvent(custEvent); */

    }

    pdq5NextHandler() {

        var selectedVal = false
        this.template.querySelectorAll('[data-name="customScoreInput"]').forEach(each => {
            if (each.className.includes('phqScore')) {
                selectedVal = true;
            }
        })
        if (!selectedVal) {
            this.pdq5validation = true;
            return false;
        }
        
        this.template.querySelectorAll('[data-name="customScoreInput"]').forEach(each => {
            if (each.className.includes('phqScore')) {
                this.pdq5AnswerList.push({ 'label': each.dataset.ans, 'value': this.pdq5Map[each.dataset.ans], 'position': Number(each.dataset.custompdqval) })
            }
        })
        this.pdq5AnswerList.answer = 0;
        this.pdq5AnswerList.forEach(each => {
            this.pdq5AnswerList.answer = this.pdq5AnswerList.answer + each.value;
        })
        console.log(this.pdq5AnswerList);
        if (this.pdq5Index <= this.optionValues.body.length - 1) {
            console.log('pdq5next');
            this.pdq5Index++;
            console.log('pdq5nexttest', this.pdq5Index);
            this.pd5TempOptions.head = this.optionValues.head[this.pdq5Index].value;
            this.pd5TempOptions.body = this.optionValues.body[this.pdq5Index].value;
            this.pd5TempOptions.rating = this.optionValues.rating;
            this.template.querySelectorAll("[data-custompdqval]").forEach(each => {
                each.className = 'phqdefaultScore slds-col slds-p-right_medium';
            })
        } else {
            this.pdq5LastScreen = true;
        }
        if (this.pdq5LastScreen) {
            const custEvent = new CustomEvent(
                'pdq5parent', {
                detail: true
            });
            this.dispatchEvent(custEvent);
        }
        this.selectedValue = JSON.stringify(this.pdq5AnswerList);
    }
    pdq5BackHandler() {
        console.log('pdq5back');
        if (this.pdq5Index == 0) {
            this.pdq5IntialScreen = false;
        }
        this.pdq5Index--;
        this.pd5TempOptions.head = this.optionValues.head[this.pdq5Index].value;
        this.pd5TempOptions.body = this.optionValues.body[this.pdq5Index].value;

        this.template.querySelectorAll("[data-custompdqval]").forEach(each => {
            each.className = 'phqdefaultScore slds-col slds-p-right_medium';
        })


    }

    pdq5Calculation(event) {
        if (this.pdq5validation) {
            this.pdq5validation = false;
        }
        this.template.querySelectorAll('[data-custompdqcol]').forEach(each => {

            if (each.dataset.custompdqcol == event.target.dataset.custompdqcol) {
                each.className = "phqScore";
                // this.whoAnswersList[Number(each.dataset.custompdqrow)]= Number(event.target.dataset.custompdqval);
            }
            else {
                each.className = "phqdefaultScore";
            }
        })

    }

    @api
    phq9validationPopup() {
        if (this.phqTotalScore < 5) {
            this.isModalOpen = true;
            this.isModalContent = true;
            this.modalContent = `Thank you for your interest in the Real-World Comparison Study of Antidepressant Treatments in Patients with Major Depressive Disorder Study. Unfortunately, your responses indicate that you are ineligible to continue in this study.To ensure that we only invite you to the studies that are the right fit for you, we ask that you please update your PatientsLikeMe profile.This will help us identify research opportunities that fit your experiences. We hope to continue to see you in our community. Thank you for your time!.`;
        }
    }

    @api
    phq9validation() {

        return this.phqTotalScore;
    }

    downloadPros(event) {
        try {
            const chartObjs = this.template.querySelectorAll('c-survey-question');
            this.template.querySelectorAll('c-mdd-report-chart-j-s-chart-l-w-c').forEach(each => { each.className = 'slds-no-print' })


            window.print();
        }
        catch (error) {
            console.error('Error occured while downloading the chart: ' + error.message);
        }
    }

    onclickHandlerNew(event) {
        this.multiselectValues = this.multiselectValues + "," + event.target.value;
        console.log("this.multiselectValues " + this.multiselectValues);
        this.selectedValue = this.multiselectValues.replace('undefined,', '');
    }
    @api
    validations(qno) {
        console.log('validations--->');
        let returnVal = true;
        if (this.question.Display_Type__c === 'Radio Button') {

            let radioEle = this.template.querySelector("[data-name='radioInput']");
            returnVal = radioEle.reportValidity();
            console.log("validation on radio button", returnVal);
            let validationstr11 = [];
            this.template.querySelectorAll("[data-name='checkboxInput']").forEach(each => {

                if (each.value) {
                    validationstr11.push(each.name);
                }
            });

        } else if (this.question.Display_Type__c === 'Date') {
            let dateEle = this.template.querySelector("[data-name='dateInput']");
            returnVal = dateEle.reportValidity();

        } else if (this.question.Display_Type__c === 'Combo Box') {
            let comboEle = this.template.querySelector("[data-name='comboInput']");
            returnVal = comboEle.reportValidity();

        } else if (this.question.Display_Type__c === 'Text Area') {
            let textAreaEle = this.template.querySelector("[data-name='textareaInput']");
            returnVal = textAreaEle.reportValidity();

        } else if (this.question.Display_Type__c === 'Number') {
            let numberEle = this.template.querySelector("[data-name='numberInput']");
            returnVal = numberEle.reportValidity();

        } else if (this.question.Display_Type__c === 'Text') {
            let textEle = this.template.querySelector("[data-name='textInput']");
            returnVal = textEle.reportValidity();

        }
        if (this.question.Display_Type__c === 'Report Score') {
            let flag = true;
            this.template.querySelectorAll(`[data-flagscore]`).forEach(each => {
                console.log("scoretr====>" + each.dataset.scoretr);
                console.log("value====>" + each.dataset.flagscore);
                if (each.dataset.flagscore == "false") {
                    flag = false;
                    //each.className = "errordiv";
                    this.errorScoreFlag = true;
                }
                else {
                    this.errorScoreFlag = false;
                }
            });
            return flag;
        }

        else if (this.question.Display_Type__c === 'Table with section') {
            let flag = true;
            console.log('testflag' + flag);
            this.template.querySelectorAll(`[data-flagprotable]`).forEach(each => {
                if (each.dataset.flagprotable == "false") {
                    flag = false;
                    this.errorScoreFlag = true;
                }
                else {
                    this.errorScoreFlag = false;
                }
            });
            return flag;
        }

        else if (this.question.Display_Type__c === 'Radio - Number Input') {
            let textEle = this.template.querySelector("[data-name='textInput']");
            let returnVal1 = textEle.reportValidity();

            let textEle1 = this.template.querySelector("[data-name='checkboxInput']");
            let returnVal2 = textEle1.reportValidity();
          

            return returnVal1 && returnVal2

        }
        else if (this.question.Display_Type__c === 'Checkbox Group' || this.question.Display_Type__c === 'Radio - Number Input') {
            let validationstr11 = [];
            this.template.querySelectorAll("[data-name='checkboxInput']").forEach(each => {

                if (each.checked) {
                    validationstr11.push(each.name);
                }
            });

            let validityStr = '';
            let str1 = validationstr11.join(',');
            console.log('selectedvalue is' + this.selectedValue);
            //  if (this.selectedValue==undefined || this.selectedValue==null || this.selectedValue == '') {
            if (str1 == undefined || str1 == null || str1 == '') {

                //let isCheckboxSelected = false;
                validityStr = ' ';  //space will highlight the checkboxes without any message
                this.isCheckboxValidnFailed = true;
                //if(isCheckboxSelected)
                //returnVal =textAreaEle.reportValidity();
                returnVal = false;
            }
            else {
                validityStr = ''; //emptyString will remove the customvalidity if any set earlier
                this.isCheckboxValidnFailed = false;
                returnVal = true;
            }
            let checkboxes = this.template.querySelectorAll("[data-name='checkboxInput']").forEach(each => {
                //console.log('Validation--the value is '+each.name+' ischecked:'+each.checked+' type is:'+each.type);
                each.setCustomValidity(validityStr);
                each.reportValidity();
            });
        }



        if (this.isother == true) {
            let otherEle = this.template.querySelector("[data-name='otherInput']");
            returnVal = otherEle.reportValidity();

        }
        return returnVal;


        /*  if (this.question.Display_Type__c == 'Date') {
  
             // this.selectedValue = event.currentTarget.value;
              let dateEle = this.template.querySelector("[data-name='dateInput']");
              let datevalue = dateEle.value;
              console.log('datevalue--->>>' + datevalue);
              if (!datevalue) {
                  dateEle.setCustomValidity("Date is required!");
                  returnVal= false;
              } else {
                  dateEle.setCustomValidity("");
                  returnVal= true;
              }
  
              dateEle.reportValidity();
          } else if (this.question.Display_Type__c == 'Text Area') {
             // this.selectedValue = event.currentTarget.value;
              let textareaEle = this.template.querySelector("[data-name='textareaInput']");
              let textareavalue = textareaEle.value;
              console.log('textareavalue--->>>' + textareavalue);
              if (!textareavalue) {
                  textareaEle.setCustomValidity("Description is required!");
              } else {
                  textareaEle.setCustomValidity("");
              }
  
              textareaEle.reportValidity();
  
          } else if (this.question.Display_Type__c == 'Combo Box') {
             // this.selectedValue = event.currentTarget.value;
              console.log('selectedValue--->>' + JSON.stringify(this.selectedValue));
              let comboEle = this.template.querySelector("[data-name='comboInput']");
              let combovalue = comboEle.value;
              console.log('combovalue--->>>' + combovalue);
              if (combovalue == 'None') {
                  comboEle.setCustomValidity("Select Any One!");
              } else {
                  comboEle.setCustomValidity("");
              }
  
              comboEle.reportValidity();
          } /*else if (this.isother == true) {
              //this.otherValue = event.currentTarget.value;
              let otherEle = this.template.querySelector("[data-name='otherInput']");
              let othertextvalue = otherEle.value;
              console.log('othertextvalue1--->>>' + othertextvalue);
              if (!othertextvalue) {
                  otherEle.setCustomValidity("other is required!");
                  returnVal= false;
              } else {
                  otherEle.setCustomValidity("");
                  returnVal= true;
              }
  
              otherEle.reportValidity();
          }*/
    }
    handleotherchange(event) {
        this.otherValue = event.detail.value;
        console.log('otherValue ---->>' + this.otherValue);
        // this.otherValue = event.target.value;
    }

    @api
    saveOtherValues() {

        return this.otherValue;
    }

    renderedCallback() {
        this.template.querySelectorAll("[data-name='checkboxInput']").forEach(each => {
            each.checked = false;
        })
    }

    @api
    refreshOtherValue() {
        this.isother = false;
        this.otherValue = '';
        this.otherexistinganswer = '';
        this.backCheckForScore = false;
        this.score = 0;
        this.surveyanswer = undefined;
        this.otherOption = '';
        this.selectedValue = undefined;
        console.log("this.surveyanswer " + this.surveyanswer);
    }


    //PHQ9 handler starts
    scoreHandler(event) {
        if (event.target.dataset.name === "tableScoreInput") {

            this.template.querySelectorAll("[data-scorerow]").forEach(each => {

                if (each.dataset.scorerow == event.target.dataset.scorerow) {
                    console.log("inside row", each.dataset.scorerow)

                    if (each.dataset.scorecol != event.target.dataset.scorecol && each.className == 'selectedScore slds-border_left slds-border_right') {
                        var quationofexclude = event.target.dataset.label;
                        if (quationofexclude != 'medication?(if not talking any, check here________ and leave item blank.)' &&
                            quationofexclude != 'How would you rate your overall life satisfaction andcontentment during the past week?') {
                            this.totalVal = this.totalVal - Number(each.innerHTML);
                        }
                        //this.totalVal = this.totalVal -  Number(each.innerHTML);
                    }
                    if (each.dataset.scorecol != event.target.dataset.scorecol) {
                        each.className = "slds-border_left slds-border_right";

                    }


                }
            })

            this.template.querySelectorAll("[data-scorerow]").forEach(each => {

                if (each.dataset.scorerow == event.target.dataset.scorerow) {
                    console.log("inside row", each.dataset.scorerow)
                    if (each.dataset.scorecol == event.target.dataset.scorecol) {
                        this.template.querySelectorAll("[data-scoretr]").forEach(rows => {
                            if (rows.dataset.scoretr == event.target.dataset.scorerow) {
                                rows.dataset.flagscore = "true";
                            }
                        })
                        console.log("inside if col", each.dataset.scorecol, "event.target.dataset.scorecol", event.target.dataset.scorecol);
                        each.className = 'selectedScore slds-border_left slds-border_right';
                        this.phq9[event.target.dataset.scorerow] = Number(each.innerHTML);
                        var quationofexclude = event.target.dataset.label;
                        if (quationofexclude != 'medication?(if not talking any, check here________ and leave item blank.)' &&
                            quationofexclude != 'How would you rate your overall life satisfaction andcontentment during the past week?') {
                            this.totalVal = this.totalVal + Number(each.innerHTML);
                        }
                        console.log("score", this.totalVal);
                        let caluculatedValue = this.totalVal - 14;
                        let finalScore;
                        this.finalValue = caluculatedValue / 56;
                        finalScore = this.finalValue.toFixed(2);
                        console.log('finalScore' + finalScore);
                        console.log('finalValue' + this.finalValue);

                    }
                    else {
                        each.className = "slds-border_left slds-border_right";
                    }
                }
            })

            this.selectedValue = this.phq9 + "-" + this.finalValue.toFixed(2).toString();
        }
    }
    onClickCheckboxText(event) {
        //console.log('length',this.template.querySelector('[data-name='+event.target.name+']'));
        //this.template.querySelector('[data-name='+event.target.name+']').style="display:block"; 
        var value = '';
        this.template.querySelectorAll("[data-checkboxtext]").forEach(each => {
            if (each.dataset.checkboxtext == event.target.name) {
                if (event.target.checked && this.selectedValue != 'I do not currently take any medications for MDD' && event.target.name != 'Other[specify]') {
                    each.style = "display:block;border-radius:0px !important;width:71px;height:43px;margin-left: -41px;margin-bottom:37px";
                    value = value + ',' + event.target.name
                }
                else {
                    each.style = "display:none";
                }
            }
        })

        this.template.querySelectorAll("[data-mglabel]").forEach(each => {
            if (each.dataset.mglabel == event.target.name) {
                if (event.target.checked && this.selectedValue != 'I do not currently take any medications for MDD' && event.target.name != 'Other[specify]') {
                    each.style = "display:block;margin-left: -255px;margin-top: 8px";
                    value = value + ',' + event.target.name
                }
                else {
                    each.style = "display:none";
                }
            }
        })

        this.template.querySelectorAll("[data-othertext]").forEach(each => {
            if (each.dataset.othertext == event.target.name) {
                if (event.target.checked && event.target.name == 'Other[specify]') {
                    console.log('checktest');
                    each.style = "display:block;border-radius:0px !important;width:246px;height:43px;margin-left: -386px;margin-bottom:37px";
                    value = value + ',' + event.target.name
                }
                else {
                    each.style = "display:none";
                }
            }
        })

        this.template.querySelectorAll("[data-otherboxtext]").forEach(each => {
            if (each.dataset.otherboxtext == event.target.name) {
                if (event.target.checked && event.target.name == 'Other[specify]') {
                    console.log('otherboxtext');
                    each.style = "display:block;border-radius:0px !important;width:71px;height:43px";
                    value = value + ',' + event.target.name
                }
                else {
                    each.style = "display:none";
                }
            }
        })

        this.template.querySelectorAll("[data-othermglabel]").forEach(each => {
            if (each.dataset.othermglabel == event.target.name) {
                if (event.target.checked && event.target.name == 'Other[specify]') {
                    each.style = "display:block ;margin-left: -215px;margin-top: 10px;";
                    value = value + ',' + event.target.name;
                }
                else {
                    each.style = "display:none";
                }
            }
        })

        this.selectedValue = event.target.name;
        console.log('this.selectedValue' + this.selectedValue + 'event.target.name' + event.target.name);
        if (this.selectedValue === 'I do not currently take any medications for MDD') {
            this.modalContent = JSON.parse(this.question.modelContent__c).modalcontent;
            //console.log('this.modalData.modalcontent'+this.modalData.modalcontent);
            // this.modalContent=this.modalData.modalcontent;
            this.isModalOpen = true;
            this.isModalContent = true;
            this.isOkButton = true;
            this.isCancelButton = true;
        }

    }

    customCalculation(event) {

        //console.log('inside the handleChange Event for ' + event.target.name + 'target type:' + event.target.type);
        console.log('testing', event.target.dataset.customprorow, event.target.dataset.customprocol);
        this.template.querySelectorAll('[data-customprocol]').forEach(each => {
            if (each.dataset.customprorow == event.target.dataset.customprorow) {
                console.log(event.target.dataset.customprorow);
                if (each.dataset.customprocol == event.target.dataset.customprocol) {
                    each.className = "phqScore";
                    this.whoAnswersList[Number(each.dataset.customprorow)] = Number(event.target.dataset.customvalue);
                    console.log(this.whoAnswersList[Number(each.dataset.customprorow)]);
                }
                else {
                    each.className = "phqdefaultScore";
                }
            }
        })
        this.selectedValue = JSON.stringify(this.whoAnswersList);
        console.log(this.selectedValue);


    }

    onDosageEntry(event) {
        this.selectedValue = event.target.dataset.checkboxtext + " " + event.target.value;
    }
    //PHQ9 development end
    renderedCallback() {

        // this.template.querySelectorAll("[data-name='dateInput']").forEach(each => {
        //     each.style = "display:block;border-radius:0px !important;width:71px;height:43px";
        //      })&& this.phq9Flag
        if (this.isFirstTime) {
            this.isFirstTime = false;


            if (this.surveyanswer != undefined) {
                if (this.question.Display_Type__c === 'Table with section') {
                    this.phq9Flag = false;
                    this.answerList = this.surveyanswer.Text_Response_Value__c.split("-")[0];
                    this.template.querySelectorAll('[data-tableprorow]').forEach(each => {
                        for (let i = 0; i < this.answerList.split(",").length; i++) {
                            if (i == each.dataset.tableprorow && this.answerList.split(",")[i] == each.dataset.tableprocol) {
                                each.className = 'phqScore slds-border_left slds-border_right';
                            }
                        }

                    })
                    this.template.querySelectorAll("[data-tablepro]").forEach(row => {
                        row.dataset.flagprotable = "true";
                    })
                    this.selectedValue = this.surveyanswer.Text_Response_Value__c;
                }
                else if (this.question.Display_Type__c === 'Date') {
                    this.answer = this.surveyanswer.Text_Response_Value__c?.replace(/["]+/g, '');
                    this.selectedValue = this.answer;

                }
                else if (this.question.Display_Type__c === 'Number') {
                    this.answer = Number(this.surveyanswer.Text_Response_Value__c?.replace(/["]+/g, ''));
                    this.selectedValue = this.answer;

                }
                else if (this.question.Display_Type__c === 'Combo Box' || this.question.Display_Type__c === 'Radio Button') {
                    this.answer = this.surveyanswer.Text_Response_Value__c?.replace(/["]+/g, '');
                    this.selectedValue = this.answer;
                }
                else if (this.question.Display_Type__c === 'Checkbox Group') {
                    this.answer = this.surveyanswer.Text_Response_Value__c?.replace(/["]+/g, '');
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (this.answer?.includes(each.label)) {
                            each.checked = true;
                           
                        }
                    })
                    this.selectedValue = this.answer;
                }
                else if (this.question.Display_Type__c === 'Text') {
                    this.answer = this.surveyanswer.Text_Response_Value__c?.replace(/["]+/g, '');
                    this.selectedValue = this.answer;
                }
                else if (this.question.Display_Type__c === 'Text Area') {
                    this.answer = this.surveyanswer.Text_Response_Value__c?.replace(/["]+/g, '');
                    this.selectedValue = this.answer;
                }

                else if (this.question.Display_Type__c === 'Checkbox Text') {
                    this.answer = this.surveyanswer.Text_Response_Value__c?.replace(/["]+/g, '');
                    this.selectedValue = this.answer;
                }

                else if (this.question.Display_Type__c === 'Radio - Number Input') {
                    this.answer = this.surveyanswer.Text_Response_Value__c?.replace(/["]+/g, '');
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (this.answer?.includes(each.label)) {
                            each.checked = true;
                            if(this.isother = true){
                             this.otherLabel = this.otherOption.forlabel;
                            }

                        }
                        
                    })
                    this.selectedValue = this.answer;
                    /*  if(!this.surveyanswer.Text_Response_Value__c){
                     this.answer = JSON.parse(this.surveyanswer.Text_Response_Value__c);
                     this.answer.forEach(each => {
                         if (each.includes('selectedvalue')) {
                             this.selectedValue = each.split('selectedvalue')[1]
                         }
                         else if (each.includes('count')) {
                             this.count = each.split('count')[1]
                         }
                         else if (each.includes('dosage')) {
                             this.dosage = each.split('dosage')[1]
                         }
                         else if (each.includes('frequency')) {
                             this.frequency = each.split('frequency')[1]
                         }
                     })
                     this.answer = this.selectedValue;
                     //this.selectedValue = this.answer;
                 }
                 else{
                     this.answer = null;
                 } */
                }

                else if (this.question.Display_Type__c === 'Table') {

                    let existingAnswer = JSON.parse(this.surveyanswer.Text_Response_Value__c);
                    this.template.querySelectorAll('[data-tablename]').forEach(each => {
                        if (each.dataset.tablename != undefined && each.dataset.title == existingAnswer[each.dataset.tablename]) {
                            each.checked = true;
                        }
                    })
                }
                this.selectedValue = this.surveyanswer.Text_Response_Value__c;
            }
        }
        if (this.surveyanswer != undefined && this.surveyanswer.Other_Response_Value__c != undefined) {
            if (this.surveyanswer.Text_Response_Value__c.toLowerCase().includes('other')) {
                this.isother = true;
                if (this.template.querySelector('[data-name="otherInput"]') != null) {
                    this.template.querySelector('[data-name="otherInput"]').value = this.surveyanswer.Other_Response_Value__c;
                }
            }
        }
    }

}