package demo;

public class RunnableCounter implements Runnable {
    private final long from;
    private final long to;

    public RunnableCounter(long from, long to) {
        this.from = from;
        this.to = to;
    }

    @Override
    public void run() {
        for(long i = from; i <= to; i++) {
            try {
                Thread.sleep(1);
                System.out.println(i);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
