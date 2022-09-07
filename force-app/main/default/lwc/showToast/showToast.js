import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ShowToast extends LightningElement {
    

        @track msg = '';
        showInfoToast(Event) {
            this.msg = Event.target.value;
            const infotoast = new ShowToastEvent({
                title: '@@@@@',
                message: 'sucessfully inserted',
                duration:200,
                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(infotoast);
        }
        showInfoToastwarning() {

            const even = new ShowToastEvent({
        
            title: 'Insert...',
        
            message: 'U are about to reach Governor Limit',
        
            variant: "warning",
        
            duration: 200,
        
            mode: "dismissable"
        
          });
        
          this.dispatchEvent(even);
        
        }
        
        showInfoToastInfo() {
        
          const even = new ShowToastEvent({
        
          title: 'Insert...',
        
          message: 'Hi Srini',
        
          variant: "info",
        
          mode: "dismissable"
        
        });
        
        this.dispatchEvent(even);
        
        }
    }