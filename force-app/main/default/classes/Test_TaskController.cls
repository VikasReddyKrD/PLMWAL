@isTest
public class Test_TaskController {
    testmethod static void getTasks(){
		Task T = new Task();
   		T.Subject='Call';
        T.Status= 'Not Started';
        T.Priority='High';
     insert T;
	
        TaskController.getTasks();
    }
}