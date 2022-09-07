import { LightningElement, api, wire, track } from 'lwc';
//import getSurveyQuestions from '@salesforce/apex/AlphaSurveyController.getSurveyQuestions';
import catlogo from '@salesforce/resourceUrl/CATLOGO';
import eq5d5llogo from '@salesforce/resourceUrl/EQ5D5LLogo';
import { NavigationMixin } from 'lightning/navigation';
import treatment1 from '@salesforce/label/c.Treatment1';
import treatment2 from '@salesforce/label/c.Treatment2';
import treatment3 from '@salesforce/label/c.Treatment3';
import treatment4 from '@salesforce/label/c.Treatment4';
import treatment5 from '@salesforce/label/c.Treatment5';
import treatment6 from '@salesforce/label/c.Treatment6';
import treatment7 from '@salesforce/label/c.Treatment7';
import treatment8 from '@salesforce/label/c.Treatment8';
export default class AlphaSurveyMultiQuestions extends NavigationMixin(LightningElement) {
    multiselectValues;
    val;
    popUpScore;
    catLogoStatic = catlogo;
    EQ5D5LLogoStatic = eq5d5llogo;
    isMultiNestedInput = false;
    catTotalScore = false;
    confirmationFalg = true;
    isTableMandatory = false;
    @track reportClicked = false;
    @track values = [];
    @api question;
    @api checkboxvalue;
    backCheckForScore = false;
    @api answer;
    @api isFirstTime;
    surveyAnswer;
    @api skippedquestion;
    @api hiddenQuestions;
    isIntroduction = true;
    q7Style = "font-weight: bold; padding-bottom: 6px; margin-bottom: -15px;"
    multiInput1;
    multiInput2;
    isother = false;
    multiInputValue;
    otherLabel = '';
    otherOption;
    selectedValue;
    selectedValue1;
    selectedValue2;
    otherValue;
    isCheckboxValidnFailed = false;
    loopvariable = [0, 1, 2, 3, 4, 5];
    score = 0;
    scoreDiv1;
    scoreDiv2;
    Treatments;
    isTableValidation = false;
    beforeDiagnosis;
    afterDiagnosis;
    currentTreatment;
    index = 0;
    sliderValue =0;
    eqvalidation = false
    isNavigateEnd = false;
    reportScoreError  = false;
    edq5ValueList = [0,0,0,0,0];
    label = {
        treatment1, treatment2, treatment3, treatment4, treatment5, treatment6, treatment7, treatment8
    };
    value = '';
    navigateToLastEnd = { "type": "", "value": false }
    isModalOpen;
    modalContent = "";
    errorScoreFlag = false;
    ignoreSkip = false;
    questionOptions = [];
    optionsQuestion;
    text1;
    text2;
    text3;
    scorePartialOptionsFlag = false;
    renderedFlag = 1;
    isSliderMoved = false;
    sliderError = false
    @api otherexistinganswer;

    @api
    refreshNextQuestion() {
        this.selectedValue = '';
        this.isother = false;
        this.otherValue = '';
        this.isCheckboxValidnFailed = false;
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
        textque;
        console.log("this.surveyanswer " + this.surveyanswer);
    }

    @api
    selectedAnswer() {
        return this.selectedValue;
    }

    @api 
    selectedOtherAnswer(){
        return this.otherValue;
    }
    @api
    clearCache() {
        this.renderedFlag = 1;
    }

    @api
    otherAnswer() {
        return this.otherValue;
    }

    @api
    clearAnswer() {
        this.selectedValue = undefined;
        this.otherOption = undefined;
        this.answerOther = undefined;
        this.surveyanswer = undefined;
        this.otherValue = undefined;
        this.isother = false;

    }

    connectedCallback() {
        console.log('connected call back' + this.surveyanswer);
        this.surveyanswer = null;
        if (this.question.Order__c == 46) {
            this.textque = '* A primary caregiver is a person who has the duty of caring for a loved one who is unable to care for himself or herself. A primary caregiver, may be caring for an elder, children, a spouse who has a terminal condition, or any other family member or friend who needs help with daily activities.';
        }
    }

    get iseq5d() {
        return this.question.Order__c == 48 ? true : false
    }

    get is17() {
        return this.question.Order__c == 17 ? true : false
    }

    get dateMax() {
        let currentDate = new Date();
        return currentDate = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDay();
    }

    get questionText() {
        // this.selectedValue='';
        this.isIntroduction = (this.question.Question_Text__c == 'Introduction') ? false : true
        return this.question.Question_Text__c;
    }

    get iscat() {
        if (this.question.Question_Text__c == 'How is your COPD? Take the COPD Assessment Test') {
            return true;
        } else {
            return false;
        }

    }

    get isPro() {
        return this.question.isDisplayqno__c ? true : false;
    }
    get labelText() {
        console.log("this id may be", this.question.Label__c);
        return this.question.Label__c;
    }

    get nextQuestion() {
        return this.question.Next_Question__c;
    }
    get optionValues() {
        //console.log('option values' + this.question.Options__c);
        let options = (this.question.Options__c) ? JSON.parse(this.question.Options__c) : undefined;
        this.otherOption = (this.question.Option_Other__c) ? JSON.parse(this.question.Option_Other__c) : undefined;
        return options;
    }
    get isRadio() {
        return (this.question.Display_Type__c === 'Radio Button') ? true : false;

    }
    get istextnumber() {
        return (this.question.Display_Type__c === 'isInputNumberDate') ? true : false;
    }
    get isDate() {
        return (this.question.Display_Type__c === 'Date') ? true : false;
    }
    get isCombo() {
        return (this.question.Display_Type__c === 'Combo Box') ? true : false;
    }
    get isCheckgroup() {
        //console.log('ischeckbox group' + (this.question.Display_Type__c === 'Checkbox Group') ? true : false);
        return (this.question.Display_Type__c === 'Checkbox Group') ? true : false;
    }

    get isTextNumber() {
        //console.log('ischeckbox group' + (this.question.Display_Type__c === 'Checkbox Group') ? true : false);
        return (this.question.Display_Type__c === 'TextNumber') ? true : false;
    }
    //New changes
    get isCheckpicklistgroup() {
        return (this.question.Display_Type__c === 'Multi Checkbox Picklist') ? true : false;
    }
    get isReportScore() {
        return (this.question.Display_Type__c === 'Report Score') ? true : false;

    }
    get isTable() {
        return (this.question.Display_Type__c === 'Table') ? true : false;

    }
    get isRadioText() {
        return (this.question.Display_Type__c === 'Radio Text') ? true : false;

    }

    get isMultiInput() {
        return (this.question.Display_Type__c === 'Multi Input') ? true : false;

    }

    get isMultiInputData() {
        return (this.question.Display_Type__c === 'MultiInputData') ? true : false;

    }

    multiInputHandler(event) {
        this.multiInputValue = event.target.value;
        if ((this.question.Order__c == "16" || this.question.Order__c == "17") && event.target.value == "Yes") {
            this.isMultiNestedInput = true;
        }
        else {
            this.isMultiNestedInput = false;
        }
        this.selectedValue= (event.target.value.includes("No"))?event.target.value:undefined;

    }
    multipleTextHandler(event) {
        if (event.target.name == "input1") {
            this.text1 = event.target.value;
        }
        else if (event.target.name == "input2") {
            this.text2 = event.target.value;
        }
        else {
            this.text3 = event.target.value;
        }
        this.selectedValue = this.text1 + "-" + this.text2 + "-" + this.text3;
    }
    oncheck(event) {
        // this.score = 0;
        this.reportScoreError = false;
        console.log('col: ' + event.currentTarget.dataset.value + ' row: ' + event.currentTarget.dataset.index);
        let col = event.currentTarget.dataset.value;
        let row = event.currentTarget.dataset.index;
        this.template.querySelectorAll(`[data-value]`).forEach(each => {
            if (each.dataset.index == row) {
                if (each.dataset.value == col && each.className != "selectedbox" ) {
                    each.className = "selectedbox";
                  
                }
                else {
                    each.className = "box";
                }
            }
        });

       /*  this.template.querySelectorAll(`[data-temp]`).forEach(each => {
            //console.log(each.dataset.temp+' '+event.currentTarget.dataset.index+' '+event.currentTarget.dataset.innerIndex);
            if (each.dataset.temp == event.currentTarget.dataset.index) {
                if (each.dataset.flag == "true") {
                    each.className = "box1";
                    this.score = this.score - Number(each.innerHTML);
                    each.innerHTML = event.currentTarget.dataset.value
                    this.score = Number(this.score) + Number(event.currentTarget.dataset.value);
                    this.values[row] = event.currentTarget.dataset.value;
                }
                else {
                    this.values = [...this.values, event.currentTarget.dataset.value];
                    each.innerHTML = event.currentTarget.dataset.value;
                    each.dataset.flag = "true";
                    this.score = Number(this.score) + Number(each.innerHTML);
                }
            }
        }); */
        let selectedMap = new Map();
        this.template.querySelectorAll(`[data-index]`).forEach(each => {
            (each.className =='selectedbox') && selectedMap.set(each.dataset.index,Number(each.dataset.value));
        })
        console.log("selectedMap ",selectedMap);
        let val=0;
          for (let [key, value] of selectedMap) {
            console.log("value in for==>",value)
            val = val+value;
            }
        console.log("val====>",val);
        this.scoreDiv1 = val;
       
        /* console.log("values " + this.values + '-' + this.score);
        this.selectedValue = this.values + '-' + this.score;
        let scoreString = (this.score + '').length == 1 ? ("0" + this.score) : (this.score + "");
        let scoreArray = scoreString.split("");
        if (scoreArray[0] !== undefined)
            this.scoreDiv1 = scoreArray[0] + scoreArray[1];
        else
            this.scoreDiv1 = "0";
        if (scoreArray[1] !== undefined)
            this.scoreDiv2 = scoreArray[1];
        else
            this.scoreDiv2 = "0"; */
    }
    closeModel() {
        this.reportClicked = false;

    }
    scoreClick() {
        // this.reportClicked = this.scoreDiv1;
        this.catTotalScore = true;
        this.reportClicked = true;
        let divMap = new Map();
        this.template.querySelectorAll("[data-value]").forEach(each => {
            if (divMap.has(each.dataset.index)) {
                let rowList = divMap.get(each.dataset.index);
                rowList.push(each.className);
                divMap.set(each.dataset.index, rowList);
            }
            else {
                let rowList = new Array();
                rowList.push(each.className);
                divMap.set(each.dataset.index, rowList);
            }
        })
        // let allselected=true;
        divMap.forEach((value, key) => {
            let rowFlag = false;
            value.forEach(item => {
                if (item == "selectedbox") {
                    rowFlag = true;
                    this.reportScoreError = false;
                    this.dispatchEvent(new CustomEvent('score', {
                        detail: true
                    }));
                }
            })
            if (!rowFlag) {
                //allselected=false;
                this.scorePartialOptionsFlag = true;
                this.reportScoreError = true;
            }

        })
        // if(this.scoreDiv1==0){
        //     this.reportScoreError=false;
        //     console.log('oncheck', this.reportScoreError,this.scoreDiv1);
        // }else{
        //     this.reportScoreError=true;
        // }
        /*  for(let rowindex in divMap){
              var selectedbox=e.get(rowindex).filter(function(a){return a=="selectedbox"});
              if(selectedbox.length==0){
                  allselected=false;
              this.scorePartialOptionsFlag = true;
              break;
              }
              }
          if (allselected) {
          this.scorePartialOptionsFlag = false;
          this.confirmationFalg = true;
         
         }*/

        //scorePartialOptionsFlag will be true if partial answers or no answer is selected and false if all answers are selected

        /*   this.dispatchEvent(new CustomEvent('score', {
              detail: false
          })); */
    }
    confirmationPopup() {
        this.confirmationFalg = false;
        if (this.scoreDiv1 != 0) {
            this.dispatchEvent(new CustomEvent('score', {
                detail: false
            }));
            
        }
        // else if(this.scoreDiv1 == 0){
        //     this.reportScoreError = false;
        // }else if(this.scoreDiv1 == undefined){
        //     this.reportScoreError = true;
        // }

    }
    ehrRedirection() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'EHR_Instructions__c'
            },
        });
    }
    popupCloseHandler(event) {
        this.reportClicked = false;
        this.scorePartialOptionsFlag = false;
        this.confirmationFalg = true;
        if (event.target.dataset.close != 'yes')
            this.catTotalScore = false;
    }
    scoreClickPopup() {
        this.popUpScore = this.scoreDiv1;
    }

    popupConfirmationHandler() {
        this.scorePartialOptionsFlag = false;
        this.confirmationFalg = true;
        console.log("this.scoreDiv1", this.scoreDiv1)
        if (!this.scoreDiv1) { this.scoreDiv1 = 0; }
    }



    //New changes//
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
    get isMultipleText() {
        return (this.question.Display_Type__c === 'Multiple Text') ? true : false;
    }
    /** */
    handleClick(event) {
        this.isTableMandatory = true;
        this.isTableValidation = false;
        //used to uncheck all the checkboxes when none of the above is checked==>start
        if (event.target.dataset.otheroption === "none") {
            this.template.querySelectorAll("[data-row]").forEach(each => {
                //console.log("each.checked",each.checked,"each.dataset.label",each.dataset.label);
                each.checked = false;
            })
        }
        else {
            for (let i = 0; i < this.template.querySelectorAll(`[data-otheroption]`).length; i++) {
                //console.log("each.checked",each.checked,"each.dataset.label",each.dataset.label);
                this.template.querySelectorAll(`[data-otheroption]`)[i].checked = false;
                break;
            }
        }
        //==>end
        let jsonArray = [];
        this.template.querySelectorAll(`[data-trrow]`).forEach(each => {
            jsonArray.push({
                "treatments": "",
                "beforetreatment": false,
                "aftertreatment": false,
                "currenttreatment": false
            })
        })
        //let flag=0;
        this.template.querySelectorAll(`[data-row]`).forEach(each => {
            // if(event.currentTarget.dataset.row == each.dataset.row && each.checked ){
            //     flag++;
            // }
            /*If we want to select only one checkbox among the grp we need to use the below code*/
            // if(flag>=2){
            //    // console.log("vinay3:"+flag);

            // event.preventDefault(); 
            // return false;
            // }
            //The end

            if (each.dataset.title == "Treatments") {
                jsonArray[each.dataset.row].treatments = each.innerHTML;
            }
            else
                if (each.dataset.title == "beforetreatment") {
                    jsonArray[each.dataset.row].beforetreatment = each.checked;
                }
                else if (each.dataset.title == "aftertreatment") {
                    jsonArray[each.dataset.row].aftertreatment = each.checked;
                }
                else if (each.dataset.title == "currenttreatment") {
                    jsonArray[each.dataset.row].currenttreatment = each.checked;
                }
        });
        console.log("jsonArray " + JSON.stringify(jsonArray));
        this.selectedValue = JSON.stringify(jsonArray);
        if (!jsonArray[3].currenttreatment) {
            this.navigateToLastEnd.type = "table";
            this.navigateToLastEnd.type = true;
        }
        console.log("event.target.valu" + event.currentTarget.dataset.label);
        let label = event.currentTarget.dataset.label
        console.log("this.isother " + this.isother);
        let jsonObj = jsonArray[jsonArray.length - 1];
        let jsonObj2 = jsonArray[4];
        console.log("jsonObj " + JSON.stringify(jsonObj));
        if ((jsonObj.treatments == label &&
            (jsonObj.beforetreatment == true ||
             jsonObj.aftertreatment == true || 
             jsonObj.currenttreatment == true)) || 
             (jsonObj2.treatments == label &&
                (jsonObj2.beforetreatment == true ||
                 jsonObj2.aftertreatment == true || 
                 jsonObj2.currenttreatment == true))) {
            this.otherLabel = this?.otherOption?.forlabel;
            this.isother = true;
        }
        else if ((jsonObj.beforetreatment == false && jsonObj.aftertreatment == false && jsonObj.currenttreatment == false)
                && (jsonObj2.beforetreatment == false && jsonObj2.aftertreatment == false && jsonObj2.currenttreatment == false)) {
            this.isother = false;
        }
        else {
            this.dispatchEvent(new CustomEvent('validation', {
                detail: false
            }));
        }
        
    }
    @api
    popupvalidation(event) {
        this.isModalOpen = true;
    }

    multiInputHandleChange1(event) {
        this.multiInput1 = event.target.value;
        this.selectedValue = this.multiInputValue + ":" + this.multiInput1 + "-" + this.multiInput2;
    }

    multiInputHandleChange2(event) {
        this.multiInput2 = event.target.value;
        this.selectedValue = this.multiInputValue + ":" + this.multiInput1 + "-" + this.multiInput2;
    }

    onChangeSlider(event){
        this.sliderValue = event.target.value;
        this.isSliderMoved = true;
        this.edq5ValueList.forEach((each,index)=>{
            if(each==0){
                if(this.answer && this.answer.Text_Response_Value__c){
                    let ansList = this.answer.Text_Response_Value__c.split("-")[0].split(",");
                    this.edq5ValueList[index] = ansList[index];
                }
            }
        })
        
        this.selectedValue =  this.edq5ValueList.join(",")+"-"+this.sliderValue;
        this.sliderError = false;

    }

    onclickHandlerNew(event) {

        this.edq5ValueList.forEach((each,index)=>{
            if(each==0){
                if(this.answer && this.answer.Text_Response_Value__c){
                    let ansList = this.answer.Text_Response_Value__c.split("-")[0].split(",");
                    this.edq5ValueList[index] = ansList[index];
                }
            }
        })
       this.edq5ValueList[event.target.dataset.eqno] = event.target.value;
       if(this.sliderValue!=0)
            this.selectedValue = this.edq5ValueList.join(",")+"-"+this.sliderValue;
        else if(this.answer && this.answer.Text_Response_Value__c)
            this.selectedValue = this.edq5ValueList.join(",")+"-"+Number(this.answer.Text_Response_Value__c.split("-")[1]);
            
    }

    handleChange(event) {
        console.log('preventdata', event.keyCode);
        //new change strt
        console.log('name', event.target.name)
        console.log("order", this.question.Order__c)
        console.log('val', event.target.value);

        if (this.question.Order__c == 29) {
            if (event.target.value > 1 || event.target.value == '') {
                this.dispatchEvent(new CustomEvent('skip', {
                    detail: { 'qno': this.question.Order__c, 'visiblequestions': [30, 31, 32], 'hidequestions': "" }
                }));
            } else if (event.target.value <= 1) {
                this.dispatchEvent(new CustomEvent('skip', {
                    detail: { 'qno': this.question.Order__c, 'visiblequestions': "", 'hidequestions': [30, 31, 32] }
                }));
            }
        }
        
        try {
            if (this.question.Order__c != 29) {
                if (this.question.skipNumberTransplant__c != '' && this.question.skipNumberTransplant__c) {
                    JSON.parse(this.question.skipNumberTransplant__c).forEach(each => {
                        if (each.value == event.target.name || each.value == event.target.value) {
                            this.dispatchEvent(new CustomEvent('skip', {
                                detail: { 'qno': this.question.Order__c, 'visiblequestions': each.visiblequestions, 'hidequestions': each.hiddenquestions }
                            }));
                        }

                    })

                }
            }
        } catch (e) {
            console.log(e)
        }


        //checking flag for modal content and passing it to survey container
        if (JSON.parse(this.nextQuestion).otheroption == event.target.value) {
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
        console.log('inside the handleChange Event for ' + event.target.name + 'target type:' + event.target.type);
        let answerOther = '';
        if (event.target.type === "checkbox") {
            if (event.target.checked && event.target.name === "None") {
                this.template.querySelectorAll('lightning-input').forEach(each => {
                    console.log('if :Not NONE --the value is ' + each.name + ' ischecked:' + each.checked + ' type is:' + each.type);
                    if (each.checked && each.name !== "None")
                        each.checked = false;
                });
                this.selectedValue = event.target.name;
            }
            else {
                let values = [];
                //console.log('the value is '+event.target.value+' name is '+event.target.name+ 'is Checked:'+event.target.checked);
                this.template.querySelectorAll('lightning-input').forEach(each => {
                    console.log('else : the value is ' + each.name + ' ischecked:' + each.checked + ' type is:' + each.type);
                    if (each.checked)
                        values.push(each.name);
                    if (each.checked && each.name === "Other")
                        answerOther = "Other";
                });
                this.selectedValue = values.join(',');
                console.log('cbox', this.selectedValue);
                let eleNone = this.template.querySelector('lightning-input[data-id="None"]');
                if (eleNone)
                    eleNone.checked = false;
            }
        }
        else if (event.target.type == "date") {
            console.log('dateTest');
            let currentDate = new Date();
            let enteredDate = new Date(event.target.value);
            this.selectedValue = event.target.value;
            //alert("type "+ typeof enteredDate + "Value "+ event.detail.value );
            if (currentDate.getFullYear() - enteredDate.getFullYear() < 18) {
                // alert("type "+ typeof enteredDate + "Value "+ event.detail.value );
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
        // else if (event.target.type === "number") {  
        //     console.log('neg',event.target.value)                    
        //     if(event.target.value==""  || event.target.value.length>3){            
        //         event.target.value='';
        //     }
        // }
        else {
            this.selectedValue = event.detail.value;
            this.surveyanswer = event.detail.value;
            answerOther = event.detail.value;
        }


        let ans = event.detail.value;
        console.log('the selected value is :' + this.selectedValue);

        if ((this.otherOption?.isApplicable) && (this.otherOption?.forValue.includes(answerOther)) && (answerOther.includes('Other')) || this.selectedValue == "Employed, working 40 or more hours per week" || this.selectedValue.includes('Employed, working part time')) {
            console.log('isother in if ----->>>' + this.isother);
            if (this.selectedValue == "Employed, working part time" || this.selectedValue == "Other") {
                this.q7Style = "font-weight: bold; padding-bottom: 6px; margin-bottom: -15px; margin-top: 10px;"
            }
            this.isother = true;
            this.otherLabel = this.otherOption.forlabel;
        }
        else {
            console.log('isother in else ----->>>' + this.isother);
            this.isother = false;
            this.otherexistinganswer = "";
        }
        console.log('isotherValue ----->>>' + this.isother);
        console.log('Last ::the selected value is :' + this.selectedValue);

    }
    handleNumber(event) {
        console.log(this.questionText);
        if (this.questionText === "What is your date of birth?") {
            if (event.target.type === "number") {
                if (event.target.value != null && event.target.value != "") {
                    if (event.target.value >= 0 && event.target.value < 18) {
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
         if (this.question.Order__c == 29) {
            if (event.target.value > 1 || event.target.value == '') {
                this.dispatchEvent(new CustomEvent('skip', {
                    detail: { 'qno': this.question.Order__c, 'visiblequestions': [30, 31, 32], 'hidequestions': "" }
                }));
            } else if (event.target.value <= 1) {
                this.dispatchEvent(new CustomEvent('skip', {
                    detail: { 'qno': this.question.Order__c, 'visiblequestions': "", 'hidequestions': [30, 31, 32] }
                }));
            }
        }
        this.selectedValue = event.target.value;
    }
    dateHandle(event) {
        event.preventDefault();
    }
    radioTextHandler(event) {
        if ([75, 77, 84, 66, 69, 44, 45, 46, 107, 109, 98, 116, 101, 43].includes(event.keyCode)) {
            event.preventDefault();
        }
    }
    navigateEndToContainer() {
        //this.isNavigateEnd = true;
        this.dispatchEvent(new CustomEvent('tolastpage', {
            detail: this.navigateToLastEnd
        }));
    }
    get optionValuesinput() {
        // return this.eventsList.data.values;
        // this one works:
        return [
            { label: '18-20', value: '18-20' },
            { label: '21-30', value: '21-30' },
            { label: '31-40', value: '31-40' },
            { label: '41-50', value: '41-50' },
            { label: '51-60', value: '51-60' },
            { label: '61-70', value: '61-70' },
            { label: '71-80', value: '71-80' },
            { label: '81-90', value: '81-90' },
            { label: '91-100', value: '91-100' },
        ];
    }
    @api
    validations() {
        console.log('validations--->');
        let returnVal = true;

        if (this.question.Display_Type__c === 'Intro') {
            returnVal = true;
        } else if (this.question.Display_Type__c === 'Radio Button' || this.question.Display_Type__c === 'Multi Input') {
            let radioEle = this.template.querySelector("[data-name='radioInput']");
            returnVal = radioEle.reportValidity();

        }
        else if (this.question.Display_Type__c === 'Date') {
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
        else if (this.question.Display_Type__c === 'TextNumber') {
            let textEle = this.template.querySelector("[data-name='numberInput']");
            returnVal = textEle.reportValidity();
        }
        else if (this.question.Display_Type__c === 'Radio Text') {
            let returnVal;
            this.template.querySelectorAll('lightning-input').forEach(each => {
                if (each.type == "number") {
                    console.log(each.name, each.type, each.reportValidity());
                    returnVal = each.reportValidity();
                }
            })
            return returnVal;
        }
        else if (this.question.Display_Type__c === 'Table') {
            let flag = false;
            console.log('testflag' + flag);
            // this.template.querySelectorAll(`[data-Table]`).forEach(each => {
            //     if (each.dataset.Table == "false") {
            //         flag = false;
            //         this.errorScoreFlag = true;
            //     }
            //     else {
            //         this.errorScoreFlag = false;
            //     }
            // });
            // this.isTableValidation = true;
            // return this.isTableMandatory;
            this.template.querySelectorAll('[data-row]').forEach(each=>{
                if(each.checked && each.dataset.title!="Treatments"){
                    flag = true;
                }
            })
            console.log("table flag",flag);
            if(flag == false)
                this.isTableValidation = true;
            return flag;

        } /* else if (this.question.Display_Type__c === 'Report Score') {
            let flag = true;
            this.template.querySelectorAll(`[data-flag]`).forEach(each => {
                if (each.dataset.flag == "false") {

                    flag = false;
                    each.className = "errordiv";
                    this.errorScoreFlag = true;

                }
                else {
                    this.errorScoreFlag = false;
                    console.log('else plaveen');
                }
            });
            return flag;
        } */

        else if (this.question.Display_Type__c === 'Checkbox Group') {
            let validityStr = '';
            console.log('selectedvalue is' + this.selectedValue);
            if (this.selectedValue == '' || this.selectedValue == undefined) {
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
        else if (this.question.Display_Type__c === 'MultiInputData') {
            let count = 0;
            this.template.querySelectorAll('lightning-input').forEach(each => {
                if (each.reportValidity()) {
                    each.reportValidity();
                    count++;
                }
                if (count == 0) {
                    return false;
                }
            })
        }
        else if (this.question.Display_Type__c === 'Multi Input') {                                                                
            let count = 0;
            this.template.querySelectorAll('lightning-input').forEach(each => {
                if (each.reportValidity()) {
                    each.reportValidity();
                    count++;
                }
                if (count == 0) {
                    return false;
                }
            })
        }
        else if (this.question.Display_Type__c === 'Multiple Text') {
            let count = 0;
            this.template.querySelectorAll('lightning-input').forEach(each => {
                if (each.reportValidity()) {
                    each.reportValidity();
                    count++;
                }
                if (count > 1) {
                    return false;
                }
            })
        }
        else if (this.question.Display_Type__c === 'Multi Checkbox Picklist') {
            let radioList = this.template.querySelectorAll('[data-eq]');
            let flag = true
            for (let i = 0; i < radioList.length; i++) {
                if (!radioList[i].value)
                    flag = false
            }
            this.eqvalidation = (!flag) ? true : false
            this.sliderError = (!this.isSliderMoved) ? true : false;
            return flag && this.isSliderMoved;
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
        console.log("event.target.value=====>" + event.target.value);
        this.template.querySelectorAll("[data-name='otherInput']").forEach(each => {
            console.log('eacht', each.dataset.otherInput);
            each.value = event.target.value;
        })
        //  this.otherOption = event.target.value;
        this.otherValue = event.target.value;

    }


    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.selectedValue = undefined;
        if (this.question.Order__c == 8) {
            this.template.querySelectorAll("[data-name='radioInput']").forEach(each => {
                if (each.type == "radio") {
                    each.value = undefined;
                }
            });
        }

        if (this.question.Order__c == 2) {
            this.template.querySelectorAll("[data-name='radioInput']").forEach(each => {
                if (each.type == "radio") {
                    each.value = undefined;
                }
            });
        }

    }
    //this is commented in 
    submitDetails(event) {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
        this.navigateToLastEnd.type = "date";
        this.navigateToLastEnd.value = true;
        this.navigateEndToContainer();
        this.selectedValue = event.detail.value;
        answerOther = event.detail.value;
    }
    thankyouScreen(event) {
        this.isModalOpen = false;
        this.navigateToLastEnd.type = "date";
        this.navigateToLastEnd.value = true;

        // this[NavigationMixin.Navigate]({
        //     type: 'standard__webPage',
        //     attributes: {
        //         "url": "https://www.patientslikeme.com/users/sign_in"
        //     },

        // });
        window.location.replace("https://www.patientslikeme.com/users/sign_in");
        this.selectedValue = event.detail.value;
        answerOther = event.detail.value;
    }


    /* modal popup methods ends*/

    isrendered = false;
    renderedCallback() {
        if (!this.isrendered) {
            console.log("test");
            this.isrendered = false;
            if (this.answer != undefined) {
                console.log("inside second if");
                if (["Text", "Text Area", "Combo Box", "Radio Button"].includes(this.question.Display_Type__c)) {
                    this.selectedValue = this.answer.Text_Response_Value__c;
                }
                else if(["Table"].includes(this.question.Display_Type__c) && this.answer.Text_Response_Value__c ){
                    let jsonArray = JSON.parse(this.answer.Text_Response_Value__c);
                    this.template.querySelectorAll("[data-row]").forEach(each=>{
                        if(jsonArray[each.dataset.row].beforetreatment && each.dataset.title=="beforetreatment"){
                            each.checked = true;

                        }
                        else if(jsonArray[each.dataset.row].aftertreatment && each.dataset.title=="aftertreatment"){
                            each.checked = true;
                        }
                        else if(jsonArray[each.dataset.row].currenttreatment && each.dataset.title=="currenttreatment"){
                            each.checked = true;
                        }
                    })
                    jsonArray.forEach(each=>{
                        if(each.treatments.includes("Other")||each.treatments.includes("other")){
                            if(each.beforetreatment || each.aftertreatment || each.currenttreatment){
                                this.otherLabel = this?.otherOption?.forlabel;
                                this.otherValue = this.answer?.Other_Response_Value__c;
                                this.isother = true;
                            }
                        }
                    })
                   /*  this.template.querySelectorAll("[data-row]").forEach(each=>{
                        if(each.value && each.value.includes("Other") && each.checked){
                          
                        }
                    }) */


                    this.selectedValue = this.answer.Text_Response_Value__c;
                }
                else if ("Date" == this.question.Display_Type__c) {
                    this.selectedValue = this.answer.Text_Response_Value__c;
                }
                else if (["Number", "Radio Text", "TextNumber"].includes(this.question.Display_Type__c)) {
                    this.selectedValue = Number(this.answer.Text_Response_Value__c);
                }
                else if (this.question.Display_Type__c == "Multi Input") {
                    let val = this.answer.Text_Response_Value__c;
                    console.log("this.question.Order__c", this.question.Order__c);
                    this.selectedValue = this.answer.Text_Response_Value__c;
                    console.log("this.selectedValue", this.selectedValue)
                    if (val && val.includes(":") && val.includes("-")) {
                        this.multiInputValue = val.split(":")[0];
                        this.multiInput1 = val.split(":")[1].split("-")[0]
                        this.multiInput2 = val.split(":")[1].split("-")[1];
                    }
                    else if(val){
                        this.multiInputValue = val;
                    }
                    this.isMultiNestedInput = (this.multiInputValue == "Yes") ? true : false;
                }
                else if (this.question.Display_Type__c == "Multiple Text" && this.answer && this.answer.Text_Response_Value__c && this.answer.Text_Response_Value__c?.includes("-")) {
                    let ans = this.answer.Text_Response_Value__c.split("-");
                    if(ans[0])
                        this.text1 = ans[0];
                    if(ans[1])
                        this.text2 = ans[1];
                    if(ans[2])
                        this.text3 = ans[2];
                    this.selectedValue = ans[0] + "-" + ans[1] + "-" + ans[2];
                }
                else if (this.question.Display_Type__c == "Checkbox Group") {
                    this.selectedValue = this.answer.Text_Response_Value__c;
                    this.template.querySelectorAll('lightning-input').forEach(each => {
                        if (each.type == "checkbox" && this.selectedValue && this.selectedValue.includes(each.name)) {
                            each.checked = true;
                        }
                    })
                }
                else if (this.question.Display_Type__c == "Multi Checkbox Picklist") {
                   /*  if (this.answer?.Text_Response_Value__c && this.answer?.Text_Response_Value__c.includes('-')) {
                        let answers = this.answer?.Text_Response_Value__c.split("-");
                        this.myValue = Number(answers[1]);
                        let radioValuesList = [];
                        if (answers[0].includes(',')) {
                            console.log("answers[0]",answers[0]);
                            radioValuesList = answers[0].split(",");
                         }
                        this.template.querySelectorAll('[data-eq]').forEach((each, index) => {
                            each.value = radioValuesList[index];
                        })
                    } */
                    if( this.answer.Text_Response_Value__c && this.answer.Text_Response_Value__c.includes("-")){
                        let radioValues = this.answer.Text_Response_Value__c.split("-")[0];
                        if(radioValues.includes(",")){
                        let ans = radioValues.split(",");
                    this.template.querySelectorAll('[data-eq]').forEach((each,index)=>{
                        each.value = ans[index];
                    })
                }
                    let sliderValue = Number(this.answer.Text_Response_Value__c.split("-")[1]);
                    this.template.querySelector("lightning-slider").value = sliderValue;
                    this.isSliderMoved = true;
                }
                this.selectedValue = this.answer.Text_Response_Value__c;
                }  
                if(this.answer.Text_Response_Value__c && this.answer.Text_Response_Value__c.includes("Other") && this.question.Order__c!=34 ||(this.answer.Text_Response_Value__c && this.answer.Text_Response_Value__c.includes("Employed, working part time") && this.question.Order__c!=34)){
                    this.otherLabel = this?.otherOption?.forlabel;
                    this.otherValue = this.answer?.Other_Response_Value__c;
                    this.isother = true;
                }
            }
            console.log("this.selectedValue", this.selectedValue)
            this.isrendered = true;

        }


    }
}