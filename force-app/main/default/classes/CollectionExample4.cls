public class CollectionExample4 {
    public static void dis4(){
        // Initialize the List
List<string> ListOfStatesMethod = new List<string>();

// This statement would give null as output in Debug logs
System.debug('Value of List'+ ListOfStatesMethod);

// Add element to the list using add method
ListOfStatesMethod.add('New York');
ListOfStatesMethod.add('Ohio');

// This statement would give New York and Ohio as output in Debug logs
System.debug('Value of List with new States'+ ListOfStatesMethod);

// Get the element at the index 0
String StateAtFirstPosition = ListOfStatesMethod.get(0);

// This statement would give New York as output in Debug log
System.debug('Value of List at First Position'+ StateAtFirstPosition);

// set the element at 1 position
ListOfStatesMethod.set(0, 'LA');

// This statement would give output in Debug log
System.debug('Value of List with element set at First Position' + ListOfStatesMethod[0]);

// Remove all the elements in List
ListOfStatesMethod.clear();

// This statement would give output in Debug log
System.debug('Value of List'+ ListOfStatesMethod);
    }
    public static void dis41(){
    // Adds an element to the set
// Define set if not defined previously
Set<string> ProductSet = new Set<string>{'Phenol', 'Benzene', 'H2SO4'};
ProductSet.add('HCL');
System.debug('Set with New Value '+ProductSet);

// Removes an element from set
ProductSet.remove('HCL');
System.debug('Set with removed value '+ProductSet);

// Check whether set contains the particular element or not and returns true or false
ProductSet.contains('HCL');
System.debug('Value of Set with all values '+ProductSet);		
    }
}