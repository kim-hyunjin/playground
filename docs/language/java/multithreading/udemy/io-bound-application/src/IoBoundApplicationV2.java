private static final int NUMBER_OF_TASKS = 10_000;

void main() {
    System.out.printf("Running %d tasks\n", NUMBER_OF_TASKS);

    long start = System.currentTimeMillis();
    performTasks();
    System.out.printf("Tasks took %dms to complete\n", System.currentTimeMillis() - start);
}

private static void performTasks() {
    /*
     * 스레드 개수를 1000개로 고정해 에러 없이 10_000개의 작업을 약 10초에 끝냄
     * */
    try (ExecutorService executorService = Executors.newFixedThreadPool(1000)) {

        for (int i = 0; i < NUMBER_OF_TASKS; i++) {
            executorService.submit(() -> blockingIoOperation());

            /*
             * 아래의 경우 10ms 작업을 100회 수행하는데 1초보다 훨씬 많은 시간이 걸림.
             * 너무 빈번하게 컨텍스트 스위칭이 발생하기 때문.
             *
             * 스레드는 비용이 크다
             * - 생성할 수 있는 스레드 수는 제한되어 있다
             * - 스레드는 스택 메모리와 기타 자원을 소비한다
             * - 스레드가 너무 많으면 - 애플리케이션이 크래시된다
             * - 스레드가 너무 적으면 - 처리량과 CPU 활용률이 낮아진다
             *
             * 컨텍스트 스위칭의 비용
             * - OS는 CPU를 최대한 활용하려 한다
             * - 블로킹 호출이 발생하는 즉시, OS는 해당 스레드의 스케줄을 해제한다
             * - 스레드가 너무 많고 블로킹 호출이 잦으면, CPU가 OS 코드를 실행하느라 바빠진다
             * 스레드 스래싱(Thrashing): CPU 대부분이 시스템을 관리하는 OS에 의해 소비되는 상황
             *
             * 스레드-퍼-태스크(Thread-Per-Task)는 수십 년간 표준으로 사용되어 왔다
             * 하지만 최적의 성능을 제공하지는 못한다
             * - 성능(Performance)
             * - CPU 활용률(CPU Utilization)
             * */
//            executorService.submit(() -> blockingIoOperationV2());
        }
    }
}

// Simulates a long blocking IO
private static void blockingIoOperation() {
    IO.println("Executing a blocking task from thread: " + Thread.currentThread());
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
}

private static void blockingIoOperationV2() {
    IO.println("Executing a blocking task from thread: " + Thread.currentThread());
    try {
        for (int i = 0; i < 100; i++) {
            Thread.sleep(10);
        }
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
}