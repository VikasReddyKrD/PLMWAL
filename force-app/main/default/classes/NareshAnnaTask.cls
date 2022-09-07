public class NareshAnnaTask {
    public static void Display()
    {
        Map<Integer, String> m = new Map<Integer, String>(); 
        m.put(1, 'First entry');                  
        m.put(2, 'Second entry');
        m.put(3, 'third entry');
        m.put(4, 'fourth entry');
        m.put(5, 'fifth entry');
        
        System.assert(m.containsKey(1)); 
        String value = m.get(2);              
        System.assertEquals('Second entry', value);
        Set<Integer> s = m.keySet();    
    }
    
}