import { LightningElement,api } from 'lwc';
// import refreshChecklist from "@salesforce/messageChannel/refreshChecklist__c";
// import {MessageContext,publish} from 'lightning/messageService';
import {  NavigationMixin } from 'lightning/navigation';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';


export default class alphaSurveyFlowButtons extends NavigationMixin(LightningElement) {

    @api finishPage;
    @api isNextPage;
    @api isAlpha1;
    // @wire(MessageContext)
    // context;
   
    handleClick(event)  {
        //alert("isAlpha1" + this.isAlpha1);
        console.log('the target name is '+event.target.name);
        
        /*this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            },
        });*/
        if(this.finishPage != '' && this.finishPage)    {
            const pageDetails = JSON.parse(this.finishPage);
            if(pageDetails.type ==="comm__namedPage" && !(this.isAlpha1))   {
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: pageDetails.nameorurl,
                    },
                });
            }
            else if (pageDetails.type ==="standard__webPage" && !(this.isAlpha1))   {
                /*  //this commented code is opening the webpage in new window instead of same window
                this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: {
                        url: pageDetails.nameorurl,
                    },
                },
                true  //replaces the history
                );*/
                window.open(pageDetails.nameorurl,"_self");
            }
            else if(!this.isAlpha1) {
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'Home'
                    },
                });
            }
            else if(this.isAlpha1) {
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'disclosure__c'
                    },
                });
            }
            else  {
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: pageDetails.nameorurl,
                    },
                });
            }
        } 
        else   {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Home'
                },
            });
        }

        // const message = {
        //         saveTransmitter:{
        //             value: true
        //         }
        //     }
        //     publish(this.context,refreshChecklist,message);
    }
    handleNext(){
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        
    }
}