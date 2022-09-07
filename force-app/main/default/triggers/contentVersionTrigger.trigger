trigger contentVersionTrigger on ContentVersion (after insert) {
    try{
    System.debug('in content version');
    List<ContentDocumentLink> cdlList = new List<ContentDocumentLink>();
    List<Account> lstOfCases = new List<Account>();
    //List<String> accList = new List<String>();
    string accId;
    for(ContentVersion cv : trigger.new){
        System.debug('cv.id==========>'+cv.id);
        if(cv.Guest_Record_fileupload__c != null){
            ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.ContentDocumentId = cv.ContentDocumentId;
            cdl.LinkedEntityId = cv.Guest_Record_fileupload__c;
            accId = cv.Guest_Record_fileupload__c;
            cdl.ShareType = 'V';
            cdlList.add(cdl);
        }
        System.debug('accID==============>'+accId);
        if(accId!=null){
            //accList.add(accId);
            Account c = new Account();
            c.id = accId;
            System.debug('c.id '+c.id);
            lstOfCases.add(c);
        }}
       //update ([SELECT id FROM Account WHERE ID IN :accList]);
    Update lstOfCases;
    insert cdlList;
    System.debug('cdlList[0]'+cdlList[0].id);
    }
    catch(Exception e){
    System.debug(e.getMessage());
    }
}