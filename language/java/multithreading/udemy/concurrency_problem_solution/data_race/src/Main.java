public class Main {
    public static void main(String[] args) {
        SharedClass sharedClass = new SharedClass();
        Thread thread1 = new Thread(() -> {
            for (int i = 0; i < Integer.MAX_VALUE; i++) {
                sharedClass.increment();
            }
        });

        Thread thread2 = new Thread(() -> {
            for (int i = 0; i < Integer.MAX_VALUE; i++) {
                sharedClass.checkForDataRace();
            }

        });

        thread1.start();
        thread2.start();
    }

    public static class SharedClass {
        private int x = 0;
        private int y = 0;

        public void increment() {
            x++;
            y++;
        }

        public void checkForDataRace() {
            /**
             * x와 y는 volatile로 선언되지 않았으며, increment() 메서드 또한 synchronized 등으로 동기화되지 않았습니다.
             * 이로 인해 CPU나 JIT 컴파일러가 성능 최적화를 위해 명령어 재배치(Instruction Reordering)를 수행할 수 있습니다.
             * 즉, increment() 메서드 내부에서 실제로는 y++가 x++보다 먼저 실행될 수 있으며,
             * 그 찰나의 순간에 checkForDataRace()가 호출되면 y > x 조건이 참이 되어 메시지가 출력될 수 있습니다.
             */
            if (y > x) {
                System.out.println("y > x - Data Race is detected");
            }
        }
    }
}
