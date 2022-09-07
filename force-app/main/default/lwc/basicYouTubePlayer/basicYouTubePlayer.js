import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import YouTubePath from '@salesforce/resourceUrl/YouTubeJS';
import saveLastViewedDetails from '@salesforce/apex/BasicYoutubePlayerController.saveLastViewedDetails';
import getLastViewedDetails from '@salesforce/apex/BasicYoutubePlayerController.getLastViewedDetails';
export default class BasicYouTubePlayer extends LightningElement {
    @api youTubeId;
    player;
    @api currentlyplaying=false;
    isTransplant = false;
    //refer to this article to customize the player controls
    //https://developers.google.com/youtube/iframe_api_reference#Requirements
    connectedCallback(){
        if(window.location.href.includes('transplantwebinar')){
            this.isTransplant = true;
        }
    }

    renderedCallback() {
        if (!this.youTubeId) {
            return;

        }
        if (window.YT) {
            if (this.player) {
                this.player.cueVideoById(this.youTubeId);
            } else {
                this.onYouTubeIframeAPIReady();
            }
        } else {
            Promise.all([
                loadScript(this, YouTubePath + '/iframe_api.js'),
                loadScript(this, YouTubePath + '/widget_api.js')
            ])
                .then(() => {
                    this.onYouTubeIframeAPIReady();
                })
                .catch(error => {
                    console.log('error');
                   // this.showErrorToast(error);
                });
        }
    }

    onPlayerError(e) {
        let explanation = '';
        console.log('Error -- ' + e.data);
        if (e.data === 2) {
            explanation = 'Invalid YouTube ID';
        } else if (e.data === 5) {
            explanation =
                'The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.';
        } else if (e.data === 100) {
            explanation =
                'The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.';
        } else if (e.data === 101 || e.data === 150) {
            explanation =
                'The owner of the requested video does not allow it to be played in embedded players.';
        }

      //  this.showErrorToast(explanation);
    }

    showErrorToast(explanation) {
        const evt = new ShowToastEvent({
            title: 'Error loading YouTube player',
            message: explanation,
            variant: 'error'
        });
        this.dispatchEvent(evt);
    }

    onYouTubeIframeAPIReady() {
        const containerElem = this.template.querySelector('.wrapper');
        const playerElem = document.createElement('DIV');
        playerElem.className = 'player';
        containerElem.appendChild(playerElem);

        this.player = new window.YT.Player(playerElem, {
            height: '100%',
            width: '100%',
            videoId: this.youTubeId,
            playerVars: {
                'modestbranding':1,
                'rel':0,
                //'controls':0
            },
            events: {
                onReady: this.onPlayerReady.bind(this),
                onError: this.onPlayerError.bind(this),
                onStateChange: this.onPlayerStateChange.bind(this)
            }
        });

        
    }

    onPlayerReady(event)    {
        //event.target.setVolume(100);
        event.target.unMute();
        console.log("youTubeId ",this.youTubeId);
        getLastViewedDetails({youtubeId:this.youTubeId})
        .then(result=>{
            if(result){
                console.log("Output number",Number(Math.ceil(result)));
                event.target.loadVideoById({
                    videoId: this.youTubeId,
                    startSeconds: Number(Math.ceil(result))
                });
            }
        }).catch(error=>{

        }) 
        //event.target.playVideo();
    }

    onPlayerStateChange(event) {
        console.log('Player State Changed');
       
      if (event.data == YT.PlayerState.PLAYING) {
        console.log('Video Started Playing');
        this.currentlyplaying = true;
        /* if(this.isTransplant){ */
            this.dispatchEvent(new CustomEvent('continue', {detail:this.currentlyplaying}));
        /* } */
        this.dispatchEvent(new CustomEvent('pauseallvideos',{detail : this.youTubeId}));
       } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED){
           this.currentlyplaying = false;
       }
      if(event.data == YT.PlayerState.PAUSED){
          console.log("getCurrentTime",this.player.getCurrentTime());
          saveLastViewedDetails({youtubeId:this.youTubeId,lastViewedSeconds:this.player.getCurrentTime()}).then(result=>{
              console.log("Working");
          }).catch(error=>{
              console.log("error",error.stackTrace);
          })
      }


    }
    @api pauseVideo() {
        this.currentlyplaying = false;
        this.player.pauseVideo();
      }

}