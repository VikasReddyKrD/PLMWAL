({
    handleRouteChange : function(component,event,helper){
        console.log('Title of page is '+window.document.title);
        var title = window.document.title;
        //Below are the attributes created for setting the class (Active or not) dynamically using title
        component.set("v.dashboardClass","");
        component.set("v.surveyClass","");
        component.set("v.resourcesClass","");
        component.set("v.supportClass","");

        if(title == "Surveys"){
            console.log('Surveys');
            component.set("v.surveyClass","active");
        }
        if(title == "Resources"){
            component.set("v.resourcesClass","active");
        }
        if(title == "Support"){
            component.set("v.supportClass","active");
        }
        if(title == "Home"){
            component.set("v.link","/wal/s");
            component.set("v.dashboardClass","active");
        }

       var idd = $A.get('$SObjectType.CurrentUser.Id');
       var action = component.get("c.getStatusOfSurveys");
       console.log('Action is '+action);
       action.setParams({
           'userId': idd    
       }); 
       action.setCallback(this, function(response){
           var state = response.getState();
           if(state == "SUCCESS") {
                var status = response.getReturnValue();
                component.set("v.status",status['MDD-Survey-1']);
                console.log('Status is '+component.get("v.status"));
                var status = component.get("v.status");
                //console.log('statuss is '+statuss);
                if(status == true && title !='Home'){
                    component.set('v.link','/wal/s');
                }
                else if(!status){
                    component.set('v.link','');
                    component.set("v.dashboardClass","disabled");
                }

                if(status == true && title=='Home'){
                    component.set('v.link','/wal/s');
                    component.set("v.dashboardClass","active");
                }
                
                console.log('Dashboard class '+ component.get("v.dashboardClass"));
            }
       });
       $A.enqueueAction(action);
   },

//    onRender: function (component, helper){
//     var elements = component.getElements();
//     console.log('Elements list is -- In afterRender v1 '+elements[0]);
//     console.log('Elements is -- In afterRender v1'+elements.length);
//    }
})