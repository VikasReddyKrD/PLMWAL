import { LightningElement ,track,wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFeedback from '@salesforce/apex/Feedbackform.feedback';
import insertFeedback from '@salesforce/apex/Feedbackform.insertFeedback';

export default class Feedback extends LightningElement {

  data = [];
  @track feedbackdata;
  @track CustomerName;


  @wire(getFeedback)
getStatus({ error,data }) {
    if (data) {
        this.feedbackdata = data;
        console.log(JSON.stringify(this.coaches));
     }else{
         this.error = error;
         console.log('error==>'+JSON.stringify(this.error));
     }
}
handlecomments(event){
  const newRecord = {};
    this.feedbackdata.forEach(ele=>{
      if(ele.Id === event.target.dataset.name){
        newRecord.Id = ele.Id;
        newRecord.Question__c = ele.Question__c;

        newRecord.answer__c = event.target.value;

      }
    });
    console.log(this.data && this.data.length > 0);
    if(this.data.some(action => action.Id === event.target.dataset.name)){
      this.data.forEach(ele=>{
        if(ele.Id ===event.target.dataset.name){

          ele.answer__c = event.target.value;
        }
      })
    }else{
      this.data.push(newRecord);
    }
}

SaveMDT(){
  insertFeedback({feebacklist : this.data,Candidatenm:this.CustomerName, SPOC:this.CustomerSPOC, ModeDel:this.ModeOfDelivery, DelAdd:this.DeliveryAddress, DelItemDesc:this.ItemDescription, PoRef:this.POREF, DelDate:this.DeliveryDate})
  .then(result => {
    const event = new ShowToastEvent({
        title: 'Contact created',
        message: 'New Contact ',
        
        variant: 'success'
    });
    this.dispatchEvent(event);
})
.catch(error => {
    const event = new ShowToastEvent({
        title : 'Error',
        message : error,
        variant : 'error'
    });
    this.dispatchEvent(event);
});
}
handleNameChange(event)
{
this.CustomerName=event.detail.value; 
}
handleSPOCChange(event)
{
this.CustomerSPOC=event.detail.value; 
}
handleDELIVERChange(event)
{
this.ModeOfDelivery=event.detail.value; 
}
handleADDRESSChange(event)
{
this.DeliveryAddress=event.detail.value; 
}
handleITEMChange(event)
{
this.ItemDescription=event.detail.value; 
}
handlePOREFChange(event)
{
  
this.POREF=event.detail.value; 
}
handleDELDATEChange(event)
{
this.DeliveryDate=event.detail.value; 
}
}