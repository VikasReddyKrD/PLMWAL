public class XmlStreamReader1 {
    
    public String org{get;set;}
    public List<String> XMLData{get;set;}
    
    public XmlStreamReader1(){
        XMLData=new List<String>();
        
    }
    
    public List<String> getOrganisationInfo(){ 
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('http://xml.utrace.de/?query=111.93.167.67');
        req.setMethod('GET');
        HttpResponse res = http.send(req);
        
        // Log the XML content
        //String xmlContent=res.getBody();
       // System.debug(res.getBody());
        //System.debug('#####XmlStreamReader ##11##');
        // Generate the HTTP response as an XML stream
        
        XmlStreamReader reader = res.getXmlStreamReader();
       // System.debug('##########XML DATA##########'+res.getXmlStreamReader());
        
        XMLData=XMLParser(res.getBody());
        return XMLData;
    }
    
    public List<String> XMLParser(String strXml){
        System.debug('####Inside XMLParser Method########'+strXml);
        List<String> orgInfo=new List<String>();
        Dom.Document doc = new Dom.Document();
        doc.load(strXml);
        //Retrieve the root element for this document.
        Dom.XMLNode Envelope = doc.getRootElement();
        Dom.XMLNode Body= Envelope.getChildElements()[0];
        string user_createResult = '';
        
        for(Dom.XMLNode child : Body.getChildElements()) {
           if(child.getName()== 'region')
             orgInfo.add(child .getText());
        }
        return orgInfo;
    }
}