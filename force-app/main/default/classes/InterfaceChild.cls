public class InterfaceChild implements InterfaceParent1, InterfaceParent2{
public void add(Integer a,Integer b)
    {
    Integer z=a+b;
        System.debug('add of 2 integers '+z);
    }
    public void sub(Integer c,Integer d)
    {
   Integer z=c-d;
        System.debug('sub of 2 integers '+z);
    }
    public void mul(Integer e,Integer f)
    {
    Integer z=e*f;
        System.debug('mul of 2 integers '+z);
    }
    public void div(Integer g,Integer h)
    {
   Integer z=g/h;
        System.debug('div of 2 integers '+z);
}
}