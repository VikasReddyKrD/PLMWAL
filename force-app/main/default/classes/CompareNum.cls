public class CompareNum {
    Integer a=33;
    Integer b=11;
    Integer c=55;
    Integer d=23;
    public void display()
    {
    if(a>b && a>c && a>d)
    {
        System.debug('a value is greater....');
    }
   else if(b>a && b>c && b>d)
        {
        System.debug('b value is greater....');
    }
    else if(c>a && c>b && c>d)
        {
        System.debug('c value is greater....');
    }
    else
    {
        System.debug('d value is greater.....');
    }
    }
  
}