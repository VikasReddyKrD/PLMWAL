import { LightningElement } from 'lwc';

export default class MddReportChartLWC extends LightningElement {
    goalName = 'Walk the Dog2';
    fullUrl ='';

    renderedCallback()
    {
        //this.fullUrl=`https://my-sitename.com/amazon/customer_system_api.php?token=XVF1C5CGE&sys=${this.sysId}&type=header`;
        //this.fullUrl='https://patientslikeme--wal.lightning.force.com/lightning/r/Report/00Oe0000000MXBPEA4/view?queryScope=userFolders';
        this.fullUrl = 'https://patientslikeme--wal--c.visualforce.com/apex/mddReportChartVP';
        let message = 'Goal1';
        let vfOrigin = 'https://patientslikeme--wal--c.visualforce.com';//"https://" + component.get("v.vfHost");
        let vfWindow = this.template.querySelector("iframe").contentWindow;//this.find("vfFrame").getElement().contentWindow;
        vfWindow.postMessage(message, vfOrigin);
        console.log('posted the message from renderedCallback');
    }
    handleClick(event) {
        //this.clickedButtonLabel = event.target.label;
        let message = 'Goal10';
        let vfOrigin = 'https://patientslikeme--wal--c.visualforce.com';//"https://" + component.get("v.vfHost");
        let vfWindow = this.template.querySelector("iframe").contentWindow;//this.find("vfFrame").getElement().contentWindow;
        vfWindow.postMessage(message, vfOrigin);
        console.log('posted the message from handleClick');
    }
}