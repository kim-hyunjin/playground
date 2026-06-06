private static final int NUMBER_OF_VIRTUAL_THREADS = 100;

void main() throws InterruptedException {
    List<Thread> virtualThreads = new ArrayList<>();

    for (int i = 0; i < NUMBER_OF_VIRTUAL_THREADS; i++) {
        Thread virtualThread = Thread.ofVirtual().unstarted(new BlockingTask());
        virtualThreads.add(virtualThread);
    }

    for (Thread virtualThread : virtualThreads) {
        virtualThread.start();
    }

    for (Thread virtualThread : virtualThreads) {
        virtualThread.join();
    }
}

private static class BlockingTask implements Runnable {

    /*
     * 블로킹 호출(sleep) 시 Virtual Thread는 Carrier 스레드에서 언마운트된다.
     * sleep 이후 재개될 때 이전과 다른 Carrier 스레드(워커)에 마운트될 수 있다.
     * 스케줄링 순서도 실행마다 달라질 수 있다. (비결정적)
     */
    @Override
    public void run() {
        IO.println("Inside thread: " + Thread.currentThread() + " before blocking call");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        IO.println("Inside thread: " + Thread.currentThread() + " after blocking call");
    }
}