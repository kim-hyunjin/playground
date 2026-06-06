import java.util.Random;

/**
 * [잠금 방식의 분류]
 * 1. Coarse-grained locking:
 *    - 프로그램 전체나 큰 단위의 리소스를 하나의 잠금장치(Lock)로 보호하는 방식입니다.
 *    - 구현은 쉽지만, 여러 스레드가 동시에 접근할 수 있는 영역이 좁아져 성능 저하(병목 현상)가 발생할 수 있습니다.
 *
 * 2. Fine-grained locking:
 *    - 리소스를 세분화하여 각 리소스마다 별도의 잠금장치를 사용하는 방식입니다.
 *    - 병렬성은 높아지지만, 여러 잠금장치를 동시에 사용하다 보면 '데드락(Deadlock)'이 발생할 위험이 있습니다.
 *
 * [데드락(Deadlock) 해결 방법]
 * 1. 잠금 순서 강제하기 (Lock Ordering):
 *    - 모든 스레드가 정해진 순서대로만 잠금을 획득하도록 강제하는 방법입니다.
 *    - 가장 간단하고 효과적이지만, 잠금의 개수가 많아지면 유지보수가 어려울 수 있습니다.
 *
 * 2. 잠금 순서를 강제하기 어려운 경우의 대안:
 *    - Watchdog (감시 스레드): 데드락 상태를 감시하고 해결합니다.
 *    - Thread Interruption (스레드 중단): 특정 스레드에 중단 신호를 보내 잠금을 해제하게 합니다.
 *    - tryLock (시도 후 포기): 잠금을 획득하려고 시도하다가 실패하면 즉시 포기하거나 일정 시간 후 재시도합니다.
 */
public class Main {
    public static void main(String[] args) {
        Intersection intersection = new Intersection();
        Thread trainAThread = new Thread(new TrainA(intersection));
        Thread trainBThread = new Thread(new TrainB(intersection));

        trainAThread.start();
        trainBThread.start();
    }

    public static class TrainB implements Runnable {
        private Intersection intersection;
        private Random random = new Random();

        public TrainB(Intersection intersection) {
            this.intersection = intersection;
        }

        @Override
        public void run() {
            while (true) {
                long sleepingTime = random.nextInt(5);
                try {
                    Thread.sleep(sleepingTime);
                } catch (InterruptedException e) {
                }

                intersection.takeRoadB();
            }
        }
    }

    public static class TrainA implements Runnable {
        private Intersection intersection;
        private Random random = new Random();

        public TrainA(Intersection intersection) {
            this.intersection = intersection;
        }

        @Override
        public void run() {
            while (true) {
                long sleepingTime = random.nextInt(5);
                try {
                    Thread.sleep(sleepingTime);
                } catch (InterruptedException e) {
                }

                intersection.takeRoadA();
            }
        }
    }

    public static class Intersection {
        private Object roadA = new Object();
        private Object roadB = new Object();

        public void takeRoadA() {
            synchronized (roadA) {
                System.out.println("Road A is locked by thread " + Thread.currentThread().getName());

                synchronized (roadB) {
                    System.out.println("Train is passing through road A");
                    try {
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                    }
                }
            }
        }

        public void takeRoadB() {
            synchronized (roadB) {
                System.out.println("Road B is locked by thread " + Thread.currentThread().getName());

                synchronized (roadA) {
                    System.out.println("Train is passing through road B");

                    try {
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                    }
                }
            }
        }
    }
}
