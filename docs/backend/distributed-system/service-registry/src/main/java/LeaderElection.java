import org.apache.zookeeper.*;
import org.apache.zookeeper.data.Stat;

import java.util.Collections;
import java.util.List;

public class LeaderElection implements Watcher {
    private static final String ELECTION_NAMESPACE = "/election";
    private String currentZnodeName;
    private final ZooKeeper zooKeeper;
    private final OnElectionCallback onElectionCallback;
    private boolean isRegisteredAsWorker = false;

    public LeaderElection(ZooKeeper zooKeeper, OnElectionCallback onElectionCallback) {
        this.zooKeeper = zooKeeper;
        this.onElectionCallback = onElectionCallback;
    }


    public void volunteerForLeadership() throws InterruptedException, KeeperException {
        String znodePrefix = ELECTION_NAMESPACE + "/c_";
        String znodeFullPath = zooKeeper.create(znodePrefix, new byte[]{}, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);

        System.out.println("znode name " + znodeFullPath);
        this.currentZnodeName = znodeFullPath.replace(ELECTION_NAMESPACE+"/", "");
    }

    /**
     * 내가 가장 작은 번호면 리더.
     * 리더가 아닐경우 나보다 바로 앞 사람이 존재하는지 확인.
     * @throws InterruptedException
     * @throws KeeperException
     */
    public void electLeader() throws InterruptedException, KeeperException {
        Stat predecessorStat = null;
        String predecessorZnodeName = "";

        while (predecessorStat == null) {
            List<String> children = zooKeeper.getChildren(ELECTION_NAMESPACE, false);

            Collections.sort(children);
            String smallestChild = children.get(0);

            if (smallestChild.equals(currentZnodeName)) {
                System.out.println("I am the reader");
                isRegisteredAsWorker = false;
                onElectionCallback.onElectedToLeader();
                return; // 내가 리더면 predecessor 없음.
            } else {
                System.out.println("I am not the leader, " + smallestChild + " is the leader");
                int predecessorIndex = Collections.binarySearch(children, currentZnodeName) - 1;
                predecessorZnodeName = children.get(predecessorIndex);
                predecessorStat = zooKeeper.exists(ELECTION_NAMESPACE+"/"+predecessorZnodeName, this);
            }
        }

        if (!isRegisteredAsWorker) {
            onElectionCallback.onWorker();
            isRegisteredAsWorker = true;
        }
        System.out.println("Watching znode " + predecessorZnodeName + "\n");
    }

    @Override
    public void process(WatchedEvent event) {
        switch (event.getType()) {
            case NodeDeleted:
                try {
                    electLeader(); // 재선출
                } catch (InterruptedException e) {
                } catch (KeeperException e) {
                }
                break;
        }
    }
}
