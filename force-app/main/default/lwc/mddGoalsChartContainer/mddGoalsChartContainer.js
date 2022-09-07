import { LightningElement, wire, api } from 'lwc';
import getAccountOfUser from '@salesforce/apex/AccountsController.getAccountOfUser';
import getGoalsChartData from '@salesforce/apex/GoalsController.getGoalsChartData';
import { NavigationMixin,CurrentPageReference  } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import YourTargetIcon from '@salesforce/resourceUrl/icontimeline';
import uId from '@salesforce/user/Id';
import refreshChecklist from "@salesforce/messageChannel/refreshChecklist__c";
import {MessageContext,publish} from 'lightning/messageService';
import getSurveyStatus from '@salesforce/apex/SurveyController.getStatusOfSurveys';

export default class MddGoalsChartContainer extends NavigationMixin(LightningElement) {
    //weeks1to12 = ['wk0', 'wk1', 'wk2', 'wk3', 'wk4', 'wk5','wk6', 'wk7', 'wk8', 'wk9', 'wk10', 'wk11','wk12'];
    /*goals=  [{'id':'123', 'title':'Walk the Dog', 'chartData': [1,1,1,3,2], 'bgColor':[RED,RED,RED,GREEN,GREY]},
                            {'id':"234", 'title':'Reduce Sleep Time', 'chartData': [1,2,3,4,1], 'bgColor':[RED,RED,GREY,GREEN,RED]},
                            {'id':"345", 'title':'Book Reading', 'chartData': [1,4,3,5,2], 'bgColor':[RED,GREEN,GREY,GREEN,RED] },
                        ];*/
    yourtargeticonUrl = YourTargetIcon;
    userId = uId;
    accountId;
    currentWk;
    periodType ='Session 1';
    isSession1Dis = true;
    isSession2Dis = true;
    isDownloadDis = true;
    isDownloadProDis = false;
    variant1 = 'neutral';
    variant2 = 'neutral';
    currentActualGoals;
    isSurvey2Complete = false;
    session1Wk;
    session2Wk;
    goals;
    goalsData;  //to hold the data received from wired function and helps in refreshApex
    error;
    reloadChartView = 1;
     @wire(MessageContext)
    context;
    accountData;
    //@track ctxt;
    errorStatus;
  

    @wire(CurrentPageReference)
    wiredPageRef() {
        //this.loading = false;
        console.log('before refresh in wiredPageRef');
        refreshApex(this.accountData);
        refreshApex(this.goalsData);
        console.log('after refresh in wiredPageRef');
    }

    @wire(getAccountOfUser, {userId: '$userId'})
    wiredAccount(result)  {
        this.accountData = result;
        const {data,error} = result;
        if(data)    {
            console.log('Account data from goalschartcontainer '+data);
            let acct = JSON.parse(data);
            this.error = undefined;
            this.accountId = acct.id;
            //this.currentWk = acct.currentWk;
            this.session1Wk = acct.currentWk;
            this.session2Wk = acct.currentWk_sess2;
            //this.isSurvey2Complete = (acct.isSurvey2Complete)?acct.isSurvey2Complete : false;
            //this.currentWk = (this.isSurvey2Complete)?   : ;
            getSurveyStatus({userId: this.userId})
            .then((result) =>{
                console.log('Inside Imperative ');
                this.isSurvey2Complete = result['MDD-Survey-2'];
                this.errorStatus = undefined;
                console.log('Survey 2 complete '+this.isSurvey2Complete);
                if(! this.isSurvey2Complete)  { //if survey2 not completed then only session 1
                    this.isSession1Dis = false;
                    this.isSession2Dis = true;
                    this.session1Clicked();
                }
                else {   //both buttons are enabled
                    this.isSession1Dis = false;
                    this.isSession2Dis = false;
                    this.session2Clicked();
                }
            })
            .catch((error) =>{
                this.isSurvey2Complete = undefined;
                this.errorStatus = error;
            })
            //if(this.currentWk >=0 &&  this.currentWk <13) {
            // if(! this.isSurvey2Complete)  { //if survey2 not completed then only session 1
            //     this.isSession1Dis = false;
            //     this.isSession2Dis = true;
            //     this.session1Clicked();
            // }
            // else    {   //both buttons are enabled
            //     this.isSession1Dis = false;
            //     this.isSession2Dis = false;
            //     this.session2Clicked();
            // }
            console.log('Chartcontainer:: userId is:'+this.userId+' the account id:'+this.accountId+' currentWk is:'+this.currentWk + ' periodType is:'+this.periodType);
        }
        else if(error)  {
            this.accountId = undefined;
            this.currentWk = undefined;
            this.error = error;
        }
    }
    //@wire(getGoalsChartData,{accountId: '$accountId', period:'$periodType', currentWk:'$currentWk', reloadView:'$reloadChartView'})
    @wire(getGoalsChartData,{accountId: '$accountId', period:'$periodType', currentWk:'$currentWk'})
    wiredGoals(value){
    //wiredGoals({error, data}){
        console.log('inside the wiredGoals methods response processing');
        this.goalsData  = value;  //hold on to provisioned value so it can help refresh Apex later
        const {data, error} = value;  //destructure the provisioned value

        let actualGoals=0;
        let emptyGoalsNeeded=0;
        let goalsTemp;

        if(error)  {
            this.goals = undefined;
            this.error = error;
            console.log('Chartcontainer.wiredGoals:the error is '+ error.message);
        }
        if(data)    {
            this.error = undefined;
            //this.goals = undefined;
            //goalsTemp = data.map((goal) => goal);//JSON.parse(data);
            //goalsTemp = JSON.parse(JSON.stringify(data));
            goalsTemp = JSON.parse(data);
           /*  console.log("goalsTemp",JSON.parse(data))
            let baseLine=   Number(goalsTemp[0].baseline);
             let chartDataCal = []; 
             goalsTemp[0].chartData.forEach(each=>{
            if (((each/baseLine)*100 )<= 50) {
                chartDataCal.push(50); 
            } else if (((((each/baseLine) >= 50)*100) && ((each/baseLine)*100 <= 100))) {
                chartDataCal.push(100); 
            } else if (((((each/baseLine) >= 100)*100) && ((each/baseLine)*100 <= 150))) {
                chartDataCal.push(150); 
            } else if (((((each/baseLine) >= 150 )*100)&& ((each/baseLine) *100 <= 200))) {
                chartDataCal.push(200); 
            } else  {
                chartDataCal.push(200);
            } 
        
        
     })
     goalsTemp[0].chartData=chartDataCal;
     console.log('testchart', goalsTemp[0].chartData); */
            goalsTemp = goalsTemp.map((goal) => goal); //cloning object so we can add dummy items to this list

            console.log('Chartcontainer.wiredGoals: the chartdata received is '+ data);
            actualGoals = goalsTemp.length;
            this.currentActualGoals = actualGoals;
            if(actualGoals <=0){
                this.isDownloadDis = true;
            }
            else{
                this.isDownloadDis = false;
            }

            emptyGoalsNeeded = 3 - actualGoals;
            console.log('needed emptygoals #'+emptyGoalsNeeded +' currentwk:'+this.currentWk+' periodType:'+this.periodType);

            //let finalGoals =[];
            //if(((this.currentWk === '1' || this.currentWk === '0')  && this.periodType === 'Session 1') ||( this.currentWk === '13' && this.periodType === 'Session 2'))  {
            if(this.currentWk === '1' || this.currentWk === '0') {//in both session 1 and session 2
                if(emptyGoalsNeeded > 0 )  {
                    //let emptyGoalStr = '{"isDummy":"true","title":"","target":"0","id":"DUMMY","chartData":[],"bgColor":[]}';
                    let emptyGoalStr = '{"isDummy":"true","title":"","targetLineData":[],"id":"DUMMY","chartData":[],"bgColor":[]}';
                    console.log('emptygoalStr is'+emptyGoalStr);

                    for(let i=1; i<=emptyGoalsNeeded; i++)  {
                        let emptyGoalObj = JSON.parse(emptyGoalStr);
                        emptyGoalObj.goalNum= actualGoals + i;
                        goalsTemp.push(emptyGoalObj);
                    }
                }
            }
            //console.log('finalGoals:'+JSON.stringify(finalGoals));
            console.log('goalsTemp:'+JSON.stringify(goalsTemp));
            //this.goals = goalsTemp;//goalsTemp;
                goalsTemp.forEach(each=>{
                    each.title=each.title.split('(')[0];
                })        
            this.goals = JSON.parse(JSON.stringify(goalsTemp));
            //goalsTemp = goalsTemp.map(gl => Object.assign({}, gl));
            //this.goals = {data: goalsTemp};
            console.log('Earlier the value of reloadChartView is '+ this.reloadChartView);
            this.reloadChartView = goalsTemp.reduce((total,temp)=> total+temp.chartData.length, goalsTemp.length);
            console.log('Later the value of reloadChartView is '+ this.reloadChartView);
            // const message = {
            //         saveTransmitter:{
            //             value: true
            //         }
            //     }
            //     publish(this.context,refreshChecklist,message);
        }

    }
    session1Clicked()   {
        this.periodType = 'Session 1';
        this.variant1 = 'brand-outline';
        this.variant2 = 'neutral';
        this.currentWk = this.session1Wk;
    }
    session2Clicked()   {
        this.periodType = 'Session 2';
        this.variant1 = 'neutral';
        this.variant2 = 'brand-outline';
        this.currentWk = this.session2Wk;
    }
    handleGoalsButton(event)    {
        let clickedButtonLabel = event.target.label;
        if(clickedButtonLabel === 'Session 1')
            this.session1Clicked();
        else
            this.session2Clicked();
        console.log('handleGoalsButton:: current period='+this.periodType );
    }

    @api
    downloadCharts(event)   {
        try {
            const chartObjs = this.template.querySelectorAll('c-mdd-report-chart-j-s-chart-l-w-c');
            // this.template.querySelectorAll('c-pro-results').forEach(each=>{ each.className ='slds-no-print'})
            // window.print();

        let paramData = 'slds-no-print';
        let ev = new CustomEvent('childmethod', 
                                 {detail : paramData}
                                );
            this.dispatchEvent(ev);  

            /*let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
            mywindow.document.write('<html><head><title>MY Goals</title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write('<p>Hello, ready to print?</p>');
            for(let i=0;i<chartObjs.length; i++)   {
                let img=chartObjs[i].downloadChart();
            }
            //mywindow.document.write(document.getElementById(divId).innerHTML);
            mywindow.document.write('</body></html>');*/
        }
        catch(error)    {
            console.error('Error occured while downloading the chart: '+error.message);
        }
    }
    downloadPros(event){
        try {
            this.template.querySelectorAll('c-mdd-report-chart-j-s-chart-l-w-c').forEach(each=>{ each.className ='slds-no-print'})
            const chartObjs = this.template.querySelectorAll('c-pro-results').forEach(each=>{ each.className =''});

            window.print();
        }
        catch(error)    {
            console.error('Error occured while downloading the chart: '+error.message);
        }
    }
    /*downloadCharts(event)   {
        try {
        const chartObjs = this.template.querySelectorAll('c-mdd-report-chart-j-s-chart-l-w-c');
        //let imgs =[];
        let cnvs = document.createElement('canvas');
        cnvs.width = 700;
        cnvs.style.width='100%';
        cnvs.height = 220* this.currentActualGoals;
        cnvs.style.height = "auto";
        //cnvs.height = 'auto';
        let ctx=cnvs.getContext("2d");
        //ctx.scale(0.5,0.5);
        this.template.querySelector('div.chart').appendChild(cnvs);
        let height =20;
        for(let i=0;i<chartObjs.length; i++)   {
            let img=chartObjs[i].downloadChart();
            //img.style.transform = "scale(0.2,0.2)";
            console.log('image width:'+img.width+' image height:'+img.height);
            if(img) {
                //cnvs.style.transform = "scale(0.1,0.1)";
                ctx.putImageData(img, 0,height,0,0,600,200);
                height += 220;

                //let imge = document.createElement('img');
                //
                //    imge.src=img;
                //    imge.onload= function() {
                //        //imge.style.transform = "scale(0.2,0.2)";
                //        console.log('image width:'+imge.width+' image height:'+imge.height);
                 //       ctx.scale(0.8,0.5);

                //        ctx.drawImage(imge,0,0);

                //        //y = y+10+ img.height;
                //        let a = document.createElement('a');
                //        a.href = cnvs.toDataURL('image/png');
                //        let dt= new Date();
                //        a.download =  'Goals_'+dt.getMonth()+'-'+dt.getDate()+'-'+dt.getFullYear()+'.png';
                        // Trigger the download
                //        a.click();
                //    }

            }


        }
        let a = document.createElement('a');
        a.href = cnvs.toDataURL('image/png');
        let dt= new Date();
        a.download =  'Goals_'+dt.getMonth()+'-'+dt.getDate()+'-'+dt.getFullYear()+'.png';
        // Trigger the download
        a.click();
        //ctx.clearRect(0, 0, cnvs.width, cnvs.height);
        }
        catch(error)    {
            console.log('encountered error while downloading the chart '+error);
        }
    }*/


    handleRefreshCharts(event) {
        console.log('Inside the Chart container--refreshCharts '+event);
       console.log('Inside the Chart container--refreshCharts '+event.detail);
       //console.log('stringfiedversionof event is '+ JSON.stringify(event));
       const isDataChanged = event.detail;
       //this.reloadChartView = this.reloadChartView + 1;
        if(isDataChanged)   {

            this.goals = undefined;    //to force the container to pass data to child chartJS objects when reloaded
            console.log('inside the refresh and datachnaged commented out');
        }
       refreshApex(this.goalsData);
       //this.reloadChartView = this.reloadChartView + 1;

     }

    @api
      handleChildFromDashboard(event){
         console.log("inside the testing",this.template.querySelectorAll('c-mdd-report-chart-j-s-chart-l-w-c').length);
         let childs = this.template.querySelectorAll('c-mdd-report-chart-j-s-chart-l-w-c');
         for(let i=0;i<childs.length;i++){
                if(childs[i].isDummyValue()){
                    childs[i].openGoalSettingModal();
                    break;
                }

         }
     } 

}