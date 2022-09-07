public class JSONExample2
{
    Integer userId;
        Integer id;
        String title;
        String completed;
    
    public Static void fetchdata()
    {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://jsonplaceholder.typicode.com/todos/1');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        if(response.getStatusCode() == 200) 
        {      
            List<Object>results = (List<Object>)JSON.deserializeUntyped(response.getBody());
            System.debug(results);
        }
    }
}