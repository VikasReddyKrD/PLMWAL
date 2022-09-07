({
    handleClick : function(component, event, helper) {
helper.sendMessage(component, event);
    },
    handleRetreive : function(component, event, helper){
        helper.getMessage(component, event);
    }
})