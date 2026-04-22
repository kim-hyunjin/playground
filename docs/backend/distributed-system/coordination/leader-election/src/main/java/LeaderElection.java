import org.apache.zookeeper.*;
import org.apache.zookeeper.data.Stat;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class LeaderElection implements Watcher {
    private static final String ZOOKEEPER_ADDRESS = "localhost:2181";
    private static final int SESSION_TIMEOUT = 3000;
    private static final String ELECTION_NAMESPACE = "/election";
    private static final String TARGET_ZNODE = "/target_node";
    private ZooKeeper zooKeeper;
    private String currentZnodeName;

    public static void main(String[] args) throws IOException, InterruptedException, KeeperException {
        LeaderElection leaderElection = new LeaderElection();

        leaderElection.connectToZookeeper();
//        leaderElection.watchTargetZnode();
        leaderElection.volunteerForLeadership();
        leaderElection.electLeader();
        leaderElection.run();
        leaderElection.close();
        System.out.println("exiting application");
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
                return; // 내가 리더면 predecessor 없음.
            } else {
                System.out.println("I am not the leader, " + smallestChild + " is the leader");
                int predecessorIndex = Collections.binarySearch(children, currentZnodeName) - 1;
                predecessorZnodeName = children.get(predecessorIndex);
                predecessorStat = zooKeeper.exists(ELECTION_NAMESPACE+"/"+predecessorZnodeName, this);
            }
        }

        System.out.println("Watching znode " + predecessorZnodeName + "\n");
    }

    public void connectToZookeeper() throws IOException {
        this.zooKeeper = new ZooKeeper(ZOOKEEPER_ADDRESS, SESSION_TIMEOUT, this);
    }

    public void run() throws InterruptedException {
        synchronized (zooKeeper) {
            zooKeeper.wait(); // 메인 스레드 대기상태로
        }
    }

    public void close() throws InterruptedException {
        zooKeeper.close();
    }

    /**
     * TARGET_ZNODE의 데이터 조회 예제
     * @throws InterruptedException
     * @throws KeeperException
     */
    public void watchTargetZnode() throws InterruptedException, KeeperException {
        Stat stat = zooKeeper.exists(TARGET_ZNODE, this);
        if (stat == null) {
            return;
        }

        byte[] data = zooKeeper.getData(TARGET_ZNODE, this, stat);
        List<String> children = zooKeeper.getChildren(TARGET_ZNODE, this);

        System.out.println("Data: " + new String(data) + " children: " + children);
    }

    @Override
    public void process(WatchedEvent event) {
        switch (event.getType()) {
            case None:
                if (event.getState() == Event.KeeperState.SyncConnected) {
                    System.out.println("Successfully connected to Zookeeper");
                } else {
                    synchronized (zooKeeper) {
                        System.out.println("Disconnected from zookeeper event");
                        zooKeeper.notifyAll(); // 메인 스레드 깨우기
                    }
                }
                break;
            case NodeCreated:
                System.out.println(TARGET_ZNODE + " was created");
                break;
            case NodeDeleted:
//                System.out.println(TARGET_ZNODE + " was deleted");
                try {
                    // electLeader()에서 내 바로 앞번호가 존재하는지 체크 & watcher 등록
                    // NodeDeleted 이벤트를 받았다는 것은 내 앞번호가 제거됐다는 것
                    // 내 앞번호가 리더였다면 내가 리더가 될 것이고, 그렇지 않다면 내 앞번호의 앞번호를 다시 감시
                    electLeader(); // 재선출
                } catch (InterruptedException e) {
                } catch (KeeperException e) {
                }
                break;
            case NodeDataChanged:
                System.out.println(TARGET_ZNODE + " data changed");
                break;
            case NodeChildrenChanged:
                System.out.println(TARGET_ZNODE + " children changed");
                break;
        }

//        try {
//            watchTargetZnode(); // exists, getData, getChildren은 일회성이므로, 계속해서 이벤트를 받기 위해 다시 watcher 등록
//        } catch (InterruptedException e) {
//        } catch (KeeperException e) {
//        }
    }
}
