package com.github.kimhyunjin.basic;

import java.util.Scanner;

public class Star {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (true) {
            System.out.println("\n***** 별찍기 *****");
            System.out.print("모양을 정하세요 - (1)다이아몬드, (2)모래시계, (0)종료 > ");
            int shape = Integer.parseInt(sc.nextLine());
            if (shape == 0) {
                System.exit(1);
            }
            System.out.print("최대 별 개수를 정하세요 : ");
            int maxStar = Integer.parseInt(sc.nextLine());

            System.out.println();
            switch (shape) {
                case 1:
                    printDiamond(maxStar);
                    break;
                case 2:
                    printHourglass(maxStar);
                    break;
                default:
                    System.out.println("유효한 숫자를 입력해주세요.");
            }
            System.out.println();

        }

    }

    private static void printDiamond(int maxStar) {
        // 1 3 5 7
        // 3 2 1 0
        for (int i = 1; i<=maxStar; i++) {
            if (i%2 == 1) {
                printBlankAndStar(i, maxStar);
            }
        }
        // 5 3 1
        // 1 2 3
        for (int i = maxStar-2; i>=1; i--) {
            if (i%2 == 1) {
                printBlankAndStar(i, maxStar);
            }
        }
    }

    private static void printHourglass(int maxStar) {
        // 7 5 3 1
        // 0 1 2 3
        for (int i = maxStar; i >=1; i--) {
            if (i%2 == 1) {
                printBlankAndStar(i, maxStar);
            }
        }

        // 3 5 7
        // 2 1 0
        for (int i = 3; i <= maxStar; i++) {
            if (i%2 == 1) {
                printBlankAndStar(i, maxStar);
            }
        }
    }

    private static void printBlankAndStar(int idx, int maxLength) {
        int star = idx;
        int blank = (maxLength - star) / 2;
        for (int j = 0; j < blank; j++) {
            System.out.print(" ");
        }
        for (int j = 0; j < star; j++) {
            System.out.print("*");
        }
        System.out.print("\n");
    }
}
