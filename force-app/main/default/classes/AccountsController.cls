public with sharing class AccountsController {

    public class AccountData    {
        String id;
        DateTime CreatedDate;
        String name;
        String currentWk;
        String currentWk_sess2;
        DateTime goalStartDate;
        DateTime goalStartDate_sess2;
        //boolean isSurvey1Complete;
        boolean isSurvey2Complete;
        //String noOfDaysFromAccountCreation;
        //String noOfDaysFromSess1;
        //String noOfDaysFromSess2;

    }
    
    @AuraEnabled(cacheable = true)
    public static String getAccountOfUser(String userId)   {
        AccountData acct;
        List<User> users = [SELECT Id,contactId FROM User WHERE id = :userId];
        if(users != null)   {
            List<contact> contacts = [SELECT Id, AccountId,Account.CreatedDate, Account.Name,Account.Current_wk__c,Account.Current_Wk_Session2__c,Account.GoalStartDate__c,Account.GoalStartDate_Session2__c FROM Contact WHERE id=:users[0].contactId];
            if(contacts!= null) {
                acct = new AccountData();
                acct.id = contacts[0].accountid;
                acct.CreatedDate= contacts[0].Account.CreatedDate;
                acct.name = contacts[0].Account.Name;
                String currwk = String.valueOf(contacts[0].Account.Current_wk__c);
                acct.currentWk = String.isNotBlank(currwk)? currwk : '0';
                String currwk2 = String.valueOf(contacts[0].Account.Current_Wk_Session2__c);
                acct.currentWk_sess2 = String.isNotBlank(currwk2)? currwk2 : '0';
                acct.goalStartDate = contacts[0].Account.GoalStartDate__c;
                acct.goalStartDate_sess2= contacts[0].Account.GoalStartDate_Session2__c;
                system.debug('goalStartDate-->>'+ acct.goalStartDate);
                /*DateTime goalStartDate1 = (contacts[0].Account.GoalStartDate__c != null)?contacts[0].Account.GoalStartDate__c : DateTime.Now();
                DateTime goalStartDate2 = (contacts[0].Account.GoalStartDate_Session2__c != null)?contacts[0].Account.GoalStartDate_Session2__c : DateTime.Now();
                Decimal s1Days =  DateTime.Now() - goalStartDate1;
                Decimal s2Days =  DateTime.Now() - goalStartDate2;
                Decimal acctDays =  DateTime.Now() - contacts[0].Account.CreatedDate;
                acct.noOfDaysFromSess1 = String.valueOf(s1Days);
                acct.noOfDaysFromSess2 = String.valueOf(s1Days);
                acct.noOfDaysFromAccountCreation = String.valueOf(acctDays);*/
                //string Survey1Status = [select id,PLM_User__c,Status__c,Advanced_Survey__r.Survey_Number__c from Advanced_Survey_Response__c where PLM_User__c =: acct.id AND Advanced_Survey__r.Survey_Number__c = 'MDD-Survey-1']?.Status__c;
                //acct.isSurvey1Complete = (Survey1Status == 'Complete') ? true : false;
                string Survey2Status = [select id,PLM_User__c,Status__c,Advanced_Survey__r.Survey_Number__c from Advanced_Survey_Response__c where PLM_User__c =: acct.id AND Advanced_Survey__r.Survey_Number__c = 'MDD-Survey-2']?.Status__c;
                acct.isSurvey2Complete = (Survey2Status == 'Complete') ? true : false;
            }
        }
        System.debug('account data being returned is '+ JSON.serializePretty(acct));
        return JSON.serialize(acct);
    }
}