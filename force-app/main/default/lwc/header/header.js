import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import basePath from "@salesforce/community/basePath";

import getLogoutUrl from '@salesforce/apex/applauncher.IdentityHeaderController.getLogoutUrl';


import uId from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import { NavigationMixin } from 'lightning/navigation';
//import { loadScript, loadStyle } from "lightning/platformResourceLoader";
// //import scripts from '@salesforce/resourceUrl/assets';
// import fonts from '@salesforce/resourceUrl/fontsplmcrt';
// import icons from '@salesforce/resourceUrl/icons_svg';
// //import styles from '@salesforce/resourceUrl/appstyles';

const fields = [NAME_FIELD];

export default class Header extends NavigationMixin(LightningElement) {

    userId = uId;

    @wire(getRecord, { recordId: '$userId', fields })
    user;

    get name() {
        return getFieldValue(this.user.data, NAME_FIELD);
    }

    // connectedCallback() {
    //     console.log('inside the header.js connectedcallback '+ uId);
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__webPage',
    //         attributes: {
    //             url: 'https://www.patientslikeme.com/member_home'
    //         }
    //     }, true);
    // }
    
 logoutLink() 
    { 

        // window.open(getLogoutUrl);
        // const sitePrefix = basePath.replace(/\/s$/i, "");
        // console.log( sitePrefix + "/secur/logout.jsp")
        //  // site prefix is the site base path without the trailing "/s" 
        //  return sitePrefix + "/secur/logout.jsp"; 
    //    www.patientslikeme.com/users/sign_in
       // https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s/surveys
        // window.location.replace("https://wal-servicecloudtrial-155c0807bf-16246540dc1.cs15.force.com/wal/s?retUrl=https://www.patientslikeme.com/users/sign_in");
    //    console.log('test');
    //     window.location.replace("https://www.patientslikeme.com/users/sign_in")
        window.location.replace("{!$Site.Prefix}/secur/logout.jsp")
    
    }
    handleClick(){
      //  window.open(getLogoutUrl);
       // const sitePrefix = basePath.replace(/\/s$/i, "https://www.patientslikeme.com/users/sign_in");
        //console.log( sitePrefix + "/secur/logout.jsp")
        //site prefix is the site base path without the trailing "/s" 
        // window.location.replace("https://www.patientslikeme.com/users/sign_in")
      //  return sitePrefix + "/secur/logout.jsp"; 

     // www.patientslikeme.com/users/sign_in
          //window.location.replace("https://www.patientslikeme.com/users/sign_in");
          window.location.replace("https://val-servicecloudtrial-155c0807bf-16246540dc1.cs2.force.com/wal/s/login/");
    }
    handleBackClick(){
        window.location.replace("/" + returnURL);
    }

//     renderedCallback() {
//         Promise.all([

//             loadStyle(this, fonts + '/fonts_type.css'),
//             loadStyle(this, icons + '/fonts_type.css'),
//             //loadStyle(this, styles + '/appstyles.css')

//         ]).then(() => {
//             window.console.log('Files loaded.');
//         }).catch(error => {
//             window.console.log("Error " + error.body.message);
//         });
//     }

}