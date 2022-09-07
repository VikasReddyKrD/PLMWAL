@isTest
public class my_Apex_Class_Test {

    @testsetup static void data_setup(){
        Account accountA = new Account();
        accountA.name = 'other Account';
        
        Account accountB = new Account();
        accountB.name = 'Test Account 2';
        accountB.website = 'www.newGenIT.com';
        insert accountA;
        insert accountB;
    }
    @istest static void test_myMethod1(){
        Account acc = [Select id,name from Account where name = 'other Account'];
        my_Apex_Class.myMethod1(acc);
    }
    @istest static void test_myMethod2(){
        List<Account> accounts = [Select id, name, website from Account];
    }
    }