public class OverLoading {
    public void add(Integer a,Integer b)
    {
        System.debug('sum of 2 integers is '+(a+b));
    }
    public void add(Decimal a,Decimal b)
    {
        System.debug('sum of 2 Decimal is '+(a+b));
    }
    public void add(string a,string b)
    {
        System.debug('adding 2 strings '+(a+b));
    }
       
}