public class Base {
    public Base()
    {
        System.debug('Unparameterised BaseClass');
    }
    public Base(String a)
    {
        System.debug('parameterised'+ 'BaseClass');
    }

public void display()
{
System.debug('display BaseClass');
}
}