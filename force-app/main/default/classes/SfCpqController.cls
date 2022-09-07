public class SfCpqController {
    public final SalesforceCpq__c sfcpq;
    public String streamId;
    public String ApiKey;
    public String getstreamId()
    {
        return 'myApiKey';
    }
    
    public String getApiKey()
    {
        return '123456';
    }
    public void setstreamId(String streamId)
    {
        this.streamId = streamId;
    }   
    public void setApiKey(String ApiKey)
    {
        this.ApiKey = ApiKey;
    }   
    
}