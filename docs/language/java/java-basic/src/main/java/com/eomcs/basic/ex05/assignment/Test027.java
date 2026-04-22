package com.eomcs.basic.ex05.assignment;

//# 과제2 : 다섯 개의 정수 값을 입력 받고 최소, 최대값 구하기
//실행 예)
//입력? 4 17 -1 6 9
//최소값: -1
//최대값: 17
//


import java.util.Scanner;

public class Test027 {

  public static void main(String[] args) {
    Scanner keyScan = new Scanner(System.in);

    int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;

    System.out.print("입력? ");
    for (int i = 0; i < 5; i++) {
      int no = keyScan.nextInt();
      
      min = (no < min ? no : min);
      max = (no > max ? no : max);
      }

    System.out.printf("최소값: %d\n", min);
    System.out.printf("최대값: %d", max);

    keyScan.close();
  }

}
