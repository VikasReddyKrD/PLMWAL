import { LightningElement,api,track,wire } from 'lwc';
import getListOfValues from '@salesforce/apex/ListOfValuesController.getListOfValues';
import getAccountOfUser from '@salesforce/apex/AccountsController.getAccountOfUser';
import completeTaskFromLWC from '@salesforce/apex/TaskProcessHelper.completeTaskFromLWC';
import { NavigationMixin } from 'lightning/navigation';
import uId from '@salesforce/user/Id';
import refreshChecklist from "@salesforce/messageChannel/refreshChecklist__c";
import {MessageContext,publish} from 'lightning/messageService';
import pdfimage from '@salesforce/resourceUrl/pdfimage';
import faqs from '@salesforce/resourceUrl/Takeda_MDD_FAQ';
import setGoals from '@salesforce/resourceUrl/SetGoals';

export default class Mdd_studyresources extends NavigationMixin(LightningElement) {
    theIframe;
    setGoals = setGoals;
    @api isReloaded = false;
    Urlname = 'StudyResource';
    myUrl;
    userId = uId;
    accountId;
    currentWk;
    session
    data;
    error;
    description;
    @wire(MessageContext)
    context
    taskKey;
    pdfimage = pdfimage;
    dummyPdf = faqs;
    @wire(getAccountOfUser, {userId: '$userId'}) 
    wiredAccount({error,data})  {
        if(data)    {
            console.log('Inside account');
            let acct = JSON.parse(data);
            this.error = undefined;
            this.accountId = acct.id;
            // this.currentWk = (acct.currentWk >=  '13')? '13' : acct.currentWk ;
            this.session = (acct.isSurvey2Complete)? 2 : 1;
            console.log('session is '+this.session);
            this.currentWk = (this.session === 2) ? acct.currentWk_sess2 : acct.currentWk ;
            console.log('Current week in SR before is '+this.currentWk);
            this.currentWk = (Number(this.currentWk) >=  Number('13'))? '13' : this.currentWk ;
            console.log('Current week (sr comp) is '+this.currentWk);
            this.taskKey = this.session + '-' +this.currentWk;  
            console.log('Task key is '+this.taskKey);   
        }
        else if(error)  {
            this.accountId = undefined;
            this.currentWk = undefined;
            this.error = error;
        }
    }

    @wire(getListOfValues,{Name:'$Urlname', Condition:'$taskKey'})
    wiredurl({ error, data }) {
        if (data) {
            console.log('data for currentweek'+this.currentWk);
            this.data = data;
            //console.log('urlList in Dashboardvideo --->>'+ this.data );
            this.myUrl = this.data[0].Value__c;
            this.description = this.data[0].Description__c; //This has the video name
            this.error = undefined;
        } else if (error) {
            console.log('error in dashboardVideo');
            this.error = error;
            this.data= undefined;
  
        }
    }
    handleClickResources(event) {
        //console.log('inside the StudyResources handleClickResources');
         this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Resources__c'
            }
        }); 
    }

    //pauseallvideos is the event triggered by child component(when it is playing the video) to the parent component
    //here we are capturing this event to mark the task as complete
    handlePausePlaying(event)   {
        console.log('inside the handlePausePlaying of mdd_studyResources');
        let tasks =[{'accid':this.accountId, 'weekno':0, 'task_key':'1-0-Video-1'}];
        let tasksStr = JSON.stringify(tasks);
        //console.log('the input is '+tasksStr);
        completeTaskFromLWC({accountId : this.accountId, tskwrpListStr : tasksStr})
        .then(()=> { 
            console.log('The task has been posted complete successfully'); 
            //Publish a message to mdd_checklist component to update the checklist
            const message = {
                saveTransmitter:{
                    value: true
                }
            }
            publish(this.context,refreshChecklist,message);
        })
        .catch(error => {this.error = error;});
    }


    /*  //pauseallvideos is the event triggered by child component to the parent component
        // we do not need this event handling as we are having single video
    pausePlayingVideos(event) {   
        let youTubeId = event.detail;
        let allPlayers = this.template.querySelectorAll('c-basic-you-tube-player');
        allPlayers.forEach((player) => {
            if(player.currentlyplaying && player.youTubeId != youTubeId){
                player.pauseVideo();
            }
        });
    }*/

    handleVideoClick(event) {
        console.log('inside the StudyResources handleVideoClick');
    }


    
   /* renderedCallback() {
        console.log('rendred callback called' + this.theIframe);
        if(this.theIframe==undefined){
            this.theIframe =  this.template.querySelector('iframe');
            this.theIframe.onload = ()=>{
                console.log('Onload called'+this.isReloaded);

                if(!this.isReloaded){
                    this.isReloaded = true;
                    this.theIframe.src = this.theIframe.src ;

                }
            }
        }   

    }  */

        
}