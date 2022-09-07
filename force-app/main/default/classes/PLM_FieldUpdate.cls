@RestResource(urlMapping='/update')
   global with sharing class PLM_FieldUpdate {
     @httpput
      global Static string fetchAccount(){
      RestRequest req = RestContext.request;
      RestResponse res = Restcontext.response;
      string jsonString=req.requestBody.tostring();
     // responseWrapper wResp=(responseWrapper) JSON.deserialize(jsonString,responseWrapper.class);   
      Seqster_Data__c obj=new Seqster_Data__c();
      obj=[select id,name,Seqster__c from Seqster_Data__c];
      obj.Seqster__c=true;
      update obj;
      return 'Success';
      }
   }