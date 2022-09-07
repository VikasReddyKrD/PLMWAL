import { LightningElement,api } from 'lwc';
import DocImage from '@salesforce/resourceUrl/DocImage';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';

export default class VideoPlayer extends NavigationMixin(LightningElement) {

    DocImage = DocImage;
    @api showVideoTemplate;
    showthankscard=false;
    
    showVideo(){
  
        this.showVideoTemplate=true;
        

    }

    hideVideoModal(){
    this.showVideoTemplate=false;
    this.showthankscard=true;
    
     
    }

    submitDetails(){
   // window.location.href = "https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/";
        this[NavigationMixin.Navigate]({
          type: 'comm__namedPage',
          attributes: {
              name: 'Home'
            
          }
      });
    }

    closeModal(){
        this.showVideoTemplate=true;
        this.showthankscard=false;   
    }

    closeThanksModal(){
        //window.location.href = "https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys";  
        this[NavigationMixin.Navigate]({
          type: 'comm__namedPage',
          attributes: {
              name: 'MDD_Dashboard__c'
          }
      }); 
    }



}