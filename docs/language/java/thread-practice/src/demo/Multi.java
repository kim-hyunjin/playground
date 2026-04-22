package demo;

import java.util.ArrayList;
import java.util.Scanner;

public class Multi {
    public static void main(String[] args) {
        long countNum;
        int threadNum;
        ArrayList<Thread> threads = new ArrayList<>();
        Scanner scanner = new Scanner(System.in);
        try {
            System.out.println("숫자를 입력하세요.");
            countNum = scanner.nextLong();
            System.out.println("쓰레드 수를 입력하세요.");
            threadNum = scanner.nextInt();
            long countNumDivide = Math.floorDiv(countNum, threadNum);
            long before = System.currentTimeMillis();
            for(int i = 0; i < threadNum; i++) {
                Thread t = null;
                if(i + 1 == threadNum && countNumDivide*threadNum != countNum) {
                    t = new Thread(new RunnableCounter(countNumDivide*i+1, countNum));
                } else {
                    t = new Thread(new RunnableCounter(countNumDivide*i+1, countNumDivide*(i+1)));
                }
                t.start();
                threads.add(t);
            }

            for(int i = 0; i < threads.size(); i++) {
                Thread t = threads.get(i);
                t.join();
            }
            long after = System.currentTimeMillis();
            System.out.printf("총 소요시간: %d", after - before);
        } catch (NumberFormatException e) {
            System.out.println("숫자를 입력해주세요.");
        } catch (InterruptedException e) {
            System.out.println("쓰레드 작업 수행 중 에러 발생...");
        }


    }
}
