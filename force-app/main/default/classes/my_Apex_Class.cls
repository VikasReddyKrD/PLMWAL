public class my_Apex_Class {
    //method1
    public static void myMethod1(Account accc){
        System.debug('inside method1');
        if(accc.Name=='other Account'){
            accc.Website='';
            update accc;
    }

}
    //method2
    public static void myMethod2(List<Account>accounts){
        system.debug('inside method2');
    }
}