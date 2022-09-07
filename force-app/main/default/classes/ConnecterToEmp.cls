public class ConnecterToEmp {
public Employee__c details;
 
    public ConnecterToEmp() {
        details = [SELECT Name, EmpName__c, Salary__c FROM Employee__c
                   WHERE Id = :ApexPages.currentPage().getParameters().get('id')];
    }
 
    public Employee__c getdetails() {
        return details;
    }
     
    public PageReference Deleteit() {
        delete details;
        return null;
    }
    
    public PageReference Save() {
        update details;
        return null;
    }
    
    
}