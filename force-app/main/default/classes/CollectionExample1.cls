public class CollectionExample1 {
    public static void dis1(){
        List<String> colors = new List<String>{'Yellow','Red','Green'};
            colors.sort();
        System.assertEquals('Green', colors.get(0));
        System.assertEquals('Red', colors.get(1));
        System.assertEquals('Yellow', colors.get(2));
        System.debug(colors);
    }
    
}