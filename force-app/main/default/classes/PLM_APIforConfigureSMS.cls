global class PLM_APIforConfigureSMS 
{
    public static String TokenId; 
    @future (callout=true)
    public static void configureSMS(List<String> mobileNumbers,Boolean OverrideVal,Boolean Subscribe,Boolean Resubscribe,String message)
    {								//{Mobilenumbers,,true,false}
        String Accesstoken=getAccessToken();
        List<SMS_API_Headers__mdt> mdtlst=[select Id,Key__c,Value__C from SMS_API_Headers__mdt];
        HttpRequest req = new HttpRequest();
        if(mdtlst.size()>0)
        {
            for(SMS_API_Headers__mdt mdt:mdtlst)
            {
                if(mdt.Key__c==Label.Authorization_Header_for_SMS_API)
                {
                    req.setHeader(mdt.Key__c,mdt.Value__C+' '+Accesstoken);  
                } 
                else
                    req.setHeader(mdt.Key__c,mdt.Value__C);
            }
        }
        
        String endpoint = Label.SMS_API;
        req.setMethod(Label.SMS_API_Type);
        req.setEndpoint(endpoint); 
        req.setTimeout(10000);
        try{
            MessageWrapper wrap=new MessageWrapper();
            wrap.Resubscribe=Resubscribe;
            wrap.Subscribe=Subscribe;
            wrap.TmpOverride=OverrideVal;
            wrap.mobileNumbers=mobileNumbers;
            wrap.messageText = message;
            String JsonString=JSON.serialize(wrap);
            req.setBody(JsonString.replace(Label.OrignalParameter_for_SMS_API,Label.ReplaceParameter_for_SMS_API));
            system.debug('over----'+JsonString.replace(Label.OrignalParameter_for_SMS_API, Label.ReplaceParameter_for_SMS_API));
            
            Http http = new Http();
            HTTPResponse res = http.send(req);
            if (res.getStatusCode() == 200 || res.getStatusCode() == 202) 
            {
                system.debug('response get success');
                System.debug('responsebbody '+res.getBody());
                string jsonStringg=res.getBody();
                RespMessageWrapper responsedata=(RespMessageWrapper)Json.deserialize(jsonStringg, RespMessageWrapper.class);
                system.debug('tokenId-'+responsedata.tokenId);
                TokenId=responsedata.tokenId;
            }
            else
            {
                system.debug(res.getStatusCode()+'response got rejected'+res.getBody());
            }
        }
        catch(Exception e)
        {
            system.debug('exception '+e);
        }
        
        
    }
    
    
    public static String getAccessToken()
    {
        string accesstoken;
        HttpRequest req = new HttpRequest();
        String endpoint = Label.Access_token_API_for_SMS;
        req.setMethod(Label.SMS_API_Type);
        req.setEndpoint(endpoint); 
        List<SMS_API_Headers__mdt> mdtlst=[select Id,Key__c,Value__C from SMS_API_Headers__mdt];
        if(mdtlst.size()>0)
        {
            for(SMS_API_Headers__mdt mdt:mdtlst)
            {
                if(mdt.Key__c==Label.Content_Type_Header_for_SMS_API)
                {
                    req.setHeader(mdt.Key__c,mdt.Value__C);  
                }
            }
        }
        
        TokenWrapper wrap=new TokenWrapper();
        wrap.client_secret=Label.client_secret_for_SMS_API;
        wrap.client_id=Label.client_id_for_SMS_API;
        wrap.grant_type=Label.grant_type_for_SMS_API;
        
        String JsonSerializeString=JSON.serialize(wrap);
        system.debug('json-'+JsonSerializeString);
        req.setBody(JsonSerializeString);
        Http http = new Http();
        HTTPResponse res = http.send(req);
        if (res.getStatusCode() == 200) 
        {
            system.debug('response get success');
            String jsonString=res.getBody();
            
            RespTokenWrapper responsedata=(RespTokenWrapper)Json.deserialize(jsonString, RespTokenWrapper.class);
            accesstoken=responsedata.access_token;
            System.debug('responsebbody '+accesstoken);
        }
        else
        {
            system.debug('response got rejected'+res.getBody());
        }
        return accesstoken;
    }
    
    public class TokenWrapper
    {
        public string grant_type;
        public string client_id;
        public string client_secret;
    }
    
    public class RespTokenWrapper
    {
        public string access_token;
        public string token_type;
        
    }
    public class MessageWrapper
    {
        public Boolean TmpOverride;
        public Boolean Resubscribe;
        public Boolean Subscribe;
        public List<String> mobileNumbers;
        public String messageText;
    }
    
    public class RespMessageWrapper
    {
        public string tokenId;
    }
}