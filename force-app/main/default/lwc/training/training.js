import { LightningElement,track } from "lwc";



export default class Userform extends LightningElement {

 

  fullname = '';

  @track


  firstname = '';

  @track

  lastname = '';



  convertdata(event) {



    if(event.target.name === 'FirstName')

     {  

       this.firstname = event.target.value;

     }

     

     if(event.target.name === 'LastName')

     {

         this.lastname = event.target.value;

     }



    this.fullname =this.firstname.toUpperCase()+' '+this.lastname.toUpperCase()+"...!";



  }

}