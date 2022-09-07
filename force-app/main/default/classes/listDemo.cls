public class listDemo {
    public void LD(){
        List<List<Integer>> lis1=new List<List<Integer>>();
        List<Integer> l1=new List<Integer>{10,20,30};
            List<Integer> l2=new List<Integer>{40,50,60};
                List<Integer> l3=new List<Integer>{70,80,90};
                    lis1.add(l1);
        lis1.add(l2);
        lis1.add(l3);
        //for(Integer lis2:lis1){
        //system.debug(lis2);
       system.debug(lis1);
   // }
    }
    public void LD1(){
        List<List<string>> lis3= new List<List<string>>();
        List<string> s1=new List<string>{'A','B','C'};
            List<string> s2=new List<string>{'D','E','F'};
                List<string> s3=new List<string>{'G','H','I'};
                    lis3.add(s1);
        lis3.add(s2);
        lis3.add(s3);
        
            system.debug(lis3);
        
    }
}