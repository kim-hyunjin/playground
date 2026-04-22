void main() throws InterruptedException {
    Thread thread = new Thread(new BlockingTask());
    thread.start();
    thread.interrupt();

    Thread longComputationThread = new Thread(new LongComputationTask(new BigInteger("2"), new BigInteger("10000000")));

    longComputationThread.setDaemon(true);
    /** => 데몬 스레드란?
     * 1. 주 스레드의 작업을 돕는 보조적인 역할을 수행하는 스레드
     * 2. 주 스레드가 종료되면 데몬 스레드는 강제적으로 자동 종료된다.
     */
    longComputationThread.start();
    longComputationThread.interrupt();

    List<Long> inputNumbers = Arrays.asList(0L, 10L, 100L, 200L, 3000L, 4000L, 5000L);
    List<FactorialThread> factorialThreads = new ArrayList<>();
    for (Long inputNumber : inputNumbers) {
        factorialThreads.add(new FactorialThread(inputNumber));
    }
    for (FactorialThread factorialThread : factorialThreads) {
        factorialThread.start();
        factorialThread.join(2000);
        /**
         * 1. join()의 기본 동작
         * join()을 호출한 스레드(주로 메인 스레드)는 join() 대상이 된 스레드가 작업을 마치고 종료될 때까지 대기(WAITING) 상태가 됩니다.
         * 위 코드의 경우
         * • 만약 factorialThread가 2초 안에 작업을 끝내면, 메인 스레드는 즉시 대기를 멈추고 다음 코드를 실행합니다.
         * • 만약 2초가 지나도 작업이 끝나지 않으면, 메인 스레드는 기다림을 포기하고 다음 단계로 넘어갑니다.
         */
    }
    for (int i = 0; i < inputNumbers.size(); i++) {
        FactorialThread factorialThread = factorialThreads.get(i);
        if(factorialThread.isFinished()) {
            System.out.println("Factorial of " + inputNumbers.get(i) + " is " + factorialThread.getResult());
        } else {
            System.out.println("The calculation for "  + inputNumbers.get(i) + " is still in progress");
        }
    }
}

private static class BlockingTask implements Runnable {

    @Override
    public void run() {
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            System.out.println("Exiting blocking thread");
        }
    }
}

private static class LongComputationTask implements Runnable {
    private BigInteger base;
    private BigInteger power;

    public LongComputationTask(BigInteger base, BigInteger power) {
        this.base = base;
        this.power = power;
    }

    @Override
    public void run() {
        System.out.println(base+"^"+power+" = "+pow(base, power));
    }

    private BigInteger pow(BigInteger base, BigInteger power) {
        BigInteger result = BigInteger.ONE;
        for (BigInteger i = BigInteger.ZERO; i.compareTo(power) !=0; i = i.add(BigInteger.ONE)) {
            if (Thread.currentThread().isInterrupted()) {
                System.out.println("Prematurely interrupted");
                return BigInteger.ZERO;
            }
            result = result.multiply(base);
        }

        return result;
    }
}

private static class FactorialThread extends Thread {
    private final long inputNumber;
    private BigInteger result = BigInteger.ZERO;
    private boolean isFinished = false;

    public FactorialThread(long inputNumber) {
        this.inputNumber = inputNumber;
    }

    @Override
    public void run() {
        this.result = factorial(inputNumber);
        isFinished = true;
    }

    private BigInteger factorial(long n) {
        BigInteger result = BigInteger.ONE;
        for (long i = n; i > 0; i--) {
            result = result.multiply(BigInteger.valueOf(i));
        }
        return result;
    }
    public boolean isFinished() {
        return isFinished;
    }
    public BigInteger getResult() {
        return result;
    }
}