import { LightningElement, api, wire, track } from 'lwc';
import getSurveyQuestions from '@salesforce/apex/AlphaSurveyController.getSurveyQuestions';
import treatment1 from '@salesforce/label/c.Treatment1';
import treatment2 from '@salesforce/label/c.Treatment2';
import treatment3 from '@salesforce/label/c.Treatment3';
import treatment4 from '@salesforce/label/c.Treatment4';
import treatment5 from '@salesforce/label/c.Treatment5';
import treatment6 from '@salesforce/label/c.Treatment6';
import treatment7 from '@salesforce/label/c.Treatment7';
import treatment8 from '@salesforce/label/c.Treatment8';


export default class alphaSurveyQuestion extends LightningElement {
    multiselectValues;
    @track values = [];
    @api question;
    @api surveyanswer;
    @api checkboxvalue;
    backCheckForScore = false;
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
    isother = false;
    otherLabel ='';
    otherOption;
    selectedValue;
    otherValue;
    isCheckboxValidnFailed = false;
    loopvariable = [0,1,2,3,4,5];
    score = 0;
    scoreDiv1;
    scoreDiv2;
    Treatments;
    beforeDiagnosis;
    afterDiagnosis;
    currentTreatment;
    index=0;
    isNavigateEnd = false;
    label = {
        treatment1,treatment2,treatment3,treatment4,treatment5,treatment6,treatment7,treatment8
    };
    value = '';
    navigateToLastEnd={"type":"","value":false}
    isModalOpen;
    modalContent="";
    errorScoreFlag = false;
    @api otherexistinganswer;

    @api
    refreshNextQuestion() {
        this.selectedValue = '';
        this.isother = false;
        this.otherValue = '';
        this.isCheckboxValidnFailed = false;
    }
    @api
    refreshOtherValue(){
        this.isother = false;
        this.otherValue = '';
        this.otherexistinganswer = '';
        this.backCheckForScore = false;
        this.score=0;
        this.surveyanswer =undefined; 
        this.otherOption ='';
        this.selectedValue = undefined;
        console.log("this.surveyanswer "+this.surveyanswer);
    }

    @api
    selectedAnswer() {
        return this.selectedValue;
    }

    @api 
    otherAnswer()   {
        return this.otherValue;
    }

    connectedCallback(){
        console.log('connected call back'+this.surveyanswer);
        this.surveyanswer = null;

    }

    get questionText() {
        // this.selectedValue='';
        return this.question.Question_Text__c;
    }
    get nextQuestion(){
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
    //New changes
    get isCheckpicklistgroup() {
        return (this.question.Display_Type__c === 'Multi Checkbox Picklist') ? true : false;
    }
    get isReportScore(){
        return (this.question.Display_Type__c === 'Report Score') ? true : false;
       
    }
    get isTable(){
        return (this.question.Display_Type__c === 'Table') ? true : false;
       
    }
    
    oncheck(event){
        // this.score = 0;

        console.log('col: '+event.currentTarget.dataset.value+' row: '+event.currentTarget.dataset.index);
        let col = event.currentTarget.dataset.value;
        let row = event.currentTarget.dataset.index;
        this.template.querySelectorAll(`[data-value]`).forEach(each =>{
        if(each.dataset.index == row){
                if(each.dataset.value ==col){
                    each.className = "selectedbox";
                }
                else{
                    each.className = "box";
                }
            }
        });
        
        this.template.querySelectorAll(`[data-temp]`).forEach(each =>{
            //console.log(each.dataset.temp+' '+event.currentTarget.dataset.index+' '+event.currentTarget.dataset.innerIndex);
            if(each.dataset.temp==event.currentTarget.dataset.index){
                if(each.dataset.flag == "true"){
                    each.className = "box1";
                    this.score = this.score-Number(each.innerHTML);
                    each.innerHTML = event.currentTarget.dataset.value
                    this.score = Number(this.score) +  Number(event.currentTarget.dataset.value);
                    this.values[row] = event.currentTarget.dataset.value;
                }
                else{
                    this.values = [...this.values,event.currentTarget.dataset.value];
                    each.innerHTML = event.currentTarget.dataset.value; 
                    each.dataset.flag = "true";
                    this.score = Number(this.score) +  Number(each.innerHTML);
                    }
                }
            });
        console.log("values "+this.values+'-'+this.score);
        this.selectedValue = this.values+'-'+this.score;
        let scoreString = (this.score+'').length==1?("0"+this.score):(this.score+"");
        let scoreArray = scoreString.split("");
        if(scoreArray[0] !== undefined)
            this.scoreDiv1 = scoreArray[0];
        else
            this.scoreDiv1 = "0";
        if(scoreArray[1] !== undefined)
            this.scoreDiv2 = scoreArray[1];
        else
            this.scoreDiv2 = "0";
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
    /** */
    handleClick(event) {
        
       
        let jsonArray = [];
        this.template.querySelectorAll(`[data-trrow]`).forEach(each => {
            jsonArray.push({
                "treatments" : "",
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
            
             if(each.dataset.title == "Treatments"){
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
        if(!jsonArray[3].currenttreatment){
        this.navigateToLastEnd.type="table";
               this.navigateToLastEnd.type=true; 
        }
        console.log("event.target.valu"+event.currentTarget.dataset.label);
        let label = event.currentTarget.dataset.label
        console.log("this.isother "+this.isother);
        let jsonObj = jsonArray[jsonArray.length-1];
        console.log("jsonObj "+JSON.stringify(jsonObj));
        if(jsonObj.treatments == label &&
            (jsonObj.beforetreatment==true || jsonObj.aftertreatment==true|| jsonObj.currenttreatment==true)){
                this.isother = true;
            }
            else if(jsonObj.beforetreatment==false && jsonObj.aftertreatment==false && jsonObj.currenttreatment==false){
                this.isother = false;
            }
    }
    @api
    popupvalidation(event){
        this.isModalOpen = true;
    }
    renderedCallback() {
        //console.log('inside the renderedCallback '+this.questionInitialized);
        /*if(this.questionInitialized)
            return;
        this.questionInitialized = true;
        this.Options = (this.question.Options__c)?JSON.parse(this.question.Options__c): undefined;
        console.log('Options'+ this.Options);
            this.otherOption =this.question.Option_Other__c;
                
            this.Otheroptions = JSON.parse(this.Otheroptions);
            console.log(this.Otheroptions.isApplicable);
            console.log('type--'+typeof this.Options);
            console.log (this.question.Display_Type__c);
            //if(this.question.Display_Type__c == 'Radio Button')
            //this.isRadio = true;
            //console.log('isRadio--->>'+this.isRadio);
            if(this.question.Display_Type__c == 'Text')
            this.isText = true;
            
            if(this.question.Display_Type__c == 'Text Area')
            this.isTextArea = true;
            if(this.question.Display_Type__c == 'Checkbox Group')
            this.isCheckgroup = true;
            if(this.question.Display_Type__c == 'Combo Box')
            this.isCombo = true;
            console.log('iscombo--->>'+this.isCombo);
            if(this.question.Display_Type__c == 'Intro')
            this.isIntro = true;
            //if(this.question.Display_Type__c == 'Date')
            //this.isDate = true;
        */

    }

    onclickHandlerNew(event){   
        this.multiselectValues =this.multiselectValues+","+ event.target.value;
        console.log("this.multiselectValues "+this.multiselectValues);
        this.selectedValue = this.multiselectValues.replace('undefined,','');
    }
    handleChange(event) {
        //checking flag for modal content and passing it to survey container
        if(JSON.parse(this.nextQuestion).otheroption == event.target.value){
            this.modalContent = JSON.parse(this.nextQuestion).modalcontent;
            this.isModalOpen = true;
            this.dispatchEvent( new CustomEvent( 'validation', {
                detail: true
            } ) );
        }
        else{
            this.dispatchEvent( new CustomEvent( 'validation', {
                detail: false
            } ) );
        }

        console.log('inside the handleChange Event for ' + event.target.name +'target type:'+event.target.type);
        let answerOther ='';
        if(event.target.type === "checkbox")    {
            if(event.target.checked && event.target.name === "None")    {
                this.template.querySelectorAll('lightning-input').forEach(each => {
                    console.log('if :Not NONE --the value is '+each.name+' ischecked:'+each.checked+' type is:'+each.type);
                    if(each.checked && each.name !== "None")
                        each.checked = false;
                });
                this.selectedValue = event.target.name;
            }
            else    {
                let values=[];
                //console.log('the value is '+event.target.value+' name is '+event.target.name+ 'is Checked:'+event.target.checked);
                this.template.querySelectorAll('lightning-input').forEach(each => {
                    console.log('else : the value is '+each.name+' ischecked:'+each.checked+' type is:'+each.type);
                    if(each.checked)
                        values.push(each.name);
                    if(each.checked && each.name==="Other")
                        answerOther="Other";
                });
                this.selectedValue = values.join(',');
                let eleNone=this.template.querySelector('lightning-input[data-id="None"]');
                if(eleNone)
                    eleNone.checked = false;
            }
        }
        else if(event.target.type == "date"){
            let currentDate = new Date();
            let enteredDate = new Date(event.detail.value);
            this.selectedValue = event.detail.value;
            //alert("type "+ typeof enteredDate + "Value "+ event.detail.value );
            if(currentDate.getFullYear()-enteredDate.getFullYear()< 18 ){
               // alert("type "+ typeof enteredDate + "Value "+ event.detail.value );
               this.modalContent = JSON.parse(this.nextQuestion).modalcontent;
               this.isModalOpen = true;
               this.dispatchEvent( new CustomEvent( 'validation', {
                detail: true
            } ) );
            }
            else{
                this.dispatchEvent( new CustomEvent( 'validation', {
                    detail: false
                } ) );
            }
                     
        }
        else{
            this.selectedValue = event.detail.value;
            this.surveyanswer = event.detail.value;
            answerOther = event.detail.value;
        }
        
        
        let ans = event.detail.value;        
        console.log('the selected value is :'+this.selectedValue);
        if ((this.otherOption.isApplicable ) && (this.otherOption.forValue == answerOther) && (answerOther === 'Other') ) {
            console.log('isother in if ----->>>' + this.isother);
            this.isother = true;
            this.otherLabel=this.otherOption.forlabel;
        }
        else {
            console.log('isother in else ----->>>' + this.isother);
            this.isother = false;
            this.otherexistinganswer ="";
        }
        console.log('isotherValue ----->>>' + this.isother);
        console.log('Last ::the selected value is :'+this.selectedValue);
       
        /*let eleName = event.target.name;
        if(eleName === 'Checkbox Group')    {
            
            //if(this.selectedValue === 'None')   {
                const eles = this.template.querySelectorAll('input');
                console.log('eles are '+eles);

                this.template.querySelectorAll('input').forEach(each => {
                    //each.value = option;//event.currentTarget.dataset.name;
                    console.log('the value is '+each.value);
                });

                const eles1 = this.template.querySelectorAll('lightning-checkbox-group');
                console.log('eles are '+eles1);

                this.template.querySelectorAll('lightning-checkbox-group').forEach(each => {
                    //each.value = option;//event.currentTarget.dataset.name;
                    console.log('the value is '+each.value);
                });

                //this.template.querySelectorAll(`[data-name=${this.selectedOption}]`).forEach(each => {
                //    each.value = option;//event.currentTarget.dataset.name;
                //});
                //console.log('test');
            //}
        }*/


    }
    navigateEndToContainer(){
        //this.isNavigateEnd = true;
        this.dispatchEvent( new CustomEvent( 'tolastpage', {
            detail: this.navigateToLastEnd
        } ) );
    }
    @api
    validations() {
       console.log('validations--->');
        let returnVal = true;

        if (this.question.Display_Type__c === 'Intro') {
            returnVal= true;
        }else if (this.question.Display_Type__c === 'Radio Button') {
            let radioEle = this.template.querySelector("[data-name='radioInput']");
            returnVal =radioEle.reportValidity();

         } 
        else if (this.question.Display_Type__c === 'Date') {
            let dateEle = this.template.querySelector("[data-name='dateInput']");
            returnVal =dateEle.reportValidity();

        }else if (this.question.Display_Type__c === 'Combo Box') {
            let comboEle = this.template.querySelector("[data-name='comboInput']");
            returnVal =comboEle.reportValidity();

        }else if (this.question.Display_Type__c === 'Text Area') {
            let textAreaEle = this.template.querySelector("[data-name='textareaInput']");
            returnVal =textAreaEle.reportValidity();

        }else if (this.question.Display_Type__c === 'Number') {
            let numberEle = this.template.querySelector("[data-name='numberInput']");
            returnVal =numberEle.reportValidity();

        }else if (this.question.Display_Type__c === 'Text') {
            let textEle = this.template.querySelector("[data-name='textInput']");
            returnVal =textEle.reportValidity();

        }else if (this.question.Display_Type__c === 'Report Score') {
            let flag = true;
            this.template.querySelectorAll(`[data-flag]`).forEach(each =>{
                if(each.dataset.flag == "false"){
                    flag = false;
                    each.className = "errordiv";
                    this.errorScoreFlag = true;
                }
                else{
                    this.errorScoreFlag = false;
                }
            });
            return flag;
    }

        else if (this.question.Display_Type__c === 'Checkbox Group') {
            let validityStr='';
            console.log('selectedvalue is'+this.selectedValue);
            if(this.selectedValue == ''){            
                //let isCheckboxSelected = false;
                validityStr= ' ';  //space will highlight the checkboxes without any message
                this.isCheckboxValidnFailed = true;
                //if(isCheckboxSelected)
                //returnVal =textAreaEle.reportValidity();
                returnVal = false;
            }
            else {
                validityStr=''; //emptyString will remove the customvalidity if any set earlier
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
            returnVal =otherEle.reportValidity();

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
        console.log("event.target.value=====>"+event.target.value);
         this.template.querySelectorAll("[data-name='otherInput']").forEach(each => {
                each.value = event.target.value;
        }) 
      //  this.otherOption = event.target.value;
        this.otherValue = event.target.value;
    }

    
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails(event) {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
        this.navigateToLastEnd.type="date";
        this.navigateToLastEnd.value=true; 
        this.navigateEndToContainer(); 
        this.selectedValue = event.detail.value;
        answerOther = event.detail.value;  
    }


    /* modal popup methods ends*/
    renderedCallback(){
        //this.refreshApex();
      console.log('value checkbox group' + this.isCheckgroup);
      /*  if(this.isCheckgroup){
            this.template.querySelectorAll(`[data-name]`).forEach(each => {
                if(each.dataset.name == "checkboxInput"){
                each.checked = false;
                }
            })
        } */
        /* if(this.isRadio){                        
            this.template.querySelectorAll(`[data-name]`).forEach(each => {
                console.log( 'name' + each.dataset.name);
                console.log( 'dataset' + JSON.stringify(each.dataset));
                console.log( 'options' + JSON.stringify(each));
                console.log( 'value' + each.value+' survey answer'+this.surveyanswer);
                console.log( 'type' + each.type);
                console.log('selected answer '+this.selectedValue+'selected answer'+this.selectedAnswer);
                //console.log( 'radio' + each.onchange);
                if(each.dataset.name == "radioInput"){
                    //alert('hihihi');
                each.checked = true;
                }
            })
        } */
         /* if(this.isText || this.isTextArea){
            //this.selectedValue = this.surveyanswer;
            this.template.querySelectorAll(`[data-name]`).forEach(each => {
                if(each.dataset.name == "textInput" || each.dataset.name == "textareaInput"){
                    each.value = null;
                }
            })
        }  */
        //alert('hihihi '+this.surveyanswer);
       // this.refreshOtherValue();
        if(this.question.Display_Type__c === 'Checkbox Group' && this.surveyanswer!=undefined){
            if(this.surveyanswer?.Text_Response_Value__c!=undefined){
            let answerValue = this.surveyanswer?.Text_Response_Value__c;
            let temp="";
            if(this.selectedValue==null || this.selectedValue ==undefined ){
                temp= answerValue;
            }
            else{
                temp = this.selectedValue;
            }
            //alert("answerValue "+answerValue);
            //alert("this.selectedValue "+this.selectedValue)
            this.template.querySelectorAll("[data-name='checkboxInput']").forEach(each => {
                if(temp.includes(each.dataset.id)){
                    each.checked = true;
                    if(each.dataset.id === "Other"){
                        this.isother = true;
                        this.template.querySelectorAll("[data-name='otherInput']").forEach(each => {
                            each.value = this.otherValue;
                        });
                    }
                }
                else{
                    each.checked = false;
                }
            })
            console.log("testing vinay"+this.otherexistinganswer);
            }
        }
         else if(this.question.Display_Type__c === 'Report Score' && this.surveyanswer!=undefined  && !this.backCheckForScore){
             if(this.surveyanswer.Text_Response_Value__c!=null ||this.surveyanswer.Text_Response_Value__c!=undefined){
            const answerValue = this.surveyanswer.Text_Response_Value__c.split("-")[0].split(",");
            console.log(answerValue);
            this.template.querySelectorAll(`[data-value]`).forEach(each =>{
                    answerValue.forEach((divValue,index)=>{
                           if(index == each.dataset.index && each.dataset.value == divValue){
                               this.backCheckForScore = true;
                                each.click();
                           }
                    });
            }); 
            this.selectedValue =   this.surveyanswer.Text_Response_Value__c;
        }   
        } 
        else if(this.question.Display_Type__c === 'Multi Checkbox Picklist' && this.surveyanswer!=undefined){
            if(this.surveyanswer.Text_Response_Value__c!=null && this.surveyanswer.Text_Response_Value__c!=undefined){
                const answerValue = this.surveyanswer?.Text_Response_Value__c;
                this.template.querySelectorAll(`[data-radio]`).forEach(each =>{                                             
                            for(let i=0;i<each.options.length;i++){
                            if(answerValue.includes(each.options[i].label)){
                                each.value = each.options[i].label;
                            }
                            }
                });
                this.selectedValue = answerValue;
            }
        }
        else if(this.question.Display_Type__c === 'Table' && this.surveyanswer!=undefined){
            if(this.surveyanswer.Text_Response_Value__c!=null && this.surveyanswer.Text_Response_Value__c!=undefined){
                let answerValue = (this.selectedValue!=undefined)?this.selectedValue:JSON.parse(this.surveyanswer.Text_Response_Value__c)
                this.template.querySelectorAll(`[data-label]`).forEach(each =>{
                    for(let i=0;i<answerValue.length;i++){
                        if(answerValue[i].treatments == each.dataset.label){
                            if( answerValue[i][each.dataset.title]!= undefined ){
                                if(answerValue[i][each.dataset.title] == true ){
                                    each.checked =true;
                                }
                            }
                        }                       
                    }
                });
                /*  let json = answerValue[answerValue.length-1];
                if(answerValue[answerValue.length-1].beforetreatment === true || answerValue[answerValue.length-1].aftertreatment === true || answerValue[answerValue.length-1].currenttreatment === true){
                    this.isother = true;    
                }
                else if(answerValue[answerValue.length-1].beforetreatment === false && json.aftertreatment === false && json.currenttreatment === false){
                    this.isother = false;
                }  */
            }
        }
        if(this.otherexistinganswer == undefined || this.otherexistinganswer == ""){
        }
        else{
            this.template.querySelectorAll("[data-name='otherInput']").forEach(each => {
                each.value = this.otherexistinganswer;
        }) 
         
        this.selectedValue = "Other";
        this.otherValue = this.otherexistinganswer;
        this.isother= true;
        }
      if (typeof this.surveyanswer=== "string" || typeof this.surveyanswer=== "number" || typeof this.surveyanswer=== "date"){
        if(this.surveyanswer?.Text_Response_Value__c!="undefined"){
            this.selectedValue = this.surveyanswer;
        }        
        else {
        this.selectedValue= this.surveyanswer.Text_Response_Value__c;
        }  
      }
    //   else if(this.surveyanswer== null){
    //       this.selectedValue = null;
    //   }
        
            
        
        /* if(this.otherexistinganswer!= null && this.otherexistinganswer != undefined){
            this.template.querySelectorAll(`[data-name]`).forEach(each =>{
                    if(each.dataset.name == 'otherInput'){
                        each.value = this.otherexistinganswer;
                    }
            });
        } */
    }
}