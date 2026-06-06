import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class Application implements Watcher {
    private static final String ZOOKEEPER_ADDRESS = "localhost:2181";
    private static final int SESSION_TIMEOUT = 3000;
    private static final int DEFAULT_PORT = 8080;
    private ZooKeeper zooKeeper;


    public static void main(String[] args) throws IOException, InterruptedException, KeeperException {
        int currentServerPort = args.length == 1 ? Integer.parseInt(args[0]) : DEFAULT_PORT;
        Application application = new Application();
        ZooKeeper zooKeeper = application.connectToZookeeper();
        ServiceRegistry serviceRegistry = new ServiceRegistry(zooKeeper);

        LeaderElection leaderElection = new LeaderElection(zooKeeper, new OnElectionCallback() {
            @Override
            public void onElectedToLeader() {
                try {
                    serviceRegistry.unregisterFromCluster();
                    serviceRegistry.registerForUpdates();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (KeeperException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onWorker() {
                try {
                    String currentServerAddress = String.format("http://%s:%d", InetAddress.getLocalHost().getCanonicalHostName(), currentServerPort);
                    serviceRegistry.registerToCluster(currentServerAddress);
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (KeeperException e) {
                    e.printStackTrace();
                }
            }
        });
        leaderElection.volunteerForLeadership();
        leaderElection.electLeader();

        application.run();
        application.close();
        System.out.println("exiting application");
    }

    public ZooKeeper connectToZookeeper() throws IOException {
        this.zooKeeper = new ZooKeeper(ZOOKEEPER_ADDRESS, SESSION_TIMEOUT, this);
        return zooKeeper;
    }

    public void run() throws InterruptedException {
        synchronized (zooKeeper) {
            zooKeeper.wait(); // 메인 스레드 대기상태로
        }
    }

    public void close() throws InterruptedException {
        zooKeeper.close();
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
        }
    }
}
