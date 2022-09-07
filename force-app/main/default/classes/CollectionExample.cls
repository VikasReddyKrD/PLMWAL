public class CollectionExample {
    public static void display(){
        list<Integer> myList=new list<Integer>();
        for(Integer i=0;i<=10;i++)
        {
            myList.add(i);           
        }
        Integer output=0;
        for(Integer j=1;j<=myList.size();j=j+2)
        {
            system.debug(output=output+j); 
           // System.debug(output+j);                     // Requirement is in progress (output + j = output)         
        }
    }
    public static void display1(){
       Integer k=120;
        for(Integer i=1;i<=10;i++){
            System.debug('120 * '+i+'= '+(k*i));
        }   
    }
    public static void display2(){
        
        Account acc = new Account(Name='Ghani',BillingCity='chennai',BillingState ='tamilnadu');    
        list<Account> myAcc=new list<Account>();
        myAcc.add(acc);
        update myAcc;
        //Account acc=[SELECT Id, Name, BillingCity, BillingState FROM Account ]
    }
}

//CollectionExample.display1();