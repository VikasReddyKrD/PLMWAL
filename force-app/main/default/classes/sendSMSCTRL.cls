Public class sendSMSCTRL{
    public sendSMSCTRL(){
        
    }
    public void sendSMS(){
        String msg = 'Hello';
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://www.abcsms.com/api/sendSMS.asp?username=YOURUSERNAME&password=XXXXX&sender=MYTEST&sendto=8019750034&message='+msg);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setBody('{"name":"testing"}');
        HttpResponse response = http.send(request);
        if (response.getStatusCode() != 201) {
            System.debug('The status code returned was not expected: ' +
                response.getStatusCode() + ' ' + response.getStatus());
        } else {
            System.debug(response.getBody());
        }
    }
}