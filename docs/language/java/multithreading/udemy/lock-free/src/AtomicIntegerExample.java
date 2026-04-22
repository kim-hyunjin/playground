import java.util.concurrent.atomic.AtomicInteger;


void main() throws InterruptedException {
    InventoryCounter inventoryCounter = new InventoryCounter();
    IncrementingThread incrementingThread = new IncrementingThread(inventoryCounter);
    DecrementingThread decrementingThread = new DecrementingThread(inventoryCounter);

    incrementingThread.start();
    decrementingThread.start();

    incrementingThread.join();
    decrementingThread.join();

    System.out.println("We currently have " + inventoryCounter.getItems() + " items");
}

public static class DecrementingThread extends Thread {

    private InventoryCounter inventoryCounter;

    public DecrementingThread(InventoryCounter inventoryCounter) {
        this.inventoryCounter = inventoryCounter;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10000; i++) {
            inventoryCounter.decrement();
        }
    }
}

public static class IncrementingThread extends Thread {

    private InventoryCounter inventoryCounter;

    public IncrementingThread(InventoryCounter inventoryCounter) {
        this.inventoryCounter = inventoryCounter;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10000; i++) {
            inventoryCounter.increment();
        }
    }
}

private static class InventoryCounter {
    /*
     * AtomicInteger는 락을 사용하는 복잡함 없이 동시성 카운팅을 위한 훌륭한 도구입니다.
     * AtomicInteger는 원자적 연산이 필요할 때만 사용해야 합니다.
     * 락으로 보호되는 일반 정수와 동등하거나 때로는 더 높은 성능을 보입니다.
     * 단일 스레드에서만 사용된다면 일반 정수가 선호됩니다.
    * */
    private AtomicInteger items = new AtomicInteger(0);

    public void increment() {
        items.incrementAndGet();
    }

    public void decrement() {
        items.decrementAndGet();
    }

    public int getItems() {
        return items.get();
    }
}

