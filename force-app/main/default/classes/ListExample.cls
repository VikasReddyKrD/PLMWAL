public class ListExample 
{
 public static Integer evnnum()
 {
     List<Integer> num=new List<Integer>();
     Integer ad=0;
for (Integer a=1;a<=200;a++)
{
    num.add(a);
}
  for(Integer b=2;b<200;b+=2)
  {
      ad=ad+num[b];
  }
     System.debug(ad);
     return ad;
 }
}