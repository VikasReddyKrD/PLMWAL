import { LightningElement,api,track,wire } from 'lwc';
//import getGoalResponseList from '@salesforce/apex/GoalTracking.getGoals';
import createGoalTracking from '@salesforce/apex/GoalTracking.createGoalTracking';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import refreshChecklist from "@salesforce/messageChannel/refreshChecklist__c";
import {MessageContext,publish} from 'lightning/messageService';

export default class Mdd_goal_tracking extends NavigationMixin(LightningElement) {
    showModal = false;
    isSubmitDisplay = true;
    goalResult;
    session ;
    @api goal;
    @api goalId;
    @api periodType;
    @api currentWk;
    @api missingWks;
    @api goalNumber;    
    @api performance;
    @api condition;
    @api criterion;
    @api baseline;
    @track error;
    @track isLoading = false;
    @wire(MessageContext)
    context

    question; 
    value;
    isOne;
    isTwo;
    isThree;
    goalWeek;

    index = 0;
    progress = 0;
    valueMap = { "0x per week": "0", "1x per week": "1", "2x per week": "2", "3x per week": "3", "4x per week": "4", "5x per week": "5", "6x per week": "6", "1x per day": "7", "2x per day": "14", "3x per day": "21" };
    isDataChanged = false;    
    isFinal = false;
    isUpdateNextWeek = false;
    isIncomplete=true;
    
    
    get isDisplayReadOnly() {
        return this.isUpdateNextWeek || this.isFinal;
    }

    findOut(){
        //alert('Logic to be added. please contact administrator.');
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Resources__c'
            },
            
        });
    }
    @api 
    showPopUp(){
        //console.log('inside the showPopUp performance:'+this.performance);
        //console.log('inside the showPopUp periodType:'+this.periodType);
        if(this.periodType != 'Session 1')
            this.session = 2;
        else 
            this.session = 1;
        this.goalWeek = this.missingWks[this.index];
        if(this.goalWeek == (this.currentWk - 1))
            this.isIncomplete=false;
        this.goaltext = this.performance + ' ' + this.condition.toLowerCase() + ' this week ';
        //this.question = 'How many times did you ' + this.performance + ' ' + this.condition.toLowerCase() + ' this week ?';
         this.question = 'How often did you engage in this activity this week?';
        this.showModal = true;
        this.isSubmitDisplay = true;
        console.log('Goal--Id'+this.goalId);
    }
    
    hideModal() {
         this.showModal = false;
         this.isLoading = false;
         //eval("$A.get('e.force:refreshView').fire();");
         this.refreshCharts();
    }
    refreshCharts() {
        console.log('firing the refreshCharts from goaltracking');
        this.dispatchEvent(new CustomEvent('refresh_charts',{
            detail:this.isDataChanged,
            bubbles: true, 
            composed : true
        }));
    }
    get options() {
        console.log("baseline",this.baseline);
        let option = [
            {label: '0x per week', value: '0x per week'},
            {label: '1x per week', value: '1x per week'},
            {label: '2x per week', value: '2x per week'},
            {label: '3x per week', value: '3x per week'},
            {label: '4x per week', value: '4x per week'},
            {label: '5x per week', value: '5x per week'},
            {label: '6x per week', value: '6x per week'},
            {label: '1x per day', value: '1x per day'},
            {label: '2x per day', value: '2x per day'},
            {label: '3x per day', value: '3x per day'},
          ]
          var modifiedArray=[];
          option.forEach((each)=>{
              let val = Number((this.valueMap[each.label])/Number(this.baseline))
               let optionObj={label: '', value: ''} 
               optionObj.value=each.value
        if (val*100 <= 50) {
            optionObj.label=each.label+'(50%)'; 
        } else if ((val*100 > 50 && val*100 <= 100)) {
            optionObj.label=each.label+'(100%)';
        } else if ((val*100 > 100 && val*100 <= 150)) {
            optionObj.label=each.label+'(150%)'; 
        } else if ((val*100 > 150 && val*100 <= 200)) {
            optionObj.label=each.label+'(200%)'; 
        } else  {
            optionObj.label=each.label+'(200%)';
        } 
        modifiedArray.push(optionObj);
         
          })
          console.log('testop',option);
        return modifiedArray;
    }
    handleSubmit(event) {
       
        let option = this.template.querySelector(".nameCmp");
        let searchvalue = option.value;
        if (searchvalue == ''||searchvalue == null) {
            option.setCustomValidity("Option value is required");
        } else {
            option.setCustomValidity(""); // clear previous value
            this.value = option.value;
            console.log('Option Value->'+option.value);
            console.log(' Value->'+this.value);
           
            this.SubmitOne();
           
        }
        console.log('Out Side Value->'+this.value);
        option.reportValidity();
        
    }
    SubmitOne(){
        console.log('Walval'+this.value);
        this.isLoading = true;
        this.progress = this.valueMap[this.value];
        //console.log('Progress Value-->'+this.valueMap[this.value]);
        // goalTracking record insertion after every submission of record.
        let goalTracking = { 'sobjectType': 'Goal_Tracking__c' };
        goalTracking.WK__c = this.goalWeek;
        goalTracking.Goal_Response__c = this.goalId;
        goalTracking.Progress__c = this.value;
        goalTracking.Progress_Value__c = this.progress;
       // goalTracking.Goal_Tracking_By_Percentage = (this.progress/baseline)*100;
        console.log('the goal tracking object is'+JSON.stringify(goalTracking));
        createGoalTracking({
            goalTracking : goalTracking
        }).then(result => {
            this.isDataChanged = true;
            this.goalResult = result;
            console.log('Result');
            this.isLoading = false;
            //Publish a message to mdd_checklist component to update the checklist
            const message = {
                saveTransmitter:{
                    value: true
                }
            }
            publish(this.context,refreshChecklist,message);
         }).catch(error => {
                this.error = error;
                console.log('error');
                this.isLoading = false;
                const failedEvent = new ShowToastEvent({
                    title: 'Error!',
                    message: 'Failed to create GoalTracking record',
                    variant: 'error',
                });
                this.dispatchEvent(failedEvent);
            });
        //insertion end
        let val ;
           this.options.forEach(each=>{
               if(each.label.includes(this.value)){
                 val = each.label;
               }
           })
        if(val.includes('0') || val.includes('50')){;
            this.isOne = true;
            this.isTwo = false;
            this.isThree = false;
        }else if(val.includes('100')){
            this.isOne = false;
            this.isTwo = true;
            this.isThree = false;
        }else if(val.includes('150') || val.includes('200')){
            this.isOne = false;
            this.isTwo = false;
            this.isThree = true;
        }
        
        // if(Number(this.progress) >= this.criterion){
        //     this.isOne = true;
        //     this.isTwo = false;
        //     this.isThree = false;
        // }else if((Number(this.progress) >= this.baseline) && (Number(this.progress) < this.criterion)){
        //     this.isOne = false;
        //     this.isTwo = true;
        //     this.isThree = false;
        // }else if(Number(this.progress) < this.baseline){
        //     this.isOne = false;
        //     this.isTwo = false;
        //     this.isThree = true;
        // }
        this.isSubmitDisplay = false;
        this.isUpdateNextWeek = true;
        if(this.goalWeek == (this.currentWk - 1)){
           // this.showSuccessToast();
           this.isUpdateNextWeek = false;
           this.isSubmitDisplay = false;
           this.isFinal = true;
        }
    }
    updateAnotherGoal(){
        this.index = this.index + 1;
        this.goalWeek = this.missingWks[this.index];
      
        //reset of values
        this.value = '';
        this.progress = 0;
        this.isSubmitDisplay = true;
        this.isUpdateNextWeek = false;
        this.isOne = false;
        this.isTwo = false; 
        this.isThree = false;
        if(this.goalWeek == (this.currentWk - 1))
            this.isIncomplete=false;
    }
    showSuccessToast() {
        const event = new ShowToastEvent({
            title: 'Success!',
            message: 'Successfully Goal Tracking Updated.',
        });
        this.dispatchEvent(event);
        this.showModal = false;
        this.isLoading = false;
    }
}