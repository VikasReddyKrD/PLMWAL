trigger AccountRollUpSummary on Account (After Insert, After Update, After Delete) {
    RollupsummaryAccountHandler handler = new RollupsummaryAccountHandler();
    if(Trigger.isAfter && Trigger.isInsert){
        
    }

}