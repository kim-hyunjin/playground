package com.github.kimhyunjin.basic;

import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class WeirdGugudan {
    private Queue<Integer> danQueue;
    private int[] timesArr;

    public WeirdGugudan() {
        danQueue = new LinkedList<>();
        timesArr = new int[]{1, 1, 1, 1, 1, 1, 1, 1, 1};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (true) {
            WeirdGugudan gugudan = new WeirdGugudan();

            System.out.println("한 줄에 출력할 단 수를 입력하세요. (1~9)");
            System.out.println("종료는 0");
            try {
                int inputN = Integer.parseInt(String.valueOf(sc.nextLine()));
                if (inputN >= 1 && inputN <=9) {
                    gugudan.printGugudan(inputN);

                }
                if (inputN == 0) {
                    break;
                }
            } catch (Exception e) {

            }
        }
    }

    public void printGugudan(int printDanAtOneRow) {
        int danIdx = 1;
        for (int i = 0; i < printDanAtOneRow; i++) {
            danQueue.add(danIdx);
            danIdx++;
        }

        int printIdx = 0;
        while (!danQueue.isEmpty()) {
            int dan = danQueue.poll();
            int times = timesArr[dan-1];

            for (int i = 0; i < 3; i++) {
                System.out.printf("%5d", dan*times);
                times++;
            }

            // 줄바꿈 출력
            printIdx++;
            if (printIdx == printDanAtOneRow || dan == 9) {
                System.out.println();
                printIdx = 0;
            }

            // 곱하기 9까지 안찍었으면 다시 큐에 집어넣기
            if (times != 10) {
                timesArr[dan-1] = times;
                danQueue.add(dan);
            } else {
                // 곱하기 9까지 찍은 단이 빠진 자리에 큐에 한 번도 들어가지 않은 다음 단을 집어넣기
                if (danIdx <= 9) {
                    danQueue.add(danIdx);
                    danIdx++;
                }
            }
        }
    }
}
