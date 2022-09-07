import { LightningElement,track,wire,api } from 'lwc';
import getQuestions from '@salesforce/apex/GoalQuestions.getQuestions';
import lookUpOptions from '@salesforce/apex/GoalQuestions.getOptionsetting';
import insertGoal from '@salesforce/apex/GoalQuestions.insertGoalResponse';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

export default class Content_main_01 extends LightningElement {
    @track openModal = false;
    @track questions;
    @track selectedOption;
    errors;
    value ='';
    options;
    searchKey = '';
    searchOption = '';
    records;
    isShowdown = false;
    showNext = true;
    showPreviousNext = false;
    showSave = false;
    conditionmap = {};
    weekMap ={"0x per week":"0", "1x per week":"1","2x per week":"2", "3x per week":"3","4x per week":"4", "5x per week":"5","6x per week":"6", "1x per day(7x per week)":"7","2x per day(14x per week)":"14", "3x per day(21x per week)":"21"};

    @track page = 1; //this will initialize 1st page
    @track items = []; //it contains all the records.
    @track data = []; //data to be displayed in the table
    @track columns; //holds column info.
    @track startingRecord = 1; //start record position per page
    @track endingRecord = 0; //end record position per page
    @track pageSize = 5; //default value we are assigning
    @track totalRecountCount = 0; //total record count received from all retrieved records
    @track totalPage = 0; //total number of page is needed to display all records

    
    showModal() {
        this.openModal = true;
    }
    closeModal() {
        this.openModal = false;
    }

    @api getallQuestions(){
        this.openModal = true;
        this.showNext = true;
        this.showPreviousNext = false;
        this.showSave = false;
        getQuestions().then(result => {
            this.data = JSON.parse(result).mdtFieldsList;
            this.items = this.data;
            this.totalRecountCount = this.data.length; //here it is 23
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); //here it is 5
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.questions=JSON.parse(result).mdtFieldsList;
            this.conditionmap = JSON.parse(result).goalSuggestionMap;
        }).catch(error =>{this.errors=error});
        console.log(this.questions);
    }

    handleChange(label,text) {
     // alert('Hi');
        //const field = event.target.name;
        var performanceValue = '';
       // if(field === 'Option'){
            this.searchKey = label;//event.target.dataset.name;
            this.searchOption = text;//event.target.value;
            if(text== ''){
                for(var i=0;i<  this.questions.length;i++){
                    if(this.data[i] && this.data[i].Label ==  this.searchKey){
                        //this.data[i].showSearchBox = false;
                        this.data[i].selectedValue = '';
                    }
                }
                
            }
            if(this.searchKey == 'Condition'){
                this.template.querySelectorAll(`[data-name='Performance']`).forEach(each => {
                  performanceValue= each.value;
              });
              for(var i=0;i<  this.questions.length;i++){
                if(this.questions[i].Label ==  'Performance'){
                    performanceValue =  this.questions[i].selectedValue;// event.currentTarget.dataset.name;
                }
            }
            }
         //}
        lookUpOptions({
                searchKeyWord : this.searchKey,
                searchKeyOption : this.searchOption,
                perfValue : performanceValue
            }).then(result => {
                this.records = result;
                this.error = undefined;
                for(var i=0;i<  this.questions.length;i++){
                    if(this.data[i].Label == this.searchKey){
                        this.data[i].Options = JSON.parse(result);
                        this.data[i].showSearchBox = true;
                        this.isShowdown = true;
                    }
                }
            }).catch(error => {
                this.error = error;
                this.records = undefined;
            });
            //alert('Key->'+this.questions[0].Options);
        }

    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
            this.showSave =false;
            this.showPreviousNext = true;
            this.showNext =false;
        }
        if (this.page == 1) {
            this.showSave =false;
            this.showPreviousNext = false;
            this.showNext =true;
        }
    }

    nextHandler() {

        for(var i=0;i< 5;i++){
            if(typeof this.questions[i].selectedValue == 'undefined' ||
            this.questions[i].selectedValue == null || this.questions[i].selectedValue == ''){

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'error',
                        message: 'please fill all the options!' ,
                        variant: 'error',
                     }),
                    );
                    return false;
            }
            
         }

        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page); 
            this.showSave =false;
            this.showPreviousNext = true;
            this.showNext =false;    
            if(this.page == this.totalPage){
                this.showSave =true;
                this.showPreviousNext = false;
                this.showNext =false;
            }
        }             
    }

    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1;
    }
    handleOptionSelect(label,option) {
        this.selectedOption = label;//event.currentTarget.dataset.label;
       // alert(this.selectedOption);
        this.isShowdown = false;
        this.template.querySelectorAll(`[data-name=${this.selectedOption}]`).forEach(each => {
           each.value= option;//event.currentTarget.dataset.name;
         });
         for(var i=0;i<  this.questions.length;i++){
            if(this.data[i].Label ==  this.selectedOption){
                this.data[i].showSearchBox = false;
                this.data[i].selectedValue = option;// event.currentTarget.dataset.name;
            }
            if(this.questions[i].Label ==  this.selectedOption){
                this.questions[i].showSearchBox = false;
                this.questions[i].selectedValue = option;// event.currentTarget.dataset.name;
            }
        }
    }
    handlePickListSelect(label,option) {
        this.selectedOption = label;// event.currentTarget.dataset.label;
        //alert(this.selectedOption);
        /*this.isShowdown = false;
        this.template.querySelectorAll(`[data-name=${this.selectedOption}]`).forEach(each => {
           each.value= event.currentTarget.dataset.name;
         });
         */
         for(var i=0;i<  this.questions.length;i++){
            if(this.data[i] && this.data[i].Label ==  this.selectedOption){
                this.data[i].showSearchBox = false;
                this.data[i].selectedValue = option;//event.currentTarget.value;
            }
            if(this.questions[i].Label ==  this.selectedOption){
                this.questions[i].showSearchBox = false;
                this.questions[i].selectedValue = option;//event.currentTarget.value;
               
            }
        }


    }
   
    saveGoal(){

        for(var i=5;i< this.questions.length;i++){
            if(typeof this.questions[i].selectedValue == 'undefined' ||
            this.questions[i].selectedValue == null || this.questions[i].selectedValue == ''){

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'error',
                        message: 'please fill all the options!' ,
                        variant: 'error',
                     }),
                    );
                    return false;
            }
            
         }

        let goalResponse = { 'sobjectType': 'Goal_Response__c' };
        //goalResponse.Condition__c = 'From LWC';
        for(var i=0;i<  this.questions.length;i++){
           goalResponse[this.questions[i].fieldName] = this.questions[i].selectedValue;
           let value = this.questions[i].fieldName.split('__')[0]+'_Value__c';
           goalResponse[`${value}`] = this.weekMap[this.questions[i].selectedValue];
           
        }
        //goalResponse.Difficulty__c = 'Easy';

        insertGoal({
            gresponse : goalResponse
        }).then(result => { 
            this.goalResult = result;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'success',
                    message: 'Goal has created successfully!' ,
                    variant: 'success',
                 }),
                );
                this.openModal =false;
        }).catch(error => {
            
                this.goalError = error;
                console.log(this.goalError);
                alert(this.goalError);
                this.goalResult = undefined;
        });
//alert(goalResponse);
console.log(goalResponse);
    }


    handleSelectOptions(event){
        const type = event.detail.type;
        if(type == 'search'){
            let text = event.detail.searchText;
            let label = event.detail.label;
            //alert(text);
            this.handleChange(label,text);
        }else if(type == 'searchable'){
            let option = event.detail.option;
            let label = event.detail.label;
            this.handleOptionSelect(label,option)
           // alert(option);
        }else if(type == 'picklistRadio'){
            let option = event.detail.option;
            let label = event.detail.label;
            this.handlePickListSelect(label,option)
           // alert(option);
        }

    }

}