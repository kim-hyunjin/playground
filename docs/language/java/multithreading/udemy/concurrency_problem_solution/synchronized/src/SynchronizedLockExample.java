public class SynchronizedLockExample {
    public static void main(String[] args) throws InterruptedException {
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
        private int items = 0;
        private final Object lock = new Object();

        /*
         * 별도의 락 객체를 사용하는 synchronized 블록 방식입니다.
         * synchronized(lock)을 사용하면 'lock' 객체의 모니터를 획득해야만 블록 내부를 실행할 수 있습니다.
         * 이 방식은 객체 전체(this)에 락을 거는 대신 특정 객체에만 락을 걸어 세밀한 제어가 가능하며,
         * 외부에서 해당 객체의 락을 임의로 획득하는 것을 방지할 수 있어 더 안전합니다.
         */
        public void increment() {
            synchronized (this.lock) {
                items++;
            }
        }

        public void decrement() {
            synchronized (this.lock) {
                items--;
            }
        }

        public int getItems() {
            synchronized (this.lock) {
                return items;
            }
        }
    }
}
