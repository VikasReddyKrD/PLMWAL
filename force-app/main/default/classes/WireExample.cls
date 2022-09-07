public class WireExample {
    
    @AuraEnabled(cacheable=true)
    public static string GetInfo()
    {
        return 'hi wire decorator';
    }

}