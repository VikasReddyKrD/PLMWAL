@isTest
public class MultipleInheritTest 
{
    @isTest
     public static void testme()
    {
        System.assertEquals(4,new MaOperations().Calculate(2,2,'#'));
        System.assertEquals(4,new MaOperations().Calculate(2,2,'&'));
}
    @isTest
    public static void testme1()
    {
         System.assertEquals(0,new MaOperations().Calculate(2,2,'-'));
        System.assertEquals(4,new MaOperations().Calculate(2,2,'+'));
    }
}