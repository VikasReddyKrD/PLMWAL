import { LightningElement,wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import getStatusOfSurveys from '@salesforce/apex/SurveyController.getStatusOfSurveys';
import uId from '@salesforce/user/Id';
// import refreshChecklist from "@salesforce/messageChannel/refreshChecklist__c";
// import {MessageContext,publish} from 'lightning/messageService';

export default class Sidenavleft extends NavigationMixin(LightningElement) {
  supportClass;
  currentPageReference;
  currentUrl;
  userId = uId;
  survey1Status = true;
  error;
  // isLoading=false;
  // @wire(MessageContext)
  //   context
  connectedCallback(){
    console.log('In cb of sidenavleft');
    console.log('Name is '+this.currentPageReference.attributes.name);
    
    // this.isLoading = true;
  }

   @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
      // this.isLoading = false;
      console.log("currentPageReference in", currentPageReference);
        this.currentPageReference = currentPageReference;
        this.updateArrow(); //wire is refreshed when moving from one page to another
    }  
    updateArrow() {
      if(this.currentPageReference) {
        let pageRef = this.currentPageReference;
       
        console.log('name'+pageRef.attributes.name);
        console.log('pageRef.type---'+pageRef.type);
        
        let arrowAtr = pageRef.attributes.name;
        console.log('Page name is '+arrowAtr);

        console.log('Survey status in update arrow is '+this.survey1Status);
        console.log('User id in updatearrow is '+this.userId);
         /* getStatusOfSurveys({ userId : this.userId})
             .then((result) => {
              // this.isLoading = false;
              console.log('Inside navigation loop result::'+JSON.stringify(result));
              this.survey1Status = result['MDD-Survey-1'];
              console.log('survey1status is '+this.survey1Status);
              if(arrowAtr === 'Home' && !this.survey1Status ){
                console.log('Inside navigation loop');
                const custEvent = new CustomEvent('dummy');
                //this.handleClickSurveys(custEvent);
                return;
              }
              // else if(arrowAtr === 'Home'){
              //   const message = {
              //     saveTransmitter:{
              //         value: true
              //     }
              // }
              // publish(this.context,refreshChecklist,message);
              // }
              this.error = undefined;
            })
            .catch((error) => {
              this.error = error;
              this.survey1Status = undefined;
            }); */
        if((arrowAtr == "MDD_Survey1__c") || (arrowAtr == "MDD_Survey2__c") || (arrowAtr == "MDD_Survey3__c")) arrowAtr = "Surveys__c";
        console.log('arrowAtr--'+arrowAtr);
        
        if(pageRef.type === 'comm__namedPage' ) {
          if(this.template.querySelector('.yah'))
            this.template.querySelector('.yah').classList.remove('yah');
          if(this.template.querySelector(`[data-id=${arrowAtr}]`))
            this.template.querySelector(`[data-id=${arrowAtr}]`).classList.add('yah');  
        }
        
      }
    }

    /* navigateFromHomeToSurvey = () =>{
      this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'Surveys__c'
        },
    });
    } */
    renderedCallback() {
      console.log('inside renderedcallback');
      this.updateArrow();  //when the browser is loaded either first time or after refresh
    }

    handleClickdashboard(event) {
      this[NavigationMixin.Navigate]({
          type: 'comm__namedPage',
          attributes: {
              name: 'Home'
          },
      });
  }

  handleClickGoals(event) {
    this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'Goals__c'
        },
    });
  }
  handleClickSurveys(event) {
    this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'Surveys__c'
        },
    });
}

handleClickResources(event) {
  this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
          name: 'Resources__c'
      },
  });
}

handleClickSupport(event) {
  this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
          name: 'Support__c'
      },
  });
}

}