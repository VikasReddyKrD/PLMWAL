import { LightningElement, api} from 'lwc';
import completeTaskFromLWC from '@salesforce/apex/TaskProcessHelper.completeTaskFromLWC';

export default class MddVideoPopup extends LightningElement {
    myUrl;
    taskKey;
    accountId;
    doPlayVideo = false;
    isCompletedSuccess=false;

    handlePausePlaying()    {
        console.log('inside the comp- mddVideoPopup: handlePausePlaying');
        let tasks =[{'accid':this.accountId, 'weekno':0, 'task_key':this.taskKey, 'session':0}];
        let tasksStr = JSON.stringify(tasks);
        console.log('the input is '+tasksStr);
        completeTaskFromLWC({accountId : this.accountId, tskwrpListStr : tasksStr})
        .then(()=> { 
            console.log('The task has been posted complete successfully'); 
            this.isCompletedSuccess = true;
            
            //this.dispatchEvent(new CustomEvent('refreshtasksfromvideopop',{}));
        })
        .catch(error => {this.error = error; console.log('error occured while posting the task as complete'+ e.message);});
    }
    @api
    playVideo(url,key, accountId) {
        console.log('inside playvideo of mddVideoPopup');
        console.log('the url is '+this.myUrl);
        this.doPlayVideo = true;
        console.log('key in videoPopup is '+this.taskKey);
        this.myUrl = url;
        this.taskKey = key;
        this.accountId = accountId;
    }
    hideModal(event)    {
        this.dispatchEvent(new CustomEvent('refreshtasksfromvideopop',{}));
        this.isCompletedSuccess=false;
        this.doPlayVideo = false;
        this.taskKey=undefined;
        this.myUrl = undefined;
        this.accountId = undefined;
    }

}