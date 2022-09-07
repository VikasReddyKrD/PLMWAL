import { LightningElement, api, track } from 'lwc';

export default class TransplantMultiQuestions extends LightningElement {

    @api user;
    @api question;
    @api selectedValue;
    @api answer;
    @api isFirstTime;
    @api order;
    @api nestedValues;
    multiOptionSelectedValue;
    @api otherResponseValue;
    otherMap = new Map();
    surveyAnswer;
    nestedComboAnswer;
    isModalOpen = false;
    modalContent;
    isModalContent = false;
    nestedValue3 = false;
    isCancelButton = true;
    isOkButton = true;
    texttextque = false;
    isNestedOptions = false;
    tableArray = new Map();
    nestedOptionType = { "radio": false, "text": false, "checkbox": false }
    nestedOptions = [];
    q16p2value = [];
    monthData;
    yearData;
    dayData;
    tableValidation;
    isother;
    textque='';
    nestedValue1 = false;
    nestedValue2 = false;
    isRadioCheckbox = false;
    isMultipleQuestionsPart2 = false;
    dataMap = new Map();
    //@track colCount = [];
    ischecking;
    @track otherBoxes = []
    dayflag = false;
    value = '';
    multipleNestedOptions1;
    multipleNestedOptions2;
    daysList;
    isCheckboxValidnFailed = false;
    dateValidation = false;
    monthsMap = { "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6, "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12 };
    isColSpanFirst = false;
    nestedCheckboxLabel = false;
    nestedRadioValue;
    customTableAnswers = [];
    @api skippedquestion;
    tableValid = false;
    nesteComboboxValidation;
    nestedCheckboxValues = [];
    nesteCheckboxValidation;
    multiNestedOptionsTypeDif;
    nestedTextValue;
    tableValues;
    @track multiQuestionsData = { 'radio1': '', 'radio2': '', 'checkboxes': '' }
    @track radioText = { 'radio': '', 'text': '', 'radioinnertext': '' };
    @api nestedOptionsData = { "isnestedoptions": false, 'isradio': false, 'ischeckbox': false, 'istext': false, 'iscombobox': false, 'value': '', 'mainvalue': '' };
    //  isFirst = false;
    @track singleQuestionsData = { 'maindata': '', 'inneroptions': '' }
    @api
    getMultiOptionSelectedValue() {
        return this.multiOptionSelectedValue;
    }
    @api
    setIsNestedOptions() {
        this.isNestedOptions = true;
    }
    @api
    clearAnswer() {
        this.selectedValue = undefined;
        this.otherOption = undefined;
        this.answerOther = undefined;
        this.surveyanswer = undefined;
        this.isNestedOptions = false;
        this.isother = false;

    }

    @api
    tableDisable(data) {
        if (data == '<6 months' || data == '6mos-1 year') {
            this.template.querySelectorAll('lightning-input').forEach(each => {
                if (each.dataset.validation && each.type == "radio") {
                    if (each.checked) {
                        each.checked = false;
                    }
                    each.disabled = true;
                }
            })
        }
        else {
            this.template.querySelectorAll('lightning-input').forEach(each => {
                if (each.dataset.validation && each.type == "radio") {
                    each.disabled = false;
                }
            })
        }
        console.log("this.tableValid", this.tableValid);
    }

    @api
    transplantPreQuestionDisplay() {
        this.isFirst = true;
    }
    get questionsOrder() {
        return this.order + 1;
    }

    get optionsNew() {
        return [
            { label: 'Sales', value: 'option1' },
            { label: 'Force', value: 'option2' },
        ];
    }
    get isQuestionSplit() {
        return this.question?.Question_Text__c?.includes("\\n") ? true : false;
    }
    get questionText() {
        //this.isQuestionSplit =this.question.Question_Text__c.includes("\\n")?true:false
        // if(this.isQuestionSplit){console.log("zinf zing zing")}
        let question = this.question?.Question_Text__c?.includes("\\n") ? this.question.Question_Text__c.split("\\n")[0] : this.question.Question_Text__c
        return question;
    }
    // get nestedCheckOPtions(){
    //     if(this.question.Order__c == 8 && this.user == "Patient"){
    //     return [{"label":"Kidney","value":"Kidney"},{"label":"Lung","value":"Lung"},{"label":"Liver","value":"Liver"},{"label":"Heart","value":"Heart"},{"label":"Pancreas","value":"Pancreas"},{"label":"Intestine","value":"Intestine"},{"label":"Other","value":"Other"}]
    //     }
    //     else if(this.question.Order__c == 6 && this.user == "Patient"){
    //         return [{"label":"I have applied for Social Security Disability (SSD)","value":"I have applied for Social Security Disability (SSD)"},{"label":"I receive Social Security Disability Insurance (SSDI)","value":"I receive Social Security Disability Insurance (SSDI)"},{"label":"I receive Supplement Security Income (SSI)","value":"I receive Supplement Security Income (SSI)"},{"label":"I receive a different type of assistance (please specify)","value":"I receive a different type of assistance"},{"label":"I do not currently receive compensation","value":"I do not currently receive compensation"}];
    //         }

    // }

    get questionText3() {
        //this.isQuestionSplit =this.question.Question_Text__c.includes("\\n")?true:false
        let question = this.question.Question_Text__c.includes("\\n") ? this.question.Question_Text__c.split("\\n")[1] : this.question.Question_Text__c
        return question;
    }
    get tabletransitionmsg() {
        return (this.question.Next_Question__c && JSON.parse(this.question.Next_Question__c).tabletransitionmsg) ? JSON.parse(this.question.Next_Question__c).tabletransitionmsg : '';
    }

    get questionText1() {
        if (this.question.Display_Type__c === 'Multiple Questions') {
            return this.question.Question_Text__c?.split("-")[0];
        }

    }

    get questionText2() {
        if (this.question.Display_Type__c === 'Multiple Questions') {
            return this.question.Question_Text__c?.split("-")[1];
        }
    }

    get isCustomType() {
        return (this.question.Display_Type__c === 'customType') ? true : false;
    }

    get isRadio() {
        return (this.question.Display_Type__c === 'Radio Button') ? true : false;

    }
    get isDate() {
        return (this.question.Display_Type__c === 'Date') ? true : false;
    }
    get isTextBoxRadio() {
        return (this.question.Display_Type__c === 'RadioButtonTextBox') ? true : false;
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
    get isNumber() {
        return (this.question.Display_Type__c === 'Number') ? true : false;
    }

    get isTable() {
        // this.transitionMessageTable = JSON.parse(this.question.Next_Question__c)?.transitionmesage;
        return (this.question.Display_Type__c === 'Table') ? true : false;

    }
    get isDropdownCombo() {
        return (this.question.Display_Type__c === 'Dropdown Combo Type') ? true : false;
    }
    get isCustomTable() {
        return (this.question.Display_Type__c === 'customTable') ? true : false;
    }

    get isMultipleQuestions() {
        return (this.question.Display_Type__c === 'Multiple Questions') ? true : false;
    }
    get optionValues() {
        //console.log('option values' + this.question.Options__c);
        let options = (this.question.Options__c) ? JSON.parse(this.question.Options__c) : undefined;
        this.otherOption = (this.question.Option_Other__c) ? JSON.parse(this.question.Option_Other__c) : undefined;
        this.tableValues = options;
        return options;
    }
    get isSingleQuestion() {
        return (this.question.Display_Type__c === 'singleQuestion') ? true : false;
    }



    createCol() {
        alert("testing123");
        console.log("LWC");
    }
    loadHandler(event) {
        alert()
    }

    get yearDataList() {

        // let yearDataList = [{ "label": "2022", "value": "2022" },       
        // { "label": "2021", "value": "2021" },
        // { "label": "2020", "value": "2020" },
        // { "label": "2019", "value": "2019" },
        // { "label": "2018", "value": "2018" },
        // { "label": "2017", "value": "2017" },
        // { "label": "2016", "value": "2016" },
        // { "label": "2015", "value": "2015" },
        // { "label": "2014", "value": "2014" },
        // { "label": "2013", "value": "2013" },
        // { "label": "2012", "value": "2012" }];

        let yearData = new Date().getFullYear() - 10;
        let yearDataList = [];
        for (let i = yearData; i < yearData + 11; i++) {
            yearDataList.push({ "label": i, "value": i });
        }
        yearDataList.reverse();
        return yearDataList;
    }

    get monthsList() {
        let monthsList = [{ "label": "January", "value": 1 },
        { "label": "February", "value": 2 },
        { "label": "March", "value": 3 },
        { "label": "April", "value": 4 },
        { "label": "May", "value": 5 },
        { "label": "June", "value": 6 },
        { "label": "July", "value": 7 },
        { "label": "August", "value": 8 },
        { "label": "September", "value": 9 },
        { "label": "October", "value": 10 },
        { "label": "November", "value": 11 },
        { "label": "December", "value": 12 }];

        /*  for(let i=1;i<13;i++){
           monthsList.push({"label":i,"value":i});
       } */
        return monthsList;
    }

    connectedCallback() {
       // this.textque='Guess'+this.question.Order__c+this.user
        console.log(this.question.Order__c)

       /*  if (this.question.Question_Text__c == "Have you ever received pre-emptive or prophylaxis (preventive care) for CMV infection post-transplant?") {
            this.textque = "Pre-emptive treatment is when a patient's CMV levels are monitored for early replication (CMV virus increases), and a treatment (antiviral drug) is given only when CMV replication is detected to prevent disease progression.";
        }
        if (this.question.Question_Text__c == 'Has your patient received pre-emptive or prophylaxis (preventive care) for CMV infection post-transplant?') {
            this.textque = "Pre-emptive treatment is when a patient's CMV levels are monitored for early replication (CMV virus increases), and a treatment (antiviral drug) is given only when CMV replication is detected to prevent disease progression.";
        } */
    }

    get transitionMessageTable() {
        return JSON.parse(this.question.Next_Question__c)?.transitionmesage;
    }
    // used as hybrid radio-combobox group
    get options() {
        return [{ "label": "Outside of the U.S.", "value": "Outside of the U.S." }]
    }
    //newly added
    get modalData() {
        console.log('test1' + this.question.modelContent__c);
        if (this.question.modelContent__c != undefined) {
            return JSON.parse(this.question.modelContent__c);
        }
        else {
            return undefined;
        }
    }
    closeModal() {
        // to close modal set isModalOpen track value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
        this.isModalContent = true;
        window.location.href = "https://www.patientslikeme.com/users/sign_in";

    }
    numberPress(event) {
        console.log(event.keyCode);
        console.lof("which", event.which);
        if ([75, 77, 84, 66, 69, 44, 45, 46, 107, 109, 98, 116, 101, 43].includes(event.keyCode)) {
            event.preventDefault();
        }
    }


    keyupHandler(event) {
        let flag = true;
        console.log("testing", event.which);
        console.log('keyupHandler', event.keyCode)
        if (event.shiftKey && ([16, 40, 38].includes(event.which))) {
            flag = false;
        }
        if (!flag) {
            event.stopImmediatePropagation();
        }
        // if ([16, 40, 38].includes(event.which)) {
        //     console.log('test', event.which);
        //     event.preventDefault();
        // }
    }

    customTableChangeHandler(event) {
        this.template.querySelectorAll('lightning-input').forEach(each => {
            if (each.label === event.target.label) {
                if (this.dataMap.get(each.dataset.title) != undefined) {
                    if (event.target.type == "checkbox") {
                        let arr = this.dataMap.get(each.dataset.title);
                        if (arr.includes(event.target.label)) {
                            var index = arr.indexOf(event.target.label);
                            arr.splice(index, 1);
                            this.dataMap.set(each.dataset.title, arr);
                        }
                        else {
                            arr.push(event.target.label)
                            this.dataMap.set(each.dataset.title, arr);
                        }
                    }
                    else {
                        let arr = this.dataMap.get(each.dataset.title);
                        arr[0] = event.target.value;
                    }
                }
                else {
                    let arr = new Array();
                    if (event.target.type == "checkbox") {
                        arr.push(event.target.label)
                        this.dataMap.set(each.dataset.title, arr);
                    }
                    else {
                        arr.push(event.target.value)
                        this.dataMap.set(each.dataset.title, arr);
                    }
                }
            }
        })
        console.log("dataMap", this.dataMap);
        let obj = Object.fromEntries(this.dataMap);
        this.selectedValue = JSON.stringify(obj);
        console.log("this.selectedValue", this.selectedValue)
    }

    screenoutHandler() {
        this.isModalOpen = true;
        this.modalContent = "You should be from the US to continue with the survey"
    }
    handleblur(event) {
        if (event.target.type === "number") {
            if (event.target.value != null && event.target.value != "") {
                if (event.target.value >= 0 && event.target.value < 18) {
                    this.selectedValue = event.target.value;
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
    nestedOptionsHandler(event) {
        if (this.isNestedOptions && this.nestedOptionType.radio && event.target.dataset.name == "nestedRadio") {
            this.template.querySelectorAll("[data-name='nestedradioInput']").forEach(each => {
                if (each.dataset.value == event.target.dataset.value) {
                    each.value = event.target.dataset.value;

                }
            })

            this.nestedRadioValue = event.target.value;//event.target.dataset.value;
            this.nestedValues = event.target.value;

        }


        /* if (event.target.dataset.value && event.target.dataset.value.includes("Other")) {
            this.isother = true;
            this.otherLabel = this.otherOption.forlabel;
        }

        if (event.target.value && event.target.value.includes("Other")) {
            this.isother = true;
            this.otherLabel = this.otherOption.nestedLabel;
        }

        else {
            this.isother = false;
        } */

        if (this.nestedOptionType.combobox) {
            this.nestedComboAnswer = event.target.value;
            this.nestedOptionsData.iscombobox = true;
        }
        else if (this.nestedOptionType.text) {
            this.nestedTextValue = event.target.value;
            this.nestedOptionsData.istext = true;

        }

        this.multiOptionSelectedValue = this.selectedValue + '__' + this.nestedRadioValue;
        this.nestedOptionsData.isnestedoptions = this.isNestedOptions;
        this.nestedOptionsData.isradio = this.nestedOptionType.radio; //done
        this.nestedOptionsData.ischeckbox = this.nestedOptionType.checkbox;
        this.nestedOptionsData.istext = this.nestedOptionType.text;
        this.nestedOptionsData.iscombobox = this.nestedOptionType.combobox;
        this.nestedOptionsData.mainvalue = this.selectedValue;
        if (this.nestedRadioValue != '' && this.nestedRadioValue) {
            this.nestedOptionsData.value = this.nestedRadioValue;
        }
        else if (this.nestedComboAnswer != '' && this.nestedComboAnswer) {
            this.nestedOptionsData.value = this.nestedComboAnswer;
        }
        else if (this.nestedComboAnswer != '' && this.nestedComboAnswer) {
            this.nestedOptionsData.value = this.nestedComboAnswer;
        }
        else if (this.nestedRadioValue != '' && this.nestedRadioValue) {
            this.nestedOptionsData.value = this.nestedRadioValue;
        }
        if (this.nestedOptionsData.ischeckbox) {
            let val = [];
            this.template.querySelectorAll('[data-nestedtype="checkbox"]').forEach(each => {
                val.push(each.value);
            })
            console.log("val", val);
            this.nestedOptionsData.value = val.join(",");
        }
        if (event.target.dataset.type == "radio") {
            event.target.type = "lightning-radio-group";
            this.textboxDisplayHandler(event, this.nestedOptions);
        }
    }

    nestedCheckboxHandler(event) {
        let answers = [];
        this.isNestedOptions = true;
        // this.template.querySelectorAll("[data-nestedtype='checkbox']").forEach(each => {
        //     if (each.checked) {
        //         answers.push(each.dataset.value);
        //     }

        // });
        /*  if (answers.includes("I receive a different type of assistance") || answers.includes("Other")) {
             this.isother = true;
             this.otherLabel = this.otherOption.nestedLabel;
         }
         else {
             this.isother = false
         } */
        if (event.target.dataset.nestedtype == "checkbox") {
            /*   this.nestedCheckboxValues = this.nestedCheckboxValues + ",";
              this.nestedCheckboxValues.substring(0, this.nestedCheckboxValues - 1); */
            event.detail.value.forEach((key, value) => { answers.push(key) })
            this.nestedCheckboxValues = event.detail.value;
            this.nestedOptionsData.isnestedoptions = true;
            this.nestedOptionsData.ischeckbox = true;
            this.nestedOptionsData.value = answers;
            this.nestedOptionsData.mainvalue = this.selectedValue;
            this.nesteCheckboxValidation = false;
            /*  if(this.nestedOptionsData.value.includes("I receive a different type of assistance")){
                 this.isother = true;
                 this.otherLabel ='Specify';
             } */
            /*  if (this.nestedOptionsData.value.includes("I receive a different type of assistance") || this.nestedOptionsData.value.includes("Other")) {
                 this.isother = true;
                 this.otherLabel = this.otherOption.nestedLabel;
             }
             else {
                 this.isother = false;
             } */

        }

        if (event.target.dataset.type == "checkbox") {
            let ev = { "target": { "type": "checkbox", "value": Object.values(event.detail.value) } };
            this.textboxDisplayHandler(ev, this.nestedOptions, event.detail.value);
        }



    }
    singleQuestionsHandler(event) {
        if (this.question.transplantNestedOptions__c != undefined) {
            var nestedoptionsflag = false;
            JSON.parse(this.question.transplantNestedOptions__c).forEach(each => {
                if (event.target.value == each.value) {
                    nestedoptionsflag = true;
                    this.nestedOptions = each.nestedoptions;
                }
            });
        }
        if (event.target.value == 'Yes') {
            this.nestedValue3 = true;
        } else {
            this.nestedValue3 = false;
        }
        this.singleQuestionsData.maindata = event.target.value;
        this.selectedValue = JSON.stringify(this.singleQuestionsData);

    }
    singleQuestionsInnerHandler(event) {
        this.singleQuestionsData.inneroptions = event.target.value;
        this.selectedValue = JSON.stringify(this.singleQuestionsData);
    }
    texthandleChaange(event) {
        this.radioText.text = event.target.value;
        this.selectedValue = JSON.stringify(this.radioText);
    }



    multipleQuestionsHandler(event) {
        if (this.question.transplantNestedOptions__c != undefined) {
            console.log("transplantNestedOptions__c", this.question.transplantNestedOptions__c);
            var nestedoptionsflag = false;
            JSON.parse(this.question.transplantNestedOptions__c).forEach(each => {
                if (event.target.value == each.value) {
                    nestedoptionsflag = true;
                    this.nestedOptions = each.nestedoptions;
                }

            });
            if (this.question.skipNumberTransplant__c != '' && this.question.skipNumberTransplant__c) {
                JSON.parse(this.question.skipNumberTransplant__c).forEach(each => {
                    if (each.value == event.target.value) {
                        this.dispatchEvent(new CustomEvent('skip', {
                            detail: { 'qno': this.question.Order__c, 'visiblequestions': each.visiblequestions, 'hidequestions': each.hiddenquestions }
                        }));
                    }
                })
            }

            if (nestedoptionsflag) {
                this.multipleNestedOptions1 = true;
            }
            else {
                this.multipleNestedOptions1 = false;
            }
            console.log("event.target.value", event.target.value);
        }
        if (event.target.value == 'Yes') {
            this.nestedValue1 = true;
        }
        else if (event.target.value == 'No') {
            this.nestedValue2 = true;
        }
    }

    handleChange(event) {
        //this.otherBoxes = [];
        //this.otherBoxes.clear();
        this.nesteCheckboxValidation = false;
        this.ischecking = true;
        this.isCheckboxValidnFailed = false;
        this.nestedRadioValue = '';
        this.nestedCheckboxValues = [];
        this.isother = false;
        console.log('inside the handleChange Event for ' + event.target.value + 'target type:' + event.target.type);
        console.log('selected value====>', event.detail.value);

        if (event.target.value == "Outside of the U.S.") {
            this.selectedValue = event.target.value;
            this.isNestedOptions = false;
            this.modalContent = JSON.parse(this.question.Next_Question__c).modalcontent;
            this.isModalOpen = true;
            this.isModalContent = true;
            return;
        }

        if (this.question.Order__c == 1 && this.user == "Patient") {
            this.dispatchEvent(new CustomEvent('tableanswer', {
                detail: event.target.value
            }));
        }
        if (event.target.dataset.type == "isTextBoxRadio") {
            this.radioText.radio = event.target.value;
            this.selectedValue = this.radioText;
        }


        if (this.question.transplantNestedOptions__c != undefined) {
            console.log(this.question.transplantNestedOptions__c);
            var nestedoptionsflag = false;
            JSON.parse(this.question.transplantNestedOptions__c).forEach(each => {
                if (event.target.value == each.value) {
                    console.log('Other boxes clearing in transplant nested options');
                    this.otherBoxes = [];
                    nestedoptionsflag = true;
                    this.isNestedOptions = true;
                    this.nestedOptionsData.isnestedoptions = this.isNestedOptions;
                    this.nestedOptionType.text = (each.nestedoptionstype == 'text') ? true : false;
                    this.otherLabel = this.otherOption?.forlabel;
                    this.nestedOptionType.checkbox = (each.nestedoptionstype == 'checkbox') ? true : false;
                    this.nestedOptionType.radio = (each.nestedoptionstype == 'radio') ? true : false;
                    this.nestedOptionType.combobox = (each.nestedoptionstype == 'combobox') ? true : false;
                    this.nestedOptions = each.nestedoptions;
                }
            });
            if (!nestedoptionsflag) {
                this.nestedOptionsData.isnestedoptions = false;
                this.isNestedOptions = false;
            }
        } else {
            this.isNestedOptions = false;
        }
        //new change strt
        if (this.question.skipNumberTransplant__c != '' && this.question.skipNumberTransplant__c) {
            JSON.parse(this.question.skipNumberTransplant__c).forEach(each => {
                if (each.value == event.target.value) {
                    this.dispatchEvent(new CustomEvent('skip', {
                        detail: { 'qno': this.question.Order__c, 'visiblequestions': each.visiblequestions, 'hidequestions': each.hiddenquestions }
                    }));
                }
            })
        }
        if (event.target.type === "RadioButtonTextBox") {
            this.selectedValue = event.target.value;
        }
        if (event.target.type === "Date" || event.target.type === "radio") {
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
                    if (JSON.parse(this.question.modelContent__c).modalcontent1 != undefined) {
                        this.modalContent = (JSON.parse(this.question.modelContent__c).modalcontent1) ? JSON.parse(this.question.modelContent__c).modalcontent1 : JSON.parse(this.question.modelContent__c).modalcontent1;
                        this.isModalOpen = true;
                        this.isModalContent = true;
                        this.isCancelButton = false;
                        this.isOkButton = false;
                        return;
                    }
                }
                if (event.target.value === this.modalData.answer) {
                    this.modalContent = JSON.parse(this.question.modelContent__c).modalcontent;
                    this.isModalOpen = true;
                    this.isModalContent = true;
                    this.isOkButton = true;
                    this.isCancelButton = true;
                    return;
                }
            }
        }
        else {
            this.selectedValue = event.target.value;
            this.isModalContent = false;
        }
        //new change end

        let answerOther = '';
        if (event.target.type === "checkbox") {
            if (event.target.checked && event.target.name === "None") { //None
                this.template.querySelectorAll('lightning-input').forEach(each => {
                    console.log('if :Not NONE --the value is ' + each.name + ' ischecked:' + each.checked + ' type is:' + each.type);
                    if (each.checked && each.name !== "None")
                        each.checked = false;
                });

            }
            else {
                let values = [];
                // console.log('else : the value is ' + each.name + ' ischecked:' + each.checked + ' type is:' + each.type);
                this.template.querySelectorAll('lightning-input').forEach(each => {
                    if (each.checked)
                        values.push(each.name);
                    if (each.checked && each.name === "Other")
                        answerOther = "Other";
                });
                this.selectedValue = '';
                this.selectedValue = values.join(',');
                if (event.target.dataset.value != 'Not applicable (no longer on treatment)') {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.dataset.value == 'Not applicable (no longer on treatment)') {
                            each.checked = false;
                            values.splice(values.indexOf(each.name), 1);
                        }
                    })
                }
                if (event.target.dataset.value != 'No symptoms') {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.dataset.value == 'No symptoms') {
                            each.checked = false;
                            values.splice(values.indexOf(each.name), 1);
                        }
                    });
                }
                if (event.target.dataset.value != 'Not applicable (did not take any treatment prior)') {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.dataset.value == 'Not applicable (did not take any treatment prior)') {
                            each.checked = false;
                            values.splice(values.indexOf(each.name), 1);
                        }
                    });
                }
                let eleNone = this.template.querySelector('lightning-input[data-id="None"]');
                if (eleNone) {
                    eleNone.checked = false;
                }
                if (event.target.name != 'All of the above') {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.name == ('All of the above') && each.checked) {
                            each.checked = false;
                            values = this.removevalueFromArrya(values, each.name);
                            this.selectedValue = values.join(',');
                        }
                    });
                }
                if (event.target.name != "I don't know") {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.name == ("I don't know") && each.checked) {
                            each.checked = false;
                            values = this.removevalueFromArrya(values, each.name);
                            this.selectedValue = values.join(',');
                        }
                    });
                }

                if (event.target.name != "I don't know/Not involved in the management of CMV") {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.name == ("I don't know/Not involved in the management of CMV") && each.checked) {
                            each.checked = false;
                            values = this.removevalueFromArrya(values, each.name);
                            this.selectedValue = values.join(',');
                        }
                    });
                }

                if (event.target.name != 'Not applicable (no longer on treatment)') {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.name == ('Not applicable (no longer on treatment)') && each.checked) {
                            each.checked = false;
                            values.splice(values.indexOf(each.name), 1);
                        }
                    });
                }
                if (event.target.name != 'Not applicable (did not take any treatment prior)') {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.name == ('Not applicable (did not take any treatment prior)') && each.checked) {
                            each.checked = false;
                            values = this.removevalueFromArrya(values, each.name);
                            this.selectedValue = values.join(',');
                        }
                    });
                }
                if (event.target.name != 'No symptoms') {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.name == ('No symptoms') && each.checked) {
                            each.checked = false;
                            values = this.removevalueFromArrya(values, each.name);
                            this.selectedValue = values.join(',');
                        }
                    });
                }
                if (event.target.name != "Don't know") {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.name == ("Don't know") && each.checked) {
                            each.checked = false;
                            values = this.removevalueFromArrya(values, each.name);
                            this.selectedValue = values.join(',');
                        }
                    });
                }
                if (event.target.name != "Never received pre-emptive or prophylaxis treatment") {
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.name == ("Never received pre-emptive or prophylaxis treatment") && each.checked) {
                            each.checked = false;
                            values = this.removevalueFromArrya(values, each.name);
                            this.selectedValue = values.join(',');
                        }
                    });
                }
                if ((event.target.name == "Don't know" || event.target.name == 'No symptoms' || event.target.name == 'Never received pre-emptive or prophylaxis treatment' || event.target.name == "I don't know/Not involved in the management of CMV" || event.target.name == "All of the above" || event.target.name == "I don't know" || event.target.name == "Not applicable (did not take any treatment prior)" || event.target.name == "Not applicable (no longer on treatment)") && event.target.checked) { //No symptoms
                    console.log("inside the thing")
 
                    this.otherMap = new Map();
                    this.otherResponseValue = undefined;
                    this.otherBoxes = [];
                    var temp = this.template.querySelectorAll('lightning-input');
                    console.log('this.temp',temp);
                    this.template.querySelectorAll('lightning-input').forEach(each =>   {
                        console.log('each.name',each.name);
                        console.log('event.target.name',event.target.name);
                        console.log('values',values);
                        if (event.target.name == each.name) {
                                each.checked = true;
                        }

                        else {
                            each.checked = false;

                            values.splice(values.indexOf(each.name), 1);
                           
                        }
                    });
                    this.selectedValue = event.target.name;
                    console.log("this.selectedValue zing", this.selectedValue, event.detail.value);
                    // if (this.selectedValue.includes("I don't know") || this.selectedValue.includes("All of the above") || this.selectedValue.includes("No symptoms") || this.selectedValue.includes("I don't know/Not involved in the management of CMV") || this.selectedValue.includes("Not applicable (did not take any treatment prior)")) {
                    //     this.selectedValue.split(",").forEach(each => {
                    //         if (each == "Don't know" || each == "I don't know" || each == "All of the above" || each == "I don't know/Not involved in the management of CMV" || each == "No symptoms" || each == "Not applicable (did not take any treatment prior)") {
                    //             this.selectedValue = each;
                    //         }
                    //     })
                    // }
                    // else if(event.detail.value!="I don't know" && this.selectedValue.includes("I don't know")){
                    //     let ans =   this.selectedValue.split(",");
                    //     ans.splice(ans.indexOf("I don't know"),1);
                    //     this.selectedValue = ans.join(",");
                    // }
                    let count = 0;
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.checked) {
                            count++;
                        }
                    });
                    console.log("count is", count, "name is", event.target.name, "event.checked", event.target.checked)
                    if (count == 1 && event.target.name == 'No symptoms' && !event.target.checked) {
                        this.template.querySelectorAll('lightning-input').forEach(each => { each.checked = false; });
                    }
                }
                console.log("values", values);
                if (values.length == 0) {
                    this.otherBoxes = [];
                }
            }
        }
        else if (event.target.type == "date") {
            let currentDate = new Date();
            let enteredDate = new Date(event.detail.value);
            this.selectedValue = event.detail.value;
            if (currentDate.getFullYear() - enteredDate.getFullYear() < 18) {
                this.modalContent = JSON.parse(this.nextQuestion).modalcontent;
                this.isModalOpen = true;
                this.dispatchEvent(new CustomEvent('validation', {
                    detail: true
                }));
            }
            else {
                this.dispatchEvent(new CustomEvent('validation', {
                    detail: false
                }));
            }
        }
        else {
            this.selectedValue = event.detail.value;
            this.surveyanswer = event.detail.value;
            answerOther = event.detail.value;
        }
        answerOther = this.selectedValue;
        if (event.target.dataset.type == "radio") {
            event.target.type = "lightning-radio-group";
            this.otherMap.clear();
        } else if (event.target.dataset.type == "comboInput") {
            event.target.type = "lightning-combobox";
            this.otherMap.clear();
        }
        this.textboxDisplayHandler(event, this.optionValues);

        console.log('isotherValue ----->>>' + this.isother);
        console.log('Last ::the selected value is :' + this.selectedValue);

        if (this.question.skipNumberTransplant__c != '' && this.question.skipNumberTransplant__c && event.target.type == "checkbox") {
            JSON.parse(this.question.skipNumberTransplant__c).forEach(each => {
                if (this.selectedValue.includes(each.value)) {
                    this.dispatchEvent(new CustomEvent('skip', {
                        detail: { 'qno': this.question.Order__c, 'visiblequestions': each.visiblequestions, 'hidequestions': each.hiddenquestions }
                    }));
                }
            })
        }

    }

    IsNewlyChecked(event, checkBoxName)
    {
        let newValue = event.detail.value;
        let oldValue = this.q16p2value;
        if(!oldValue)
        {
            oldValue = [];
        }
            if(!oldValue.includes(checkBoxName) && newValue.includes(checkBoxName))
        {
            return true;
        }
        return false;
    }


    multiQuestionsHandler1(event) {
        console.log(event.detail.value);
        let isIdontrememberChecked= this.IsNewlyChecked(event, 'I don’t remember');
        this.q16p2value = event.detail.value;
        console.log('selectedvalues',this.q16p2value);
        if(isIdontrememberChecked)
        {
            this.q16p2value = ['I don’t remember'];
        }
        else
        {
            if(this.q16p2value.includes('I don’t remember'))
            {
                this.q16p2value.splice(this.q16p2value.indexOf('I don’t remember'),1);
            }
        }

        let ev = { "target": { "type": "Checkbox Group","value": Object.values(this.q16p2value) } };
        this.textboxDisplayHandler(ev, this.optionValues.option2, this.q16p2value);
        this.multiQuestionsData.checkboxes = this.q16p2value;
        this.selectedValue = JSON.stringify(this.multiQuestionsData);  
    }


    handleotherchange(event) {
        console.log(event.target.dataset.key, "=====>" + event.target.value);
        let otherFilterBoxes = this.otherBoxes.filter(function (e) {
            return e.label == event.target.dataset.key;
        });
        otherFilterBoxes[0].value = event.target.value;
        this.otherMap.set(event.target.dataset.key, event.target.value);
        this.otherResponseValue = JSON.stringify(Object.fromEntries(this.otherMap));
        console.log("this.otherResponseValue", this.otherResponseValue);
        this.template.querySelector(`[data-key=${event.target.dataset.key}]`).value = event.target.value;
    }

    textboxDisplayHandler(event, optionValues, selectedValuesList) {
        if(event.target.type=="checkbox"){
            console.log("event.target.checked==========>",event.target.checked);
            if(event.target.checked){
                console.log("inside 1");
                optionValues.forEach(each => {
                    if (each.value == event.target.name && each.isInputRequired){
                        this.otherBoxes.push({ 'label': each.value, 'value': '', 'otherLabel': each.otherLabel });
                    }
            })
            }
            else if(event.target.checked == undefined){
                console.log("inside 2");
                this.populatesNestedOptionsData(optionValues,selectedValuesList);
            }
            else if(!event.target.checked){
                console.log("inside 3");
                this.removeData(event.target.name);
            }
        }
        else if(event.target.type=="combobox"){
            optionValues.forEach(each => {
                if (each.value == event.target.value && each.isInputRequired)
                    this.otherBoxes.push({ 'label': each.value, 'value': '', 'otherLabel': each.otherLabel });
                    this.removeData();
            })
        }
        else if(event.target.type=="Checkbox Group"){
            optionValues.forEach(each => {
                if(each.value == 'I don’t remember')
                {
                    if(each.checked)
                    {
                        this.removeData();
                    }
                }
                let existing = this.otherBoxes.filter(c=> c.label == each.value);
                if(existing.length > 0 && !event.target.value.includes(each.value))
                {
                    this.otherBoxes.splice(this.otherBoxes.indexOf(existing[0]), 1)
                    this.otherMap.delete(each.value);
                    this.otherResponseValue = JSON.stringify(Object.fromEntries(this.otherMap));
                }
                if (event.target.value.includes(each.value) && each.isInputRequired && existing.length == 0)
                    this.otherBoxes.push({ 'label': each.value, 'value': '', 'otherLabel': each.otherLabel });
            })
        }
        else{
            this.otherBoxes=[];
            this.otherMap = new Map();
            this.otherResponseValue = undefined;
            optionValues.forEach(each => {
                if (each.value == event.target.value && each.isInputRequired)
                    this.otherBoxes.push({ 'label': each.value, 'value': '', 'otherLabel': each.otherLabel });
            })
            
            }
        }

    //used to remove data from other checboxes when checkbox is unchecked
    removeData(valueTobeRemoved){
        this.otherBoxes.forEach((each,index)=>{
            if(each.label == valueTobeRemoved){
                this.otherBoxes.splice(index,1);
            }
        })
        this.otherMap.forEach((key,value)=>{
            console.log("value===========>",value);
            let entryTobeRemoved = this.otherBoxes.filter(c=> c.label==value);
            if(entryTobeRemoved.length==0){
                this.otherMap.delete(value);
            }
        })             
        this.otherResponseValue = JSON.stringify(Object.fromEntries(this.otherMap))
        console.log("this.otherMap==========>",this.otherMap);
        console.log("this.otherResponseValue=====>",this.otherResponseValue);
    }

    populatesNestedOptionsData(options,selectedValuesList){
        console.log("selectedValuesList",selectedValuesList);   
        //this.otherBoxes = [];
        this.otherMap.clear();
        selectedValuesList.forEach(item=>{
            this.nestedOptions.forEach(each=>{
                if(each.isInputRequired && item == each.value){
                    let existing = this.otherBoxes.filter(c=> c.label == item);
                    if(existing.length == 0)
                        this.otherBoxes.push({ 'label': each.value, 'value': '', 'otherLabel': each.otherLabel });
                }
            })
        })
        if(selectedValuesList.length==0){
            this.otherBoxes = [];
        }
        else if(selectedValuesList.length!=0){
            console.log("after trimming",this.nestedOptions.filter(c=>  selectedValuesList.join(",").includes(c.label) && c.isInputRequired));
            let trimmedArray = this.nestedOptions.filter(c=> selectedValuesList.join(",").includes(c.label) && c.isInputRequired);
            if(trimmedArray.length == 0 ){
                this.otherBoxes = [];
            }
            //
        }
        this.otherBoxes.forEach(each => {
            this.otherMap.set(each.label, each.value);
        })
    }
    
    removeSpecify() {
        this.otherMap.forEach((value, key) => {
            let flag = false;
            this.otherBoxes.forEach(each => {
                if (each.label == key) {
                    flag = true;
                }
            })
            if (!flag)
                this.otherMap.delete(key)
        })
    }

    removevalueFromArrya(values, removeValue) {
        try {

            if (values != null && values.length > 0 && removeValue != null) {
                var values_arry = values;
                var indexof_removevalue = values_arry.indexOf(removeValue);
                if (indexof_removevalue > -1) {
                    values_arry.splice(indexof_removevalue, 1);
                }
                return values_arry;
            } else {
                return values;
            }
        } catch (ex) {
        }
    }


    tableHandler(event) {
        console.log('row', event.target.dataset.row, event.target.dataset.col);
        let col = event.target.dataset.col;
        let row = event.target.dataset.row;
        this.tableValues.options.forEach(each => {
            each.option.forEach(item => {
                if (item.rowcol.row == row) {
                    item.value = false;
                }
            })
        })
        this.template.querySelectorAll('lightning-input').forEach(ele => {
            this.tableValues.options.forEach(each => {
                each.option.forEach(item => {
                    if (ele.checked && item.rowcol.col == ele.dataset.col && item.rowcol.row == ele.dataset.row) {
                        item.value = true;
                    }
                })
            })
        })

        this.tableValues.options.forEach((each, index) => {
            var flag = false;
            each.option.forEach(item => {
                // if(item.isInputRequired && event.target.dataset.tablespecify == item.tablespecify){
                //     flag = true;
                //     console.log("flag inside innerloop",flag);
                //     this.otherBoxes.push({"label":item.tablespecify,"value":""});
                // }
                console.log('isinput', item.isInputRequired, item.value, item.tablespecify, typeof (item.isInputRequired), typeof (item.value));

                if (item.isInputRequired == true) {
                    let tempOtherBox = this.otherBoxes.filter(c => c.otherLabel == item.otherLabel );
                    console.log("tempOtherBox=========>",tempOtherBox);
                    if (item.value == true) {
                        flag = true;
                        console.log("flag inside innerloop", flag);

                        if (!(!!tempOtherBox && tempOtherBox.length > 0)) {
                            console.log('inside the if');
                            this.otherBoxes.push({ "otherLabel": item.otherLabel, "label": item.otherLabel, "value": "" });
                            console.log("this.otherBoxes",this.otherBoxes.length,JSON.stringify(this.otherBoxes));
                        }

                        // this.otherBoxes.push({"label":item.tablespecify,"value":""});
                    }
                    else {
                        console.log('inside the if else');

                        if (!!tempOtherBox && tempOtherBox.length > 0) {
                            this.otherBoxes.splice(this.otherBoxes.indexOf(tempOtherBox[0]), 1);
                            this.otherMap.delete(item.otherLabel);
                            this.otherResponseValue = JSON.stringify(Object.fromEntries(this.otherMap));
                        }
                    }
                }


                console.log(" outside this.otherBoxes", JSON.stringify(this.otherBoxes));
                console.log("flag", flag);
                /* if(!flag){
                    console.log("index",index);
                    if(index== 0 )
                            this.otherBoxes.splice(this.otherBoxes.indexOf("other1"),1);
                    else if(index== 1)
                            this.otherBoxes.splice(this.otherBoxes.indexOf("other2"),1);
                    else if(index== 2)
                            this.otherBoxes.splice(this.otherBoxes.indexOf("other3"),1);
                    else if(index== 3)
                            this.otherBoxes.splice(this.otherBoxes.indexOf("other4"),1);
                    
                } */
            })
        })
       // console.log("this.otherBoxes", this.otherBoxes);
        /*         let flag = false;
                this.template.querySelectorAll('[data-col]').forEach(each => {
                    if (each.checked && each.dataset.title == "Other") {
                        flag = true;
                    }
                })
                if (flag) {
                    this.isother = true;
                    this.otherLabel = "Specify";
                } else {
                    this.isother = false;
                } */


        this.selectedValue = JSON.stringify(this.tableValues);
        console.log('intb', this.selectedValue);
        //this.textboxDisplayHandler(event, this.optionValues);
    }

    customHandleChange1(event) {

        //!isNaN(event.target.value) && (this.monthData=Number(event.target.value));
        console.log(event.target.value);
        if (!isNaN(event.target.value) && this.monthData != event.target.value) {
            this.monthData = Number(event.target.value)
        } else {
            this.monthData = '';
        }
        let months;
        if (Number(event.target.value) == 1) {
            months = 'January';
        } else if (Number(event.target.value) == 2) {
            months = 'February';
        } else if (Number(event.target.value) == 3) {
            months = 'March';
        } if (Number(event.target.value) == 4) {
            months = 'April';
        } if (Number(event.target.value) == 5) {
            months = 'May';
        } if (Number(event.target.value) == 6) {
            months = 'June';
        } if (Number(event.target.value) == 7) {
            months = 'July';
        } if (Number(event.target.value) == 8) {
            months = 'August';
        } if (Number(event.target.value) == 9) {
            months = 'September';
        } if (Number(event.target.value) == 10) {
            months = 'October';
        } if (Number(event.target.value) == 11) {
            months = 'November';
        } if (Number(event.target.value) == 12) {
            months = 'December';
        }
        this.checkDate();
        this.selectedValue = this.dayData + '-' + this.months + '-' + this.yearData;
        console.log('inPJ', this.selectedValue);

        if (months && this.yearData) {
            this.daysList = [];
            let daysCount = new Date(this.yearData, this.monthsMap[months], 0).getDate()
            for (let i = 1; i < (daysCount + 1); i++) {
                this.daysList.push({ "label": i, "value": i });
            }
            console.log("this.daysList", this.daysList);
        }
        else {
            this.daysList = [];
            let daysCount = new Date(new Date().getFullYear(), this.monthsMap[months], 0).getDate()
            for (let i = 1; i < (daysCount + 1); i++) {
                this.daysList.push({ "label": i, "value": i });
            }
            console.log("this.daysList", this.daysList);

        }

        if (this.yearData != '') {
            if ((new Date().getFullYear()) - Number(this.yearData) > 3 || (((new Date().getFullYear()) == Number(this.yearData)) && this.monthData && (this.monthsMap[this.monthData] > (new Date().getMonth() + 1)))) {
                this.modalContent = "Date of transplant surgery can't be more than three years from the current year to participate in this survey";
                this.isModalOpen = true;
                this.isModalContent = true;
                return;
            }
        }
    }



    customHandleChange2(event) {
        console.log("testing")
        this.dateValidation = false;
        if (!isNaN(event.target.value) && this.dayData != event.target.value) {
            this.dayData = Number(event.target.value)
        } else {
            this.dayData = '';
        }
        this.checkDate();
        this.selectedValue = this.dayData + '-' + this.monthData + '-' + this.yearData;
    }


    customHandleChange3(event) {
        console.log(event.target.value);
        if ((new Date().getFullYear()) - Number(event.target.value) > 3 || (((new Date().getFullYear()) == Number(event.target.value)) && this.monthData && (this.monthsMap[this.monthData] > (new Date().getMonth() + 1)))) {
            this.modalContent = "Date of transplant surgery can't be more than three years from the current year to participate in this survey";
            this.isModalOpen = true;
            this.isModalContent = true;
            return;
        }
        if (!isNaN(event.target.value) && this.yearData != event.target.value) {
            this.yearData = Number(event.target.value)
        } else {
            this.yearData = '';
        }
        this.checkDate();
        let months;
        if (Number(event.target.value) == 1) {
            months = 'January';
        } else if (Number(event.target.value) == 2) {
            months = 'February';
        } else if (Number(event.target.value) == 3) {
            months = 'March';
        } if (Number(event.target.value) == 4) {
            months = 'April';
        } if (Number(event.target.value) == 5) {
            months = 'May';
        } if (Number(event.target.value) == 6) {
            months = 'June';
        } if (Number(event.target.value) == 7) {
            months = 'July';
        } if (Number(event.target.value) == 8) {
            months = 'August';
        } if (Number(event.target.value) == 9) {
            months = 'September';
        } if (Number(event.target.value) == 10) {
            months = 'October';
        } if (Number(event.target.value) == 11) {
            months = 'November';
        } if (Number(event.target.value) == 12) {
            months = 'December';
        }

        this.selectedValue = this.dayData + '-' + months + '-' + this.yearData;
        if (months && this.yearData) {
            this.daysList = [];
            let daysCount = new Date(this.yearData, this.monthsMap[months], 0).getDate()
            for (let i = 1; i < (daysCount + 1); i++) {
                this.daysList.push({ "label": i, "value": i });
            }
            console.log("this.daysList", this.daysList);
        }
    }
    checkDate() {
        if (this.monthData && this.dayData && this.yearData) {
            const dateString = this.monthData + ' ' + this.dayData + ', ' + this.yearData;
            const date1 = new Date(dateString);
            const date2 = new Date();
            date2.setHours(0, 0, 0, 0);
            if ((date1 - date2) > 0) {
                this.modalContent = "Date of transplant surgery can't be more than today";
                this.isModalOpen = true;
                this.isModalContent = true;
                return;
            }
        }

    }
    closeModelpopup() {
        this.isModalOpen = false;
        if (this.selectedValue < 18) {
            this.template.querySelector('lightning-input').value = undefined;
            this.selectedValue = undefined;
        }
        else if (this.selectedValue == 'Outside of the U.S.') {
            this.selectedValue = undefined;
        }

        if (this.template.querySelectorAll("[data-name='comboInput']").length > 0) {
            this.yearData = '';
            this.dayData = '';
            this.monthData = '';
        }
    }

    isrendered = false;
    renderedCallback() {
        console.log("this.isrendered", this.isrendered, "qno", this.question.Order__c);
        if (!this.isrendered) {
            this.isrendered = true;
            if ((this.question.Order__c == 18 && this.user == "Patient") || (this.question.Order__c == 22 && this.user == "Caretaker")){
                this.textque = "*Pre-emptive treatment is when a patient’s CMV levels are monitored for early replication (CMV virus increases), and a treatment (antiviral drug) is given only when CMV replication is detected to prevent disease progression.";
                this.textque +='<br/><br/>'
                this.textque += "**Prophylaxis is using a medication or a treatment (antiviral drug) to prevent CMV infection from occurring." ;
                let te = this.template.querySelector(".textextra");
                if(te)
                    te.innerHTML = this.textque;
            }
            if (this.answer != undefined) {

                if (["Text", "Text Area", "Combo Box", "Radio Button"].includes(this.question.Display_Type__c)) {
                    this.selectedValue = this.answer.Text_Response_Value__c;
                }
                else if ("Date" == this.question.Display_Type__c) {
                    this.selectedValue = this.answer.Text_Response_Value__c;
                }
                else if (["Number", "Radio Text", "TextNumber"].includes(this.question.Display_Type__c)) {
                    this.selectedValue = Number(this.answer.Text_Response_Value__c);
                }
                else if ("RadioButtonTextBox" == this.question.Display_Type__c && this.answer.Text_Response_Value__c) {
                    this.radioText.radio = JSON.parse(this.answer.Text_Response_Value__c).radio
                    this.radioText.text = JSON.parse(this.answer.Text_Response_Value__c).text;
                    this.selectedValue = this.answer.Text_Response_Value__c;
                    if (this.radioText.radio == 'Yes' && this.user == "Patient") {
                        this.otherLabel = this?.otherOption?.forlabel;
                        this.otherResponseValue = this.answer?.Other_Response_Value__c;
                        this.isother = true;
                    }
                }
                else if (this.question.Display_Type__c === 'customTable' && this.answer.Text_Response_Value__c) {
                    this.selectedValue = this.answer.Text_Response_Value__c;
                    let data = JSON.parse(this.selectedValue);
                    this.dataMap = new Map(Object.entries(data));
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (data[each.dataset.title]) {
                            let selectedValuesArr = data[each.dataset.title];
                            selectedValuesArr.forEach(item => {
                                if (item == each.label && each.type == "checkbox") {
                                    each.checked = true;
                                }
                                else {
                                    each.value = selectedValuesArr[0];
                                }
                            })
                        }
                    })
                }
                else if (this.question.Display_Type__c === 'singleQuestion' && this.answer.Text_Response_Value__c) {
                    this.singleQuestionsData.maindata = JSON.parse(this.answer.Text_Response_Value__c).maindata;
                    this.nestedValue3 = JSON.parse(this.answer.Text_Response_Value__c).maindata == 'Yes' ? true : false;
                    this.singleQuestionsData.inneroptions = JSON.parse(this.answer.Text_Response_Value__c).inneroptions;
                    this.selectedValue = JSON.stringify(this.singleQuestionsData);
                    this.nestedOptions = [{ "label": "Once ", "value": "Once" }, { "label": "Twice", "value": "Twice" }, { "label": "Three times ", "value": "Three times" }, { "label": "More than 3 times", "value": "More than 3 times" }];
                }
                else if (this.question.Display_Type__c == "Multiple Questions" && this.answer.Text_Response_Value__c) {
                    this.multiQuestionsData.radio1 = JSON.parse(this.answer.Text_Response_Value__c).radio1
                    this.multiNestedOptionsTypeDif = this.multiQuestionsData.radio1 == 'Yes' ? true : false;
                    this.isMultipleQuestionsPart2 = this.multiQuestionsData.radio1 == 'Yes' ? true : false;
                    this.multiQuestionsData.radio2 = JSON.parse(this.answer.Text_Response_Value__c).radio2;
                    this.q16p2value = JSON.parse(this.answer.Text_Response_Value__c).checkboxes;
                    if (JSON.parse(this.answer.Text_Response_Value__c).checkboxes.includes(",")) {
                        JSON.parse(this.answer.Text_Response_Value__c).checkboxes.split(",").forEach(each => {
                            this.template.querySelectorAll('[data-q="16"]').forEach(item => {
                                if (each == item.name) {
                                    item.checked = true;
                                }
                            })
                        })
                    }
                    this.selectedValue = this.answer.Text_Response_Value__c;
                    if (JSON.parse(this.answer.Text_Response_Value__c).checkboxes.includes('Other')) {
                        this.otherLabel = this?.otherOption?.forlabel;
                        this.otherResponseValue = this.answer?.Other_Response_Value__c;
                        this.isother = true;
                    }
                }
                else if (this.question.Display_Type__c == "Checkbox Group") {
                    console.log('incheckbox', this.answer.Text_Response_Value__c);
                    this.selectedValue = this.answer.Text_Response_Value__c;
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.type == "checkbox" && this.selectedValue && this.selectedValue.includes(each.name)) {
                            each.checked = true;
                        }
                    })
                    if (this.answer.Text_Response_Value__c && (this.answer.Text_Response_Value__c.includes('Other') || this.answer.Text_Response_Value__c.includes('My care team') || this.answer.Text_Response_Value__c.includes('Side effects') || this.answer.Text_Response_Value__c.includes('Transplant patient apps and online communities') || this.answer.Text_Response_Value__c.includes('Care team') || this.answer.Text_Response_Value__c.includes('Cancer'))) {
                        this.otherLabel = this?.otherOption?.forlabel;
                        this.otherResponseValue = this.answer?.Other_Response_Value__c;
                        this.isother = true;
                    }
                }
                else if (this.question.Display_Type__c == "Table" && this.answer.Text_Response_Value__c) {
                    let ans = JSON.parse(this.answer.Text_Response_Value__c);
                    let checkedList = []
                    ans.options.forEach(item => {
                        item.option.forEach(innerItem => {
                            if (innerItem.value == true) {
                                checkedList.push(innerItem.rowcol.row + '-' + innerItem.rowcol.col)
                            }
                        })
                    })
                    console.log('checkedList', checkedList);
                    checkedList.forEach(each => {
                        {
                            this.template.querySelectorAll('[data-col]').forEach(ele => {
                                console.log(each.split("-")[0], ele.dataset.row, each.split("-")[1], ele.dataset.col)
                                if (ele.dataset.row && ele.dataset.col && each.split("-")[0] == ele.dataset.row && each.split("-")[1] == ele.dataset.col) {
                                    ele.checked = true;
                                }
                            })
                        }
                    })
                    this.template.querySelectorAll('[data-col]').forEach(ele => {
                        if (ele.dataset.title && ele.dataset.title.includes('Other') && ele.checked) {
                            this.otherLabel = this?.otherOption?.forlabel;
                            this.otherResponseValue = this.answer?.Other_Response_Value__c;
                            this.isother = true;
                        }
                    })
                    this.selectedValue = this.answer.Text_Response_Value__c;
                }
                if (this.answer.NestedOptionsData__c) {
                    let nestedData = JSON.parse(this.answer.NestedOptionsData__c);
                    if (nestedData.isnestedoptions) {
                        this.isNestedOptions = nestedData.isnestedoptions;
                        this.nestedOptionType.radio = nestedData.isradio;
                        this.nestedOptionType.combobox = nestedData.iscombobox;
                        this.nestedOptionType.text = nestedData.istext;
                        this.nestedOptionType.checkbox = nestedData.ischeckbox;
                        this.nestedOptionsData.isradio = nestedData.isradio;
                        this.nestedOptionsData.ischeckbox = nestedData.ischeckbox;
                        this.nestedOptionsData.istext = nestedData.istext;
                        this.nestedOptionsData.iscombobox = nestedData.iscombobox;
                        this.nestedOptionsData.isnestedoptions = true;
                        if (this.nestedOptionType.radio && this.question.transplantNestedOptions__c) {
                            JSON.parse(this.question.transplantNestedOptions__c).forEach(each => {
                                if (nestedData.mainvalue == each.value) {
                                    this.nestedOptions = each.nestedoptions;
                                    this.nestedOptionsData.mainvalue = nestedData.mainvalue;
                                    if (this.nestedOptionsData.isradio) {
                                        this.nestedRadioValue = nestedData.value;
                                        this.nestedOptionsData.value = nestedData.value;
                                    }
                                    else if (this.nestedOptionsData.istext) {
                                        this.nestedTextValue = nestedData.value;
                                        this.nestedOptionsData.value = nestedData.value;
                                    }
                                }
                            });

                        }
                        else if (this.nestedOptionType.text) {
                            this.nestedTextValue = nestedData.value;
                            this.nestedOptionsData.mainvalue = nestedData.mainvalue;
                        }
                        else if (this.nestedOptionType.combobox && this.question.transplantNestedOptions__c) {
                            JSON.parse(this.question.transplantNestedOptions__c).forEach(each => {
                                if (nestedData.mainvalue == each.value) {
                                    this.nestedOptions = each.nestedoptions;
                                    this.nestedComboAnswer = nestedData.value;
                                    this.nestedOptionsData.mainvalue = nestedData.mainvalue;
                                }
                            });
                        }
                        else if (this.nestedOptionType.checkbox && this.question.transplantNestedOptions__c && this.nestedOptionType) {
                            var nestedoptionsflag = false;
                            JSON.parse(this.question.transplantNestedOptions__c).forEach(each => {
                                nestedoptionsflag = true;
                                this.nestedOptions = each.nestedoptions;
                            })
                            this.nestedOptionsData.value = nestedData.value;
                            if (!nestedoptionsflag) {
                                this.isNestedOptions = false;
                            }
                         /*    if (this.nestedOptionsData.value.includes("I receive a different type of assistance")) {
                                this.otherMap =  new Map(Object.entries(JSON.parse(this.answer.Other_Response_Value__c)));
                                this.otherMap.forEach((value,key)=>{
                                    this.otherBoxes.push({ 'label': key, 'value': value, 'otherLabel':key });
                                })
                                this.otherResponseValue = (this.answer && this.answer.Other_Response_Value__c) ? this.answer.Other_Response_Value__c : undefined
                            } */
                        }
                        this.nestedCheckboxValues = nestedData.value;

                    }
                }
                /* if (this.answer.Text_Response_Value__c && ['Employed full time','Employed part-time','Pre-emptive (Please specify how long) as well as prophylaxis (Please specify how long)', "Other", 'Prophylaxis only (Specify how long)','Pre-emptive (Specify how long) as well as prophylaxis (Specify how long)','Pre-emptive only (Specify how long)','Cancer'].includes(this.answer.Text_Response_Value__c)) {
                    this.otherLabel = this?.otherOption?.forlabel;
                    this.otherResponseValue = this.answer?.Other_Response_Value__c;
                    this.isother = true;
                }
                if(this.answer.Text_Response_Value__c && this.question.Order__c==29 && this.user == 'Patient' ){
                    let ans = JSON.parse(this.answer.Text_Response_Value__c)
                    if(ans.checkboxes!="" && (ans.checkboxes.includes("Side effects") || ans.checkboxes.includes("Access to the treatment") || ans.checkboxes.includes("Other"))){
                    this.otherLabel = this?.otherOption?.forlabel;
                    this.otherResponseValue = this.answer?.Other_Response_Value__c;
                    this.isother = true;  
                    }
                }
                if(this.answer.Text_Response_Value__c && this.question.Order__c==9 && this.user == 'Patient'&& this.answer.Text_Response_Value__c=='No' ){
                    this.otherLabel = 'Do you have any concerns about finding new employment?';
                    this.otherResponseValue = this.answer?.Other_Response_Value__c;
                    this.isother = true;  
                }*/
                if (this.question.Order__c == 12 && this.user == "Patient" && this.answer && this.answer.q1ans) {
                    if (this.answer.q1ans == '<6 months' || this.answer.q1ans == '6mos-1 year') {
                        this.template.querySelectorAll('lightning-input').forEach(each => {
                            if (each.dataset.row == "3") {
                                each.checked = false;
                                each.disabled = true;
                            }
                        })
                    }
                    else {
                        this.template.querySelectorAll('lightning-input').forEach(each => {
                            if (each.dataset.row == "3")
                                each.disabled = false;
                        })
                    }
                }
                if (this.answer && this.answer.Other_Response_Value__c) {
                    this.otherMap = new Map(Object.entries(JSON.parse(this.answer.Other_Response_Value__c)));
/*                     this.otherMap.forEach((key,value)=>{
                        this.otherBoxes.push({ 'label':value, 'value': key, 'otherLabel': key });
                    }) */
                    
                    this.otherMap.forEach((key, value) => {
                        var label = ''
                        //console.log('optin values',JSON.stringify(this.optionValues));
                        if (this.optionValues.option2) {
                            this.optionValues.option2.forEach(each => {
                                if (each.value == value) {
                                    label = each.otherLabel
                                }
                            });

                        }
                        else if(this.isNestedOptions){
                            this.nestedOptions.forEach(each => {
                                if (each.value == value) {
                                    console.log("each.value========>",each);
                                    label = each.otherLabel
                                }
                            });
                        }
                        else {
                            if (Array.isArray(this.optionValues)) {
                                this.optionValues.forEach(each => { if (each.value == value) { label = each.otherLabel } })
                            }
                        }
                        // this.optionValues.option2 ? this.optionValues.option2.forEach(each=>{if(each.value == value){label=each.otherLabel}})
                        // :this.optionValues.forEach(each=>{if(each.value == value){label=each.otherLabel}})
                        if (this.question.Display_Type__c == "Table") {
                            this.otherBoxes.push({ "label": value, "value": key, "otherLabel": value });
                        }
                        // else if(this.question.Order__c == 6  && this.user == "Patient" ){
                        //     this.otherBoxes.push({ "label": "Specify types of assistance", "value": key, "otherLabel": label });
                        // }
                        else {
                            this.otherBoxes.push({ "label": value, "value": key, "otherLabel": label });
                        }

                        console.log('key', key, '+++', value);

                    })
                    this.otherBoxes.forEach(each => {
                        this.otherMap.set(each.label, each.value);
                    })
                    this.otherResponseValue = JSON.stringify(Object.fromEntries(this.otherMap));
                    console.log("this.otherBoxes", this.otherBoxes);
                }
            }
        }
    }

    multiQuestionsHandler(event) {
        if (event.target.value == "Yes") {
            this.isMultipleQuestionsPart2 = true;
            this.multiNestedOptionsTypeDif = true;
        }
        else {
            this.isMultipleQuestionsPart2 = false;
            this.multiNestedOptionsTypeDif = false;
            this.q16p2value = [];
            this.otherBoxes = [];
        }
        this.multiQuestionsData.radio1 = event.target.value;
        let val = [];
        this.template.querySelectorAll('[data-q="16"]').forEach(each => {
            if (each.checked) {
                val.push(each.name)
            }
        })
        let valArrray = this.q16p2value;
        if (valArrray.includes('Other') || valArrray.includes('Side effects') || valArrray.includes('Access to the treatment')) {
            this.isother = true;
            this.otherLabel = this.otherOption.forlabel;
        }
        else {
            this.isother = false;
        }
        this.multiQuestionsData.checkboxes = this.q16p2value;
        this.selectedValue = JSON.stringify(this.multiQuestionsData);
        if (event.target.value == "No") {
            this.isother = false;
        }
    }

    multiQuestionsInnerHandler(event) {
        let val = [];
        this.template.querySelectorAll('[data-q="16"]').forEach(each => {
            if (each.checked) {
                val.push(each.name)
            }
        })
        let valArrray = this.q16p2value;
        if (valArrray.includes('Other') || valArrray.includes('Side effects') || valArrray.includes('Access to the treatment')) {
            this.isother = true;
            this.otherLabel = this.otherOption.forlabel;
        }
        else {
            this.isother = false;
        }
        this.multiQuestionsData.checkboxes = this.q16p2value;
        this.multiQuestionsData.radio2 = event.target.value;
        this.selectedValue = JSON.stringify(this.multiQuestionsData);

    }



    testRadioHandler(event) {
        this.radioText.radio = event.target.value;
        this.selectedValue = JSON.stringify(this.radioText);
    }


    //newly added
    @api
    validations(qno) {
        console.log('validations--->');
        console.log('question number', this.question.Order__c);
        let returnVal = true;
        if (this.question.Display_Type__c === 'Radio Button') {
            let radioEle = this.template.querySelector("[data-name='radioInput']");
            returnVal = radioEle.reportValidity();
            console.log("validation on radio button", returnVal);
            /*             let validationstr11 = [];
                        this.template.querySelectorAll("[data-name='checkboxInput']").forEach(each => {
                            if (each.value) {
                                validationstr11.push(each.name);
                            }
                        }); */

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
        else if (this.question.Display_Type__c === 'Table') {

            let dataMap = new Map();
            this.template.querySelectorAll('[data-col]').forEach(each => {
                if (dataMap.has(each.dataset.row)) {
                    let arr = dataMap.get(each.dataset.row);
                    if (!each.disabled) {
                        arr.push(each.checked);
                    }
                    else {
                        arr.push(true);
                    }
                    dataMap.set(each.dataset.row, arr);
                }
                else {
                    let arr = new Array();
                    if (!each.disabled) {
                        arr.push(each.checked);
                    }
                    else {
                        arr.push(true);
                    }
                    dataMap.set(each.dataset.row, arr);
                }//{'1':[]}
            })
            console.log("dataMap", dataMap);
            let valid = true;
            for (let i = 0; i < dataMap.size; i++) {
                let flag = false;
                let values = dataMap.get(i + "");
                if (!values.includes(true)) {
                    valid = false
                    this.tableValidation = true;
                    break;
                }
            }
            if (!valid) {
                return valid;
            }
        }
        else if (this.question.Display_Type__c === 'Checkbox Group') {
            let flag = false
            this.template.querySelectorAll('[data-name="checkboxInput"]').forEach(each => {
                if (each.checked) {
                    flag = true;
                }
            });
            this.isCheckboxValidnFailed = (flag) ? false : true;
            let unansweredQuestions = this.otherBoxes.filter(c=> c.value=='' );
            console.log("unansweredQuestions",JSON.stringify(unansweredQuestions));

           //let flg = this.template.querySelector("[data-key='"+e.label+"']")[0].reportValidity();
            unansweredQuestions.forEach(each=>{
                console.log("each.label",each.label)
                console.log("[data-key='"+each.label+"']");
               let flg = this.template.querySelector("[data-key='"+each.label+"']").reportValidity();
               console.log("Other Box Validation",flg);
            })
            return  (flag && unansweredQuestions.length==0)?true:false;
            //   if(!this.isother){return flag;}
            //       if(this.template.querySelector("[data-name='otherInput']")){
            //       let textEle= this.template.querySelector("[data-name='otherInput']").reportValidity();
            //       if(this.isother){
            //           return (flag && textEle);
            //       }
            //   }
        }
        else if (this.question.Display_Type__c === 'singleQuestion') {
            let radioEle = this.template.querySelector("[data-name='radioInput']");
            returnVal = radioEle.reportValidity();
        }
        else if (this.question.Display_Type__c === 'Multiple Questions') {
            let radioEle = this.template.querySelector("[data-name='radioInput']");
            returnVal = radioEle.reportValidity();

        }
        else if (this.question.Display_Type__c === 'customType') {
            console.log(this.template.querySelectorAll("lightning-combobox").length);
            /*   let count = 0;
              this.template.querySelectorAll("lightning-combobox").forEach(each => {
                  each.reportValidity();
                  if (each.reportValidity()) { count++; }
              })
              returnVal = (count == 3) ? true : false */
            returnVal = this.template.querySelectorAll("lightning-combobox")[2].reportValidity();
        }
        // if (this.isother == true) {
        //     let otherEle = this.template.querySelector("[data-name='otherInput']");
        //     returnVal = otherEle.reportValidity();
        // }
        if (!!this.otherBoxes && this.otherBoxes.length > 0) {
            console.log('inside other boxes validation', this.template.querySelectorAll("[data-name='otherInput']").length);
            this.template.querySelectorAll("[data-name='otherInput']").forEach(each => {
                let isValid = each.reportValidity();
                console.log('validity', isValid);

                if (!isValid) {
                    returnVal = false;
                    console.log('inside validation false', returnVal);
                }
            });

            if (!returnVal) {
                return returnVal;
            }
        }

        let nestedValiation = true;
        let val = false;
        if (this.isNestedOptions) {
            if (this.nestedOptionType.radio) {
                let radioEleVal = this.template.querySelector("[data-name='nestedRadio']").value;
                if (radioEleVal == '' || radioEleVal == null) val = true;
                //returnVal = radioEle.reportValidity();
                //console.log("validation on radio button", returnVal);
                /* this.template.querySelectorAll('[data-name="nestedradioInput"]').forEach(each => {
                     if (each.value!="") {
                         val = false;
                     }
                 })*/
                if (!val) {
                    nestedValiation = true;
                    this.isCheckboxValidnFailed = false;
                } else if (val) {
                    nestedValiation = false;
                    this.isCheckboxValidnFailed = true;
                }

            }
            else if (this.nestedOptionType.combobox) {
                if (this.nestedComboAnswer) {
                    this.nesteComboboxValidation = false;
                    return true;
                }
                else {
                    this.nesteComboboxValidation = true;
                    return false;
                }
            }
            else if (this.nestedOptionType.checkbox) {
                //let returnVal;
                if (this.nestedCheckboxValues.length == 0) {
                    this.nesteCheckboxValidation = true;
                    returnVal = false;
                }
                else if (this.nestedCheckboxValues.length > 0 && (!this.nestedCheckboxValues.includes('Other'))) {
                    this.nesteCheckboxValidation = false;
                    returnVal = true;
                    console.log('validation of nesteCheckboxValidation');
                }
                // else if(this.template.querySelector("[data-name='otherInput']")){
                //         let textEle= this.template.querySelector("[data-name='otherInput']").reportValidity();
                //         returnVal =  this.isother?textEle:true;
                //     }
                console.log('validation new', returnVal, this.question.Order__c);
                return returnVal;

            }
        }
        if (this.isNestedOptions) {
            console.log("validation ", returnVal && nestedValiation, "for", this.question.Order__c);
        }
        else {
            console.log("validation ", returnVal, "for", this.question.Order__c);
        }
        return (this.isNestedOptions) ? (returnVal && nestedValiation) : returnVal;
        //return true;
    }
   /*  disconnectedCallback() {
        alert("disconnected");
    }
 */
}