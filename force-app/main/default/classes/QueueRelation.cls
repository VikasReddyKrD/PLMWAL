public class QueueRelation implements Queueable {
    public void execute(QueueableContext Context)
    {
        System.enqueueJob(new QueuableExample());
        System.debug('Relation of one');
    }

}