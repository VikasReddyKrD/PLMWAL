import { LightningElement } from 'lwc';

export default class Testtest extends LightningElement { 

 value; 

givenValue; 

termLogic; 

DetailsVisible = false;  

enterValue(event){

 console.log(event.target.value);

 this.givenValue = event.target.value; 

 // else{

 // this.DetailsVisible = false;

 // }


} 

change(){ 

 if(this.givenValue<= 12){

 

 this.DetailsVisible1 = false;
  this.DetailsVisible = true;
  this.DetailsVisible2 = false;
  this.DetailsVisible3 = false;
  this.DetailsVisible4 = false;
  this.DetailsVisible5 = false;
  this.DetailsVisible6 = false;
  this.DetailsVisible7 = false;


 } 

 if(this.givenValue>12)
{
    if(this.givenValue<=24)
{
  this.DetailsVisible1 = true;
  this.DetailsVisible = false;
  this.DetailsVisible2 = false;
  this.DetailsVisible3 = false;
  this.DetailsVisible4 = false;
  this.DetailsVisible5 = false;
  this.DetailsVisible6 = false;
  this.DetailsVisible7 = false;
}
}
 if(this.givenValue>24)
{
    if(this.givenValue<=36)
{
  this.DetailsVisible1 = false;
  this.DetailsVisible = false;
  this.DetailsVisible2 = true;
  this.DetailsVisible3 = false;
  this.DetailsVisible4 = false;
  this.DetailsVisible5 = false;
  this.DetailsVisible6 = false;
  this.DetailsVisible7 = false;
}
}
if(this.givenValue>36)
{
    if(this.givenValue<=48)
{
  this.DetailsVisible1 = false;
  this.DetailsVisible = false;
  this.DetailsVisible2 = false;
  this.DetailsVisible3 = true;
  this.DetailsVisible4 = false;
  this.DetailsVisible5 = false;
  this.DetailsVisible6 = false;
  this.DetailsVisible7 = false;
}
}
if(this.givenValue>48)
{
    if(this.givenValue<=60)
{
  this.DetailsVisible1 = false;
  this.DetailsVisible = false;
  this.DetailsVisible2 = false;
  this.DetailsVisible3 = false;
  this.DetailsVisible4 = true;
  this.DetailsVisible5 = false;
  this.DetailsVisible6 = false;
  this.DetailsVisible7 = false;
}
}
if(this.givenValue>60)
{
    if(this.givenValue<=72)
{
  this.DetailsVisible1 = false;
  this.DetailsVisible = false;
  this.DetailsVisible2 = false;
  this.DetailsVisible3 = false;
  this.DetailsVisible4 = false;
  this.DetailsVisible5 = true;
  this.DetailsVisible6 = false;
  this.DetailsVisible7 = false;
}
}
if(this.givenValue>72)
{
    if(this.givenValue<=84)
{
  this.DetailsVisible1 = false;
  this.DetailsVisible = false;
  this.DetailsVisible2 = false;
  this.DetailsVisible3 = false;
  this.DetailsVisible4 = false;
  this.DetailsVisible5 = false;
  this.DetailsVisible6 = true;
  this.DetailsVisible7 = false;
}
}
if(this.givenValue>84)
{
    if(this.givenValue<=96)
{
  this.DetailsVisible1 = false;
  this.DetailsVisible = false;
  this.DetailsVisible2 = false;
  this.DetailsVisible3 = false;
  this.DetailsVisible4 = false;
  this.DetailsVisible5 = false;
  this.DetailsVisible6 = false;
  this.DetailsVisible7 = true;
}
}
} 
}