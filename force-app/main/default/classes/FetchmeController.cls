public class FetchmeController 
{
    String title;
    public Static void fetchdata()
    {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://jsonplaceholder.typicode.com/albums');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        if(response.getStatusCode() == 200)
        {
            JSONParser ob = JSON.createParser(response.getBody());
            while (ob.nextToken() != null) 
             {
                   if (ob.getCurrentToken() == JSONToken.START_ARRAY) 
                   {
                       while (ob.nextToken() != null) 
                          { 
                              if (ob.getCurrentToken() == JSONToken.START_OBJECT)
                              {
                                  try
                                  {
                                     FetchmeController z=(FetchmeController)ob.readValueAs(FetchmeController.class); 
                                     System.debug(z.title);
                                  }
                                  catch(exception e)
                                  {
                                      System.debug('Exception occured '+e.getMessage());
                                  }                                                                    
                              }
                          }
                   }
             }
        }
    }
    

}