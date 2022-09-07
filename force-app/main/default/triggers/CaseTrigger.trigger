trigger CaseTrigger on Case (before insert) {
    for(Case ob:Trigger.New){
    if(ob.Origin=='Email')
    {
       ob.Status='Working';
        ob.Priority='Low';
    }
}
}