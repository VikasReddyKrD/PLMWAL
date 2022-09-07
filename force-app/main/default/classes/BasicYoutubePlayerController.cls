public class BasicYoutubePlayerController {
    @AuraEnabled
    public static void saveLastViewedDetails(String youtubeId,Decimal lastViewedSeconds){
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        List<Video_Player__c> existingvideoPlayer = [SELECT ID,Last_Viewed__c,Account__c FROM Video_Player__c WHERE Account__c=:user.accountId AND  YoutubeId__c=:youtubeId
                                               LIMIT 1];
        Video_Player__c newVideoPlayer;
        if(existingvideoPlayer.size()==0){
            newVideoPlayer= new Video_Player__c();
            newVideoPlayer.YoutubeId__c = youtubeId;
            newVideoPlayer.Last_Viewed__c = String.valueOf(lastViewedSeconds);
            newVideoPlayer.Account__c = user.AccountId;
        }
        else {
            existingvideoPlayer[0].Last_Viewed__c = String.valueOf(lastViewedSeconds);
            update existingvideoPlayer;
        }
        
        
        if(newVideoPlayer!=null){
            insert newVideoPlayer;
        }
    }
    
    @AuraEnabled
    public static String getLastViewedDetails(String youtubeId){
        User user = [Select Id,AccountId from User where Id=:userinfo.getuserId()];
        return   [SELECT ID,Last_Viewed__c,Account__c FROM Video_Player__c WHERE Account__c=:user.accountId AND  YoutubeId__c=:youtubeId
                  LIMIT 1].Last_Viewed__c;
        
    }
}