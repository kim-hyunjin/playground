private static final int NUMBER_OF_TASKS = 10_000;

void main() {
    System.out.printf("Running %d tasks\n", NUMBER_OF_TASKS);

    long start = System.currentTimeMillis();
    performTasks();
    System.out.printf("Tasks took %dms to complete\n", System.currentTimeMillis() - start);
}

private static void performTasks() {
    /*
     * 기존 플랫폼 스레드로 1만 개의 스레드를 생성하면 메모리 부족(OOM)으로 앱이 크래시되지만,
     * Virtual Thread는 작업당 스레드를 생성해도 크래시되지 않는다.
     *
     * 스래싱(Thrashing)도 발생하지 않는다:
     * - Virtual Thread의 마운트/언마운트 비용이 OS 스레드의 컨텍스트 스위칭보다 훨씬 저렴하다.
     * - OS 스레드는 스택 메모리(~1MB)를 차지하지만, Virtual Thread는 수백 바이트 수준이다.
     */
    try (ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor()) {

        for (int i = 0; i < NUMBER_OF_TASKS; i++) {
            executorService.submit(new Runnable() {
                @Override
                public void run() {
                    for (int j = 0; j < 100; j++) {
                        blockingIoOperation();
                    }
                }
            });
        }
    }
}

// Simulates a long blocking IO
private static void blockingIoOperation() {
    IO.println("Executing a blocking task from thread: " + Thread.currentThread());
    try {
        Thread.sleep(10);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
}