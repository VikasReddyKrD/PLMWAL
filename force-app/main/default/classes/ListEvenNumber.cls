public class ListEvenNumber 
{
    public Static Integer addEvenNum()
    {        
       List<Integer> addList = new  List<Integer>();
    
        for(Integer i=0;i<=20;i++)
        {
           addList.add(i);                   //store 0-20 in addList
        }
        
        Integer output = 0;
        for(Integer j=0;j<addList.size();j=j+2)    // find even position in addList and store in variable j
        {
           output = output + addList[j];           // add every even number to output        
        }
        
        return output;   // print output
    }
}