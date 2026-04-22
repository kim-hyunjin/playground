private static final int NUMBER_OF_VIRTUAL_THREADS = 1000;

/*
 * JDK 21부터 도입된 Virtual Thread 사용 예제.
 *
 * Virtual Thread 특징:
 * - 자바 오브젝트로서 JVM 힙(heap)에 존재하며, OS 스레드와 달리 매우 가볍다.
 * - Carrier 스레드(플랫폼 스레드)는 OS 스레드와 1:1 대응된다.
 * - Carrier 스레드가 Virtual Thread를 마운트(mount)하여 실행하고,
 *   블로킹 시 언마운트(unmount)하여 다른 Virtual Thread를 실행한다.
 * - 작업이 끝난 Virtual Thread는 일반 자바 객체처럼 GC에 의해 수거된다.
 */
void main() throws InterruptedException {
    // 출력 예: VirtualThread[#1024]/runnable@ForkJoinPool-1-worker-4
    // 1000개의 Virtual Thread가 소수의 Carrier 스레드(워커)에 의해 실행된다.
    // 워커 수는 기본적으로 CPU 코어 수와 동일 (Runtime.getRuntime().availableProcessors())
    Runnable runnable = () -> IO.println("Inside thread: " + Thread.currentThread());

    List<Thread> virtualThreads = new ArrayList<>();

    for (int i = 0; i < NUMBER_OF_VIRTUAL_THREADS; i++) {
        Thread virtualThread = Thread.ofVirtual().unstarted(runnable);
        virtualThreads.add(virtualThread);
    }

    for (Thread virtualThread : virtualThreads) {
        virtualThread.start();
    }

    for (Thread virtualThread : virtualThreads) {
        virtualThread.join();
    }
}
