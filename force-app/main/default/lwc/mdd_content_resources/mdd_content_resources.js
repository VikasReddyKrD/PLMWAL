import { LightningElement,wire } from 'lwc';
//import getListOfValues from'@salesforce/apex/ListOfValuesController.getListOfValues';
import getVideosandDocs from '@salesforce/apex/ListOfValuesController.getVideosandDocs';
import pdfimage from '@salesforce/resourceUrl/pdfimage';
export default class Mdd_content_resources extends LightningElement {

    resources = 'Resources'; 
    docsResource = "ResourceDocs";
    pdfimage = pdfimage;
   // Urlcondition ='3';
   videosList;
   docsList;

    /*@wire(getListOfValues,{Name:'$videoResource'})
    wiredurl({ error, data }) {
        if (data) { 
            console.log('data');
            //this.urlList = data;
            //console.log('UrlList'+ JSON.stringify(this.urlList));
           
            this.videosList = data.map((url, index) => {
                console.log('the value of urldescription is '+url.Description__c);
                let description = (url.Description__c)?JSON.parse(url.Description__c): undefined;
                //console.log('title is '+description.title);
                //console.log('actual title is '+url.Description__c.title);
                let urlTransformed= {
                    id: url.Id,
                   value: url.Value__c,
                   title: (description)? description.title: '',
                   desc: (description)? description.desc: ''
                }
                return urlTransformed;
            });
            //console.log('the value of data after transformation is '+ this.videosList);
            console.log('the value of data after transformation is '+ JSON.stringify(this.videosList));
        }          
        else if (error) {
            console.log('error1');
            this.error = JSON.parse(error.body.message);
            console.log('urlList Error--->>'+ JSON.parse(error.body.message));
            console.log(error.body.message);
        }
    }*/

    @wire(getVideosandDocs,{Name:'$resources'})
    wiredurl({ error, data }) {
        if (data) { 
            console.log('data');
            let {videos, docs} = data;
            console.log('videos'+ JSON.stringify(videos));
            console.log('docs'+ JSON.stringify(docs));
           
            this.videosList = videos.map((url, index) => {
                console.log('the value of urldescription is '+url.Description__c);
                let description = (url.Description__c)?JSON.parse(url.Description__c): undefined;
                let urlTransformed= {
                    id: url.Id,
                   value: url.Value__c,
                   title: (description)? description.title: '',
                   desc: (description)? description.desc: ''
                }
                return urlTransformed;
            });

            this.docsList = docs;
            //console.log('the value of data after transformation is '+ this.videosList);
            console.log('the value of data after transformation is '+ JSON.stringify(this.docsList));
        }          
        else if (error) {
            console.log('error1');
            this.error = JSON.parse(error.body.message);
            console.log('urlList Error--->>'+ JSON.parse(error.body.message));
            console.log(error.body.message);
        }
    }
    
    
    
    pausePlayingVideos(event) {
        let youTubeId = event.detail;
        let allPlayers = this.template.querySelectorAll('c-basic-you-tube-player');
        allPlayers.forEach((player) => {
            if(player.currentlyplaying && player.youTubeId != youTubeId){
                player.pauseVideo();
            }
        });
    }

    Download(event) {
       alert('click download');
        var a = document.createElement('a');
            a.href = this.myUrl4;
            console.log('ahref'+ a.href);
            a.download = 'https://patientslikeme--wal.lightning.force.com/resource/PLM.pdf';
            // Trigger the download
            a.click();
           
    }
}