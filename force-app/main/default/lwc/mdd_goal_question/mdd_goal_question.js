import { LightningElement, api,track } from 'lwc';

export default class Mdd_goal_question extends LightningElement {

    @api question;
    @api answers;
    relatedOptions = [];
    category;
    subcategory;
    conditionOptions;
    showSearchBox = false;
    options=[];
    isFirsTimeRendered = true;
    conditionDependentOption = [{'label':'test1','value':'test1'}];
    cnValues;
    isSummary = false;
    
    get questionText() {
        return this.question.Question_Text__c;
    }

    get dependentOptions() {
        return JSON.parse(this.question.Dependent_options__c);
    }

    get isDependentOption() {
        return this.question.is_Dependent_option__c;
    }

    get optionValues() {
     
        return (this.question.Options__c == undefined) ? [] : JSON.parse(this.question.Options__c);
    }

    get isComboRadio() {
        return (this.question.Display_Type__c == "Combo - Radio");
    }

    get isText() {
        return (this.question.Display_Type__c == "Text");
    }

    get isRadio() {
        return (this.question.Display_Type__c == "Radio");
    }

    get isSearchComboBox() {
        return (this.question.Display_Type__c == "Combo - Search");
    }

    get isComboBox() {
        return (this.question.Display_Type__c == "Combo box");
    }

    get isSearchable() {
        return (this.question.Display_Type__c == "Searchable");
    }

    get questionType(){
        return this.question.Type__c!=undefined?this.question.Type__c:false;
    }

    handleChange(event) {
        console.log("answered value", event.target.value);

        if (event.target.dataset.name == "comboRadioInput") {
            this.category = event.target.value
        }
        if (this.isDependentOption) {
            this.relatedOptions = this.dependentOptions[0][event.target.value]
        }
        this.dispatchEvent(new CustomEvent('answers', {
            detail: {
                questionno: this.question.Order__c,
                answer: event.target.value
            }
        }));


    }

    handleClick(event) {
        if (event.target.dataset.name == "radioComboInput") {
            this.subcategory = event.target.value;
            this.dispatchEvent(new CustomEvent('answers', {
                detail: {
                    questionno: this.question.Order__c,
                    answer: this.category + ',' + this.subcategory
                }
            }));
        }

    }

    handleChangeSearch(){
        this.showSearchBox = true;
        
    }

    handleBlur(event){
        this.showSearchBox = false;
        console.log('onblur'+event.target.value);
        this.dispatchEvent(new CustomEvent('answers', {
            detail: {
                questionno: this.question.Order__c,
                answer: event.target.value
            }
        }));
    }

    @api
    fetchAnswersInsamePage(answer){
        if(this.question.Order__c=='3'){
            console.log('fetchAnswersInsamePage',JSON.stringify(answer));
            let condition=answer[1].split('=>')[1];
            if(this.isDependentOption){
                this.template.querySelector("[data-dependentcombo]").options = this.dependentOptions[0][condition]
               //this.cnValues=;
                console.log('coonditioncheck',this.dependentOptions[0][condition]);
            }
            
        }
    }

    handleMouseEnter(){
        this.showSearchBox = true;
        
    }

    handleMouseLeave(){
        this.showSearchBox = false;
    }

    testHandler(event){
        //console.log("testing in options handler");
         this.template.querySelector("[data-qno]").value= event.target.dataset.optionvalue;
    }       

   /* @api answersMapFromParent(answersMap) {
        console.log("answersMap from parent is", answersMap);
        this.answerMap = answersMap;
        if(this.answerMap!=undefined){
            this.answerMap.forEach(each => {
                console.log("in child", each.split("=>"));
                
                if(each.split("=>")[0] == "1"){
                    let values = each.split("=>")[1].split(",");
                    this.category = values[0];
                    this.subcategory = values[1];
                    console.log("this.subcategory",this.subcategory);
                }
            })
        }
    } */

    @api 
    refreshValues(){
        this.isFirsTimeRendered = true;
    }

    renderedCallback(){
        if(this.isFirsTimeRendered){
            this.isFirsTimeRendered = false;
        console.log("answers",JSON.stringify(this.answers));


        if(this.answers!=undefined){
            this.answers.forEach(each => {
                // console.log("in child", each.split("=>"));
                
                if(each.split("=>")[0] == "1"){
                    let values = each.split("=>")[1].split(",");
                    this.category = values[0];
                    this.subcategory = values[1];
                    console.log("this.subcategory",this.subcategory);
                }
            })
        }

        if(this.question.Display_Type__c == "Searchable" && this.isDependentOption){
            this.options = this.dependentOptions[0][this.subcategory];
            console.log("options",this.options);
        }
    }

}


}