public class mapDemo {
    /* public void mapD(){
Map<Integer, String> md= new Map<Integer, String>();
Map<Integer, String> md1= new Map<Integer, String>();
md.put(1,'A');
md.put(2,'');
md.put(3,'c');
system.debug(md);*/
    //md.remove(2);
    // system.debug(md.size());
    // system.debug(md.values());
    // system.debug(md.keyset());
    /*List<string> str = new List<string>();
str=md.values();
system.debug(str);
set<Integer> s=new set<Integer>();
s=md.keySet();
system.debug(s);*/
    //md.clear();
    //system.debug(md.containsKey(2));
    //system.debug(md.get(1));
    //md1 = md.clone();
    // system.debug('clone '+md1);
    //system.debug(md.isEmpty());
    
    //Map<String, String> MyStrings = new Map<String, String>{'a' => 'b', 'c' => 'd'.toUpperCase()};
    //system.debug(MyStrings);
    
    //  } 
    /*public static void mapD2(){
         Map<ID, Set<String>> m = new Map<ID, Set<String>>();
set<string> st=new set<string>();
st.add('ganesh');
st.add('srk');
st.add('srk');

system.debug(st);*/
        
     /*   Map<Id,string> mp=new Map<Id,string>();
        
        List<Contact> c= new List<Contact>([select Id,Name from Contact limit 10]);
        for(Contact con:c)
        {
            mp.put(con.Id, con.Name);
        }
        system.debug(mp.values());
        set<Account> s=new set<Account>([select Id, Name from Account limit 10]);
        for(Account a:s)
        {
            mp.put(a.Id,a.Name);
                              
        }
       system.debug(mp.keyset()); 
    }
    */
   /* public static void mapD3()    yet to complete this method
    * {     
    map<List<Account>,set<Contact>> p= new map<List<Account>,set<Contact>>();
    List<Account> ac= new List<Account>([select Id from Account]);
    set<Contact> co=new set<Contact>([select Name from Contact]);
        for(Account acc : ac)
        {
            for(Contact coo : co)
            {
                p.put(acc.Id,coo.Name);
                
            }
        }

     
    } */
   public static void Listmap()
   {
       Map<Id,List<Opportunity>> accountOppMap = new Map<Id,List<Opportunity>>();
       //List<Opportunity> opplst =new  List<Opportunity>();
for(Opportunity opp : [Select id,accountId from opportunity]){
    //List<Opportunity> opplst = accountOppMap.get(opp.accountId);
  //  if(opplst == null)
     //   opplst = new List<Opportunity>();
     List<Opportunity> opplst =new List<Opportunity>();
    opplst.add(opp);
    accountOppMap.put(opp.accountId,opplst);
}
//System.debug(accountOppMap.values());
System.debug(accountOppMap.get('0015j00000aX056AAC'));
   }
    
    
    public static void m(){
        map<List<Account>,Contact> acco = new map<List<Account>,Contact>();
        List<Account> ac = new List<Account>([select Id from Account limit 10]);
            for(Contact co:[select Id from Contact limit 10]){
                
                acco.put(ac,co);
                //system.debug(acco);
            }
        system.debug(acco);
   }
    
  }