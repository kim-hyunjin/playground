package cluster.management;

public interface OnElectionCallback {

    void onElectedToLeader();

    void onWorker();
}
