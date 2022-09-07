public without sharing class CaseTriggerHandler {
    
    public static void updateAccount(Map<Id, Case> scope) {
        List<String> accountIds = new List<String>();
        for(Case c : scope.values()) {
            accountIds.add(c.AccountId);
        }
        List<Account> accounts = [SELECT Id, 
                                    (SELECT Id, RecordType.Name, Status, CreatedDate FROM Cases)
                                    FROM Account WHERE Id IN :accountIds];

        //All we are checking for is if there is an open case related to the account
        for(Account a : accounts) {
            Boolean hasOpen = false;
            for(Case c : a.Cases) {
                if(scope.get(c.Id) == null){
                    if(c.Status != 'Closed' && c.RecordType.Name == 'State Change' && c.CreatedDate < DateTime.now()) {
                        hasOpen = true;
                    }
                }
            }
            a.Open_State_Change_Case__c = hasOpen;
        }

        if(accounts.size() > 0) {
            update accounts;
        }
    }

    public static void setCaseTimestamp(List<Case> scope) {

        Date today = Date.today();

        for(Case c : scope) {
            c.Date_Entered_Review_Queue__c = today;
        }

    }

    public static void defaultQueue(List<Case> scope) {

        Group allCaseQueue = [SELECT Id FROM Group WHERE Type = 'Queue' AND DeveloperNAME = 'All_Cases' LIMIT 1];

        for(Case c : scope) {
            c.OwnerId = allCaseQueue.Id;
        }
    }
}