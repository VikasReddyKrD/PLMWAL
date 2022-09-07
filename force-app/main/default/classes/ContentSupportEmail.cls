public with sharing class ContentSupportEmail {
    
    @AuraEnabled
    public static void sendEmail(List<String> toAddress, String subject, String body) {  
        
       
    
        try{
            User currentUserID = [select id,name,AccountId from user where id= :UserInfo.getUserId()];
            String accId = [select id,AccountId   from User  where Id=:currentUserID.Id].AccountId;
            messaging.SingleEmailMessage mail = new messaging.SingleEmailMessage();
            List<Messaging.EmailFileAttachment> attachments = new List<Messaging.EmailFileAttachment>();
            List<ContentVersion> documents  = new List<ContentVersion>();
            documents.addAll([
                                SELECT Id, Title, FileType, VersionData, isLatest, ContentDocumentId
                                FROM ContentVersion
                                WHERE isLatest = true 
                                AND Guest_Record_fileupload__c=:accId
            ]);
            System.debug('toAdress'+toAddress);
            System.debug('body'+body);
            System.debug('subject'+subject);
                                
            //mail.setToAddresses(toAddress);
            mail.setToAddresses(toAddress);
            mail.setSubject(subject);
            mail.setHtmlBody(body);
           
            for (ContentVersion document: documents) {
                Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
                attachment.setBody(document.VersionData);
                attachment.setFileName(document.Title);
                attachments.add(attachment);
              }
              mail.setFileAttachments(attachments);
              Messaging.sendEmail(new List<messaging.SingleEmailMessage> {mail});
             if(Test.isRunningTest() && ContentSupportEmailTest.isTestExecuting){
            throw new AuraHandledException('Testing exception for content  support email');
            }
        }
        catch (exception e){
            throw new AuraHandledException(e.getMessage());
           
        }
    }
    
    @AuraEnabled
    public static string getAccountId(){

        try {
            User currentUserID = [select id,name,AccountId from user where id= :UserInfo.getUserId()];
            System.debug('accountId '+[select id,AccountId   from User  where Id=:currentUserID.Id].AccountId);
            return [select id,AccountId   from User  where Id=:currentUserID.Id].AccountId;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    }