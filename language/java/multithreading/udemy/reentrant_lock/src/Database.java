import java.util.*;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;


public class Database {
    public static final int HIGHEST_PRICE = 1000;

    public static void main(String[] args) throws InterruptedException {
        InventoryDatabase inventoryDatabase = new InventoryDatabase();

        Random random = new Random();
        for (int i = 0; i < 100000; i++) {
            inventoryDatabase.addItem(random.nextInt(HIGHEST_PRICE));
        }

        Thread writer = new Thread(() -> {
            while (true) {
                inventoryDatabase.addItem(random.nextInt(HIGHEST_PRICE));
                inventoryDatabase.removeItem(random.nextInt(HIGHEST_PRICE));
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                }
            }
        });

        writer.setDaemon(true);
        writer.start();

        List<Thread> readers = getReaders(inventoryDatabase);

        long startReadingTime = System.currentTimeMillis();
        for (Thread reader : readers) {
            reader.start();
        }

        for (Thread reader : readers) {
            reader.join();
        }

        long endReadingTime = System.currentTimeMillis();

        System.out.printf("Reading took %d ms%n", endReadingTime - startReadingTime);
    }

    private static List<Thread> getReaders(InventoryDatabase inventoryDatabase) {
        Random random = new Random();
        int numberOfReaderThreads = 7;
        List<Thread> readers = new ArrayList<>();

        for (int readerIndex = 0; readerIndex < numberOfReaderThreads; readerIndex++) {
            Thread reader = new Thread(() -> {
                for (int i = 0; i < 100000; i++) {
                    int upperBoundPrice = random.nextInt(HIGHEST_PRICE);
                    int lowerBoundPrice = upperBoundPrice > 0 ? random.nextInt(upperBoundPrice) : 0;
                    int numberOfItems = inventoryDatabase.getNumberOfItemsInPriceRange(lowerBoundPrice, upperBoundPrice);
                }
            });

            reader.setDaemon(true);
            readers.add(reader);
        }
        return readers;
    }

    public static class InventoryDatabase {
        private final TreeMap<Integer, Integer> priceToCountMap = new TreeMap<>();
        private final ReentrantReadWriteLock reentrantReadWriteLock = new ReentrantReadWriteLock();
        private final Lock readLock = reentrantReadWriteLock.readLock();
        private final Lock writeLock = reentrantReadWriteLock.writeLock();
        private final Lock lock = new ReentrantLock();
        boolean useReadWriteLock = true; // 그냥 ReentrantLock을 사용할 때와 ReentrantReadWriteLock을 사용할 때 성능 비교를 위한 플래그

        public int getNumberOfItemsInPriceRange(int lowerBound, int upperBound) {
            readLock();
            try {
                Integer fromKey = priceToCountMap.ceilingKey(lowerBound);

                Integer toKey = priceToCountMap.floorKey(upperBound);

                if (fromKey == null || toKey == null) {
                    return 0;
                }

                NavigableMap<Integer, Integer> rangeOfPrices = priceToCountMap.subMap(fromKey, true, toKey, true);

                int sum = 0;
                for (int numberOfItemsForPrice : rangeOfPrices.values()) {
                    sum += numberOfItemsForPrice;
                }

                return sum;
            } finally {
                unlockReadLock();
            }
        }

        public void addItem(int price) {
            writeLock();
            try {
                priceToCountMap.merge(price, 1, Integer::sum);
            } finally {
                unlockWriteLock();
            }
        }

        public void removeItem(int price) {
            writeLock();
            try {
                Integer numberOfItemsForPrice = priceToCountMap.get(price);
                if (numberOfItemsForPrice == null || numberOfItemsForPrice == 1) {
                    priceToCountMap.remove(price);
                } else {
                    priceToCountMap.put(price, numberOfItemsForPrice - 1);
                }
            } finally {
                unlockWriteLock();
            }
        }

        private void readLock() {
            if (useReadWriteLock) {
                readLock.lock();
            } else {
                lock.lock();
            }
        }

        private void writeLock() {
            if (useReadWriteLock) {
                writeLock.lock();
            } else {
                lock.lock();
            }
        }

        private void unlockReadLock() {
            if (useReadWriteLock) {
                readLock.unlock();
            } else {
                lock.unlock();
            }
        }

        private void unlockWriteLock() {
            if (useReadWriteLock) {
                writeLock.unlock();
            } else {
                lock.unlock();
            }
        }

    }
}
