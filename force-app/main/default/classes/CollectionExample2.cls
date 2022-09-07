public class CollectionExample2 {
    public static void dis2()
    {
    List<SelectOption> options = new List<SelectOption>();
options.add(new SelectOption('A','United States'));
options.add(new SelectOption('C','Canada'));
options.add(new SelectOption('A','Mexico'));
System.debug('Before sorting: ' + options);
options.sort();
System.debug('After sorting: ' + options);

}
}