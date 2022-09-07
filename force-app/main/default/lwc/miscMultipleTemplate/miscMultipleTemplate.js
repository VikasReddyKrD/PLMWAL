// miscMultipleTemplates.js

import { LightningElement, track } from 'lwc';
import templateOne from './miscMultipleTemplate.html';
import templateTwo from './templateTwo.html';

export default class MiscMultipleTemplates extends LightningElement {
    
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
     if(event.target.name === 'Phone')

     {

         this.Phone = event.target.value;

     }
     
     if(event.target.name === 'Age')

     {

         this.Age = event.target.value;

     }


    this.fullname =this.firstname.toUpperCase()+' '+this.lastname.toUpperCase()+"...!";



  }


    templateOne = true;

    render() {
        return this.templateOne ? templateOne : templateTwo;
    }

    next(){ 
        this.templateOne = this.templateOne === true ? false : true; 
    }

    back(){ 
        this.templateOne = this.templateOne === true ? false : true; 
    }
}