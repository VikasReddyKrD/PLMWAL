public with sharing class PLM_Seqester {
    
    public static String webToken;
    @AuraEnabled
    public static void registerUser(string redirectionurl){
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account accId = [SELECT Id,Patient_ID__c,site,Access_Token__c,webToken__c,LastName,Account_Owner_ACtion__c FROM Account WHERE Id =:user.AccountId];        
        if(accId.Access_Token__c==null){
            HttpRequest request = new HttpRequest();
            request.setMethod('POST');
            request.setHeader('Accept', 'application/json');
            request.setHeader('Content-Type','application/x-www-form-urlencoded');
            request.setEndpoint(System.Label.Seqster_user_registration);
            request.setBody('patient_id='+accId.Patient_ID__c.split('-')[1]+
                            '&client_id='+System.Label.Client_Id+'&client_secret='+
                            System.Label.Client_secret+'&first_name='+accId.Account_Owner_ACtion__c+
                            '&last_name=&site_id='+accId.site+'&Content-Type=application/x-www-form-urlencoded');
            Http http = new Http();
            HttpResponse response =  http.send(request);
            System.debug('response'+response);
            UserRegistrationResponse responseList = (UserRegistrationResponse)JSON.deserialize(response.getBody(), UserRegistrationResponse.class);
            System.debug('token_type '+responseList.data.token_type);
            System.debug('expires_in '+responseList.data.expires_in);
            System.debug('access_token '+responseList.data.access_token);
            System.debug('refresh_token '+responseList.data.refresh_token);
            insertAccessToken(responseList.data.access_token);
            callWebService(responseList.data.access_token,redirectionurl);
            system.debug('webToken'+webToken);
        }else{
            callWebService(accId.Access_Token__c,redirectionurl);
            system.debug('webToken'+webToken);
        }
        
       
    }
    @Future(callout=true)
    public static void insertAccessToken(String accessToken){
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account accId = [SELECT Id,Patient_ID__c,LastName,Access_Token__c FROM Account WHERE Id =:user.AccountId];
        accId.Access_Token__c = accessToken;
        update accId;
    }
    
    @Future(callout=true)
    public static void callWebService(String accessToken,String redirectionurl){
        HttpRequest webTokenRequest = new HttpRequest();
        webTokenRequest.setMethod('POST');
        webTokenRequest.setHeader('Accept', 'application/json');
        webTokenRequest.setHeader('Authorization', 'Bearer '+accessToken);
        webTokenRequest.setBody('redirect_url='+redirectionurl+'&Content-Type=application/x-www-form-urlencoded');
        webTokenRequest.setEndpoint(System.Label.Seqster_web_token);
        
        Http webTokenRequesthttp = new Http();
        HttpResponse webTokenResponse =  webTokenRequesthttp.send(webTokenRequest);
        UserRegistrationResponse webTokenResponseList = (UserRegistrationResponse)JSON.deserialize(webTokenResponse.getBody(), UserRegistrationResponse.class);
        System.debug('web_token'+webTokenResponseList.data.web_token);
        webToken=webTokenResponseList.data.web_token;
        webtokenReturn(webTokenResponseList.data.web_token);
    }
    
    public  static void webtokenReturn(String webToken){    
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account accId = [SELECT Id,Patient_ID__c,LastName,webToken__c FROM Account WHERE Id =:user.AccountId];
        accId.webToken__c = webToken;
        update accId;
        //return 'testing';
    }
    
    @AuraEnabled
    public static String getWebToken(){
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        Account accId = [SELECT Id,Patient_ID__c,LastName,webToken__c FROM Account WHERE Id =:user.AccountId]; 
        return accId.webToken__c;
    }
    
    public class UserRegistrationResponse{
        public Data data;
    }
    public class Data{
        public String token_type;	//Bearer
        public Double expires_in;	//31536000
        public String access_token;	//eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5M2RlZjg5Yi05NzRmLTQ0OGEtYTA2ZC05MDk4MDYyYmUxZDIiLCJqdGkiOiJhMGRmZWJkMDFjYjNjMTIyYzA2MGRlNzQ3MDk1NDI3YjgzZjBkODIzYjZkNzc3ZTllYTRiMmZhMDZkMTM1NmQ2MzliYTI2ODBkNThmYzVmNCIsImlhdCI6MTYzMzA3MTIzOSwibmJmIjoxNjMzMDcxMjM5LCJleHAiOjE2NjQ2MDcyMzksInN1YiI6IjM3Iiwic2NvcGVzIjpbXX0.ZMMxSyj5DPPeC3TMZmG7ESybLbkuIgWDNhaY993UCugPXIAsJC1-UFAvrzN_Vc5oK5Q-VvwTMg2YaDQcuVPuDRrGTQZ__sBThqVOH_4AbdaKn0Gf6Cq67ceYqVQslU6M_qrEnrkOlbSo9f32HH2vULP7nsdfHVUh25r2bag7U5VZ4VzUrjzSz8p8fGbqn2Ysr0vfWMYSGEdc5T8peqDNIvI18VoKyWv5hmBxD53wbr3bIasT4FywXXonc-fop8FHptmlh6WEHusabqQ-u2tCJ7nrzyeiN96FdKOeG7N89bcVGwXmmlR4B2QIa1ZXLB0riwJYv88vchqMPBfjR77ohTCfG8A_SwbjkzF0Je25G_GJROEyXN3lWjD0tH5Mrm6-nbbRyaFGe0WTRu2OB1XT5xJvEiPp9cVtDzg1mjOwiqZMYv2jSXuX7c4InYxufC02y_7yFM-INru5d3-oUt1AfUup0dWMtNL1Rn-Nq_EgShbFrOY5LrybsiK0uakUZHayXeruVL8vWDu5Dt8rOGuud2Lzq-qAcU9lMSEmrpb4aEPbZABcN-KcAmioahvUiiNUDb3lxZOzGAlypsR_HiJ9rYzMF-LAzFU6crvgJ_c0owKvVzJ-ynWqKrWEJ48zeQIaGHyUT2Euoli_nf800CpOVSWomlgPwA5DzXZcPWk5buY
        public String refresh_token;	//def50200ba349071e402576f5978f3b9abc5b547387bf93318fae73d1f0a310b0b4355d28f4185cdaea8c7267b1af9eeb06a0f4539fdbb287feab1099b2bee32173da9c79e94df6dbf573dae1887e504309ddba2b807059e7cb91b5bc801f94f3bbd0db73f72866f91e232530385e51e5c9ad57cc3d9a3f8c88139afa8086de710e4bbb715116080980983a360a9be3de09090e802c9bceafef48680c70f230d99ecd93415dccddc7e55bdeb411e9c6a1da38969947197499068e9f6da9b1036976f7e866dcfe4b9ac8161ca201f839f06253e6a45e2c27b9332253678dca7ce830197dd822d9d7770ac3caca58010296b5776e54e086096f265fc29f956d27d1f94eb9571987219d4e2233a3f525a96b8dc068714abeb9c704559be3b213031f5a0cec1a0d2e71e8cd19e314b7c81d28b3a260dae2c7f2ee3ddc12222221351ad158e43d7eed1ad660e49b1af7a7d61dcb0de4ee5814e58658e59363c487d76c745908f6273345953d2df3c481897ba3bf976fed365d0420cbf0ba46c5473cb5ffb1fb4ae
        public String web_token;
    }
}