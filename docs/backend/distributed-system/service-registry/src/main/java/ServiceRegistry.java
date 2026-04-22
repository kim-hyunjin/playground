import org.apache.zookeeper.*;
import org.apache.zookeeper.data.Stat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ServiceRegistry implements Watcher {
    private static final String REGISTRY_ZNODE = "/service_registry";
    private final ZooKeeper zooKeeper;
    private String currentZnode = null;
    private List<String> allServiceAddresses = null;

    public ServiceRegistry(ZooKeeper zooKeeper) {
        this.zooKeeper = zooKeeper;
        createServiceRegistryZnode();
    }

    /**
     * worker가 된 노드가 자신을 /service_registry에 등록
     * @param metadata 주소 정보
     * @throws InterruptedException
     * @throws KeeperException
     */
    public void registerToCluster(String metadata) throws InterruptedException, KeeperException {
        if (currentZnode != null && zooKeeper.exists(currentZnode, false) != null) {
            return;
        }
        currentZnode = zooKeeper.create(REGISTRY_ZNODE + "/n_", metadata.getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
        System.out.println("Registered to service registry - " + currentZnode);
    }

    /**
     * 리더가 된 노드가 /service_registry 에 등록된 주소목록의 업데이트를 담당하기 위해 호출
     */
    public void registerForUpdates() {
        try {
            updateAddresses();
        } catch (InterruptedException e) {
        } catch (KeeperException e) {
        }
    }

    public synchronized List<String> getAllServiceAddresses() {
        if (allServiceAddresses == null) {
            try {
                updateAddresses();
            } catch (InterruptedException e) {

            } catch (KeeperException e) {

            }
        }
        return this.allServiceAddresses;
    }

    /**
     * worker 노드에서 리더가 된 경우, /service_registry에서 자신 제거
     * @throws InterruptedException
     * @throws KeeperException
     */
    public void unregisterFromCluster() throws InterruptedException, KeeperException {
        if (currentZnode != null && zooKeeper.exists(currentZnode, false) != null) {
            zooKeeper.delete(currentZnode, -1);
            currentZnode = null;
        }
    }

    private void createServiceRegistryZnode() {
        try {
            if (zooKeeper.exists(REGISTRY_ZNODE, false) == null) {
                zooKeeper.create(REGISTRY_ZNODE, new byte[]{}, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
            }
        } catch (KeeperException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * 리더가 된 노드가 자신을 /service_registery znode의 children 감시자로 등록하고,
     * children 노드들의 주소 정보를 가져와 메모리에 보관.
     * @throws InterruptedException
     * @throws KeeperException
     */
    private synchronized void updateAddresses() throws InterruptedException, KeeperException {
        List<String> workerZnodes = zooKeeper.getChildren(REGISTRY_ZNODE, this);

        List<String> addresses = new ArrayList<>(workerZnodes.size());

        for (String workerZnode : workerZnodes) {
            String workerZnodeFullPath = REGISTRY_ZNODE + "/" + workerZnode;
            Stat stat = zooKeeper.exists(workerZnodeFullPath, false);
            if (stat == null) continue;

            byte[] addressBytes = zooKeeper.getData(workerZnodeFullPath, false, stat);
            addresses.add(new String(addressBytes));
        }

        this.allServiceAddresses = Collections.unmodifiableList(addresses);
        System.out.println("The cluster addresses are : " + this.allServiceAddresses);
    }

    @Override
    public void process(WatchedEvent event) {
        // REGISTRY_ZNODE의 children이 달라졌을 때 이벤트 받음 -> 주소목록 업데이트하기
        try {
            updateAddresses();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (KeeperException e) {
            e.printStackTrace();
        }
    }
}
