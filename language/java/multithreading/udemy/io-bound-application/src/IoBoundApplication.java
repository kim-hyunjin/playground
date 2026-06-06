/*
  1초가 소요되는 작업 1000개를 약 1초에 끝냄.
  하지만 작업을 10_000개로 늘리면 다음 에러 발생
  unable to create native thread: possibly out of memory or process/resource limits reached
 */
private static final int NUMBER_OF_TASKS = 1000;

void main() {
    System.out.printf("Running %d tasks\n", NUMBER_OF_TASKS);

    long start = System.currentTimeMillis();
    performTasks();
    System.out.printf("Tasks took %dms to complete\n", System.currentTimeMillis() - start);
}

private static void performTasks() {
    try (ExecutorService executorService = Executors.newCachedThreadPool()) {

        for (int i = 0; i < NUMBER_OF_TASKS; i++) {
            executorService.submit(() -> blockingIoOperation());
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