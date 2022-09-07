import { api,track, LightningElement } from 'lwc';
import {  loadScript, loadStyle } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartJs';
export default class MddTempDisplayGraph extends LightningElement {

    chartjsInitialized = false;
    goal ={'id':'123', 'title':'Walk the Dog', 'chartData': [1,1,1,3,2], 'bgColor':['GREY','GREY','Teal','GREY','GREY'], 'baseline':5};

     renderedCallback() {
        console.log('the goal data that we received in chartJS in renderedcallback '+ JSON.stringify( this.goal));
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;
        if(this.goal)   {
            this.config = {
            type: 'bar',
            data: {
                datasets: [
                    {
                        data: this.goal.chartData,
                        backgroundColor: this.goal.bgColor,
                        label: 'Tracking Entry'
                    }
                ],
                labels: ['starting point','Halfway towards goal','target','somewhat more than expected','much more than expected'],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                responsiveAnimationDuration:0,
                animation: {
                    duration: 0,
                    onComplete: function() {
                        let ctx = this.chart.ctx;
                        ctx.fillStyle = 'rgba(0, 0, 0)';
                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = "center";
                        ctx.textBaseline = "bottom";
                        
                        let datasetTemp = this.config.data.datasets[0];//.forEach(function (dataset) {
                        let meta = this.chart.controller.getDatasetMeta(0);
                        meta.data.forEach(function(bar, index) {
                            var data = datasetTemp.data[index];
                            console.log("datasetTemp",datasetTemp);
                            console.log("bar._model.y",bar._model.x);
                            ctx.fillText(1, bar._model.x, bar._model.y - 5);
                        });
                    }
                },
                hover: {
                    animationDuration: 0,
                },
                tooltips: {
                    callbacks: {
                        title: function(tooltipItems, data){
                            let xLabel = tooltipItems[0].xLabel;
                            if(tooltipItems[0].datasetIndex === 1)
                                xLabel='';
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
                            precision: 0,  //to avoid 0.5 in scale
                            min:0,
                        },
                        scaleLabel: {
                            display: false,
                            labelString: 'Score'
                        },
                        gridLines: {
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
                            drawBorder: true,
                            lineWidth:0,
                        },
                    }]
                }
            }
            };
        }
        Promise.all([
            loadScript(this, chartjs + '/Chart.min.js'),
            loadStyle(this, chartjs + '/Chart.min.css'),
        ])
        .then(() => {
            try {
            window.Chart.platform.disableCSSInjection = true;
            const canvas = document.createElement('canvas');
            canvas.width = '100%';
            canvas.height='200';
            canvas.role ='img';
            canvas.ariaLabel=this.goal.title;
            canvas.innerText = 'Your browser does not support the canvas element.';
            this.template.querySelector('div.chart').appendChild(canvas);
            const ctx = canvas.getContext('2d');    
            console.log('got the context');            
            this.chart = new window.Chart(ctx, this.config);
            console.log('created the chart ');
            this.error = undefined;
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
}