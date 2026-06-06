package com.eomcs.basic.ex07.assignment;

import java.util.Scanner;

// 과제: 재귀호출을 이용하여 n! 을 계산하라.
// 실행)
// 입력? 5
// 5! = 1 * 2 * 3 * 4 * 5 = 120
//
public class Test04 {
  public static void main(String[] args) {
    int n = 0;
    Scanner keyboard = new Scanner(System.in);
    System.out.print("입력? ");
    n = keyboard.nextInt();
    int result = factorial(n);
    System.out.printf("%d! = ", n);
    for (int i = 1; i < n; i++) {
      System.out.printf("%d * ", i);
    }
    System.out.printf("%d = ", n);
    System.out.println(result);
  }
  static int factorial(int n) {
    if(n == 1) {
      return 1;
    }
    return  n * factorial(n-1);
  }
}





