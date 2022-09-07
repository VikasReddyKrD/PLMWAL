public class MapCollections {
    public static void mc(){
        map<Integer, string> m= new map<Integer, string>();
        m.put(1,'AAAA');
        m.put(2,'BBBB');
        m.put(3,'CCCC');
        m.put(4,'DDDD');
        /*for(Integer ss:m.keyset())
            system.debug(ss);
        for(String ss1:m.values())
            System.debug(ss1);*/
      //  String value = m.get(2);
      
        system.debug(m.get(2));                 //get() returns the values 
        System.debug(m.containsKey(1));         // containskey() its returns boolean values
    }
    public static void mc2(){
         
        Map<Id,List<Account>> mapofAccounts = new Map<Id,List<Account>>();
        List<Account> lstAccounts = new List<Account>();
        for(Account acc : [SELECT Id,Name,(Select Name from contacts) FROM Account LIMIT 20]){
            lstAccounts.add(acc);    // Here we're 
            mapofAccounts.put(acc.Id,lstAccounts);
      		System.debug(mapofAccounts.values());
            //if(mapofAccounts.containsKey(acc.Id)) {
                //mapofAccounts.put(acc.Id,lstAccounts.add(acc));
            /*} else {
                mapofAccounts.put(acc.Id,lstAccounts.add(acc));
            }*/
    }
    }
    public static void mc3(){
        
Map<String, String> colorCodes = new Map<String, String>();

colorCodes.put('Red', 'FF0000');
colorCodes.put('Blue', '0000A0');

List<String> colors = new List<String>();
colors = colorCodes.values();
//system.debug(colorCodes.values());
    }
    
    
}