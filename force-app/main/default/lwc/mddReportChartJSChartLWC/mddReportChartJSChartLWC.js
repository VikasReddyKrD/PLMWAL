import { api,track, LightningElement } from 'lwc';
import {  loadScript, loadStyle } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartJs';
//import chartjsAnnotation from '@salesforce/resourceUrl/chartJsAnnotation';

export default class MddReportChartJSChartLWC extends LightningElement {
    error;
    chart;
    chartjsInitialized = false;
    @api key;

    //@api goal;// ={'id':'123', 'title':'Walk the Dog', 'chartData': [1,1,1,3,2], 'bgColor':[RED,RED,RED,GREEN,GREY]};
    @api goal;
    @api periodType;
    @api currentWk;
    @api accountId;
    @api currentGoalCount;
    @api goalTrackData;
    @api refreshView;
    @track missingWks=[];
    chartDataCal = []; 


    config;
    isDummy;
    isMissingWks;
    isTrackBtnDis;
    context;
     
    renderedCallback() {
        console.log('the goal data that we received in chartJS in renderedcallback '+ JSON.stringify( this.goal));
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;
        if(this.goal)   {
            //console.log('the goal data that we received in chartJS is '+ JSON.stringify( this.goal));
            //console.log('chartJS:: currentGoalCount is '+this.currentGoalCount);
            this.isDummy = this.goal.isDummy ? true: undefined;
            this.isMissingWks = (this.goal.missingWks && this.goal.missingWks.length>0) ? true : undefined;
            this.isTrackBtnDis = (this.isDummy || ! this.isMissingWks)? undefined: true;
            this.missingWks = (this.goal.missingWks)?this.goal.missingWks.map((x)=>x) : [];
            //console.log('is this chart dummy '+this.isDummy + ' isMissingWks:'+this.isMissingWks+' isTrackBtnDis:'+this.isTrackBtnDis);
            //console.log('received data in chartJsLWC '+JSON.stringify(this.goal));
            
            //New code starts for displaying perctenages
            let baseLine =   Number(this.goal.baseline);
            console.log("baseLine",baseLine);
            console.log("chartdata",this.chartData);
             
             this.goal.chartData.forEach(each=>{
                 console.log("testinggggggg",((each/baseLine)*100 ));
                 let val = (each/baseLine)*100;
            if (val<= 50) {
                this.chartDataCal.push(each+'(50%)'); 
            } else if (val>50 && val<=100) {
                this.chartDataCal.push(each+'(100%)'); 
            } else if (val>100 && val<=150) {
                this.chartDataCal.push(each+'(150%)'); 
            } else if (val>150&& val<=200) {
                this.chartDataCal.push(each+'(200%)'); 
            } 
            else{
                this.chartDataCal.push(each+'(200%)');
                
            }
        console.log("this.chartDataCal",this.chartDataCal);
        this.chartDataCal[0]='';
        
     })
     
     

     //New code starts for displaying perctenages
            this.config = {
            type: 'bar',
            data: {
                datasets: [
                    {
                        data: this.goal.chartData,
                        backgroundColor: this.goal.bgColor,
                        //label: 'Goal111'
                        label: 'Tracking Entry'
                    },
                    {
                        data: this.goal.targetLineData,
                        //data: [this.goal.target,this.goal.target,this.goal.target,this.goal.target,this.goal.target,this.goal.target,this.goal.target,this.goal.target,this.goal.target,this.goal.target,this.goal.target,this.goal.target,this.goal.target],
                        /*data: [{
                                x: 'wk 0',
                                y: 3
                            }, {
                                x: 'wk 12',
                                y: 3
                        }],*/
                        type: 'line',
                        fill: false,
                        //lineTension: 0
                        pointRadius:2,
                        label: 'Target',
                        spanGaps: true,
                        borderColor: '#F2994A',  //Orange
                        backgroundColor: '#F2994A',  //Orange
                    }
                ],
                labels: ['Base', 'wk 1', 'wk 2', 'wk 3', 'wk 4', 'wk 5','wk 6', 'wk 7', 'wk 8', 'wk 9', 'wk 10', 'wk 11','wk 12'],
                percentages:this.chartDataCal//.reverse()
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                responsiveAnimationDuration:0,
                //showToolTips: false,
                animation: {
                    duration: 0,
                    onComplete: function() {
                        //to show the numbers above the bar chart
                        let ctx = this.chart.ctx;
                        //console.log('the ctx inside animation is '+JSON.stringify(ctx));
                        ctx.fillStyle = 'rgba(0, 0, 0)';
                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = "center";
                        ctx.textBaseline = "bottom";
                        
                        let datasetTemp = this.config.data.datasets[0];//.forEach(function (dataset) {
                        let percentages = this.config.data.percentages;
                        let meta = this.chart.controller.getDatasetMeta(0);
                        //console.log("meta in",JSON.stringify(meta));
                        
                        meta.data.forEach(function(bar, index) {
                            var data = datasetTemp.data[index];
                            console.log("datasetTemp",datasetTemp);
                            console.log("bar._model.y",bar._model.x);
                            ctx.fillText(percentages[index], bar._model.x, bar._model.y - 5);
                        });
                        //this.config.options.animation.onComplete= null;  //making reference to null so it does not animate on the mouse hover again and again
                    }
                },
                hover: {
                    animationDuration: 0,
                },
                tooltips: {
                    callbacks: {
                        title: function(tooltipItems, data){
                            //console.log('Before tooltips are'+JSON.stringify(tooltipItems));
                            let xLabel = tooltipItems[0].xLabel;
                            if(tooltipItems[0].datasetIndex === 1)
                                xLabel='';
                            //console.log('After tooltips are'+JSON.stringify(tooltipItems));
                            return xLabel;
                        }
                    }
                },
                title: {
                    display : true,
                    text: this.goal.title,
                    position: 'top',
                    fontSize: 16,
                    padding: 20
                },
                legend: {
                    display: false,
                    position: 'bottom'
                },
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero : true,
                            //stepSize: 1,  //always making it to size =1(to avoid 0.5) always, not able to scale up automatically
                            precision: 0,  //to avoid 0.5 in scale
                            min:0,
                            //max:5   //allowing the graph to scale up based on the values
                        },
                        scaleLabel: {
                            display: false,
                            labelString: 'Score'
                        },
                        gridLines: {
                            //display: false,  //also losing axis line
                            drawBorder: true,
                            lineWidth:0,
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: 'Week'
                        },
                        gridLines: {
                            //borderColor:'rgba(0, 0, 0,1)',
                            //display: false,  //also losing Axis line
                            drawBorder: true,
                            lineWidth:0,
                        },
                    }]
                }
            }
            };
        }
        Promise.all([
            //loadScript(this, chartjs),
            //loadScript(this, chartjs + '/chart310.min.js'),
            //loadScript(this, chartjs + '/chart_Krishna.js'), *************
            //loadScript(this, chartjs + '/chartjs-plugin-annotation057.js'), 
            //loadScript(this, chartjs + '/chartjs-plugin-annotation057.min.js'),
            //loadStyle(this, chartjs + '/Chart.min.css')
            //console.log('after loading the javascript chart_krishna'),
            loadScript(this, chartjs + '/Chart.min.js'),
            loadStyle(this, chartjs + '/Chart.min.css'),
        ])
        .then(() => {
            try {
            //console.log('inside the JAVASCRIPT LOAD of Chart JS');
            // disable Chart.js CSS injection   
            window.Chart.platform.disableCSSInjection = true;
            const canvas = document.createElement('canvas');
            canvas.width = '100%';
            canvas.height='200';
            //canvas.style.minWidth = '360px';
            //canvas.style.display = 'inline-block';
            //canvas.style.position = 'relative';
            canvas.role ='img';
            canvas.ariaLabel=this.goal.title;
            canvas.innerText = 'Your browser does not support the canvas element.';
            //console.log('before createing chart');
            this.template.querySelector('div.chart').appendChild(canvas);
            //console.log('canvas added');
            const ctx = canvas.getContext('2d');    
            console.log('got the context');            
            this.chart = new window.Chart(ctx, this.config);
            console.log('created the chart ');
            this.error = undefined;
            //this.chart.update(0);  we need to use this if charts does not reload when revisiting the pages
            this.context = ctx;
            }
            catch(error)    {
                
                console.log('Encountered error while loading the Chart'+error);
                this.error = error;
            }
        })
        .catch((error) => {
            this.error = error;
        });
    }

    disconnectedCallback(){
        console.log('inside the disconnectedCallback');
        this.chartjsInitialized = false;
        this.chart = undefined;
    }

    @api 
    isDummyValue(){
        return this.isDummy;
    }

    @api downloadChart()    {
        //console.log('inside downloadChart of '+this.goal.Performance);
        console.log('Is this dummy:'+this.isDummy);
        let bs64Img;
        if(! this.isDummy)  {
            bs64Img =this.context.getImageData(0,0,this.chart.width,this.chart.height);
            //bs64Img =this.context.getImageData(0,0,1200,600);
            let bs64Image = this.chart.toBase64Image();
            
            console.log('chart width:'+this.chart.width+' chart height:'+this.chart.height);
            console.log('bs64Image width:'+bs64Image.width+' bs64Image height:'+bs64Image.height);
            /*var a = document.createElement('a');
            a.href = this.chart.toBase64Image();
            //bs64Img = this.chart.toBase64Image();
            a.download = this.goal.Performance + '.png';
            // Trigger the download
            a.click();*/
            
        }
        return bs64Img;
    }
    
     @api openGoalSettingModal(){
        //this.template.querySelector("c-mdd_content_main").getallQuestions();
        this.template.querySelector("c-mdd_content_main").openModalPopup();
    }
    handleTrackClick(){
        //console.log('Track Click:'+this.goal.Performance);
        this.template.querySelector("c-mdd_goal_tracking").showPopUp();
    }
    refreshHandler(){
        eval("$A.get('e.force:refreshView').fire();");
    }
}