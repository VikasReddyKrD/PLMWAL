public class FutureExample {
    public void acc(){
        System.debug('Getting ready');
    }
    @future
public static void acc1(){
        System.debug('car is being repaired');
    }
    public void acc2(){
        System.debug('watching movie');
    }
    public void FutureMethod(){
        acc();
        acc1();
        acc2();
    }
    
}