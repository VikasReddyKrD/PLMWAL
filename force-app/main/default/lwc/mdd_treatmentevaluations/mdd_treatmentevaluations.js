import { LightningElement,wire,track } from 'lwc';
import getListOfValues from '@salesforce/apex/ListOfValuesController.getListOfValues';
import completeTaskFromLWC from '@salesforce/apex/TaskProcessHelper.completeTaskFromLWC';
import getAccountOfUser from '@salesforce/apex/AccountsController.getAccountOfUser';
import uId from '@salesforce/user/Id';

export default class Mdd_treatmentevaluations extends LightningElement {
   
    Urlname = 'TreatmentEvaluation';
    myUrl;
    data;
    error;
    accountId;
    userId = uId;

  
    @wire(getListOfValues,{Name:'$Urlname', Condition:''})
    wiredurl({ error, data }) {
        if (data) {
            this.data = data;
        // console.log('urlList --->>' + this.urlList);
            this.myUrl = this.data[0].Value__c;
        this.error = undefined;
        } else if (error) {
            this.data = undefined;
            console.log('error in Treatment evaluations of Dashboard'+JSON.stringify(error));
            this.error = error;
            //this.error = JSON.parse(error.body.message);
            //console.log('urlList Error--->>'+ JSON.parse(error.body.message));
        }
    }


    @wire(getAccountOfUser, {userId: '$userId'}) 
    wiredAccount({error,data})  {
        if(data)    {
            let acct = JSON.parse(data);
            this.error = undefined;
            this.accountId = acct.id;
            //this.currentWk = acct.currentWk;
            //console.log('Chartcontainer:: userId is:'+this.userId+' the account id:'+this.accountId);
        }
        else if(error)  {
            this.accountId = undefined;
            //this.currentWk = undefined;
            this.error = error;
        }
    }

    handleLinkClick(event)  {
        //event.preventDefault();
        console.log('inside the eventhandler "handleLinkClick" of mdd_treatmentevaluations');

        let tasks =[{'accid':this.accountId, 'weekno':0, 'task_key':'0-Link-1'}];
        let tasksStr = JSON.stringify(tasks);
        //console.log('the input is '+tasksStr);
        completeTaskFromLWC({accountId : this.accountId, tskwrpListStr : tasksStr})
        .then(()=> { console.log('The task has been posted complete successfully'); })
        .catch(error => {this.error = error;});
        
    }


}