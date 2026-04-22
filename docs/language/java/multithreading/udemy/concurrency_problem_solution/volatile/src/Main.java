import java.util.Random;

public class Main {
    public static void main(String[] args) {
        Metrics metrics = new Metrics();

        BusinessLogic businessLogicThread1 = new BusinessLogic(metrics);

        BusinessLogic businessLogicThread2 = new BusinessLogic(metrics);

        MetricsPrinter metricsPrinter = new MetricsPrinter(metrics);

        businessLogicThread1.start();
        businessLogicThread2.start();
        metricsPrinter.start();
    }

    public static class MetricsPrinter extends Thread {
        private Metrics metrics;

        public MetricsPrinter(Metrics metrics) {
            this.metrics = metrics;
        }

        @Override
        public void run() {
            while (true) {
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                }

                double currentAverage = metrics.getAverage();

                System.out.println("Current Average is " + currentAverage);
            }
        }
    }

    public static class BusinessLogic extends Thread {
        private Metrics metrics;
        private Random random = new Random();

        public BusinessLogic(Metrics metrics) {
            this.metrics = metrics;
        }

        @Override
        public void run() {
            while (true) {
                long start = System.currentTimeMillis();

                try {
                    Thread.sleep(random.nextInt(10));
                } catch (InterruptedException e) {
                }

                long end = System.currentTimeMillis();

                metrics.addSample(end - start);
            }
        }
    }

    public static class Metrics {
        /*
        🧠 64비트 값의 비원자적 처리
        long과 double은 64비트(8바이트) 데이터 타입입니다.

        volatile이 아닌 long/double 변수에 대한 쓰기/읽기는 한 번의 원자적 연산으로 처리되지 않을 수 있습니다.

        즉, **두 개의 32비트 반쪽(half)**으로 나뉘어 별도의 두 write/read로 처리될 수 있음을 명시합니다.

        컴파일러나 JVM이 최적화를 위해 이렇게 나눠 처리할 수 있어, 한 스레드가 앞쪽 32비트를 다른 값으로 보고 뒤쪽 32비트를 또 다른 값으로 볼 수 있는 상황이 발생할 수 있습니다.

        ✅ volatile을 사용하면

        volatile long과 volatile double은 항상 원자적으로(read/write atomic) 처리됩니다.

        즉, volatile 키워드를 쓰면 64비트도 한 번에 완전하게 읽거나 쓸 수 있습니다.

        🔁 참조형(Reference) 타입은 항상 원자적

        객체 참조(reference)를 읽거나 쓰는 것은 32비트/64비트 여부와 상관없이 항상 원자적입니다.
        */
        private long count = 0;
        private volatile double average = 0.0;

        public synchronized void addSample(long sample) {
            double currentSum = average * count;
            count++;
            average = (currentSum + sample) / count;
        }

        public double getAverage() {
            return average;
        }
    }
}
