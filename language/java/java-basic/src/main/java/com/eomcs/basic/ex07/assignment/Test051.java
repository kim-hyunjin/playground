package com.eomcs.basic.ex07.assignment;

import java.util.Scanner;

// 과제: 재귀호출을 이용하여 직삼각형을 출력하라.
// 실행)
// 밑변의 길이? 5
// *
// **
// ***
// ****
// *****
//
public class Test051 {
  public static void main(String[] args) {
    int base = 0;
    Scanner keyboard = new Scanner(System.in);
    System.out.print("밑변의 길이? ");
    base = keyboard.nextInt();
    printTriangle(base);
    keyboard.close();
  }

  static void printTriangle(int base) {
    if (base == 0)
      return;
    
    printTriangle(base - 1);
    
    for (int i = 0; i < base; i++) {
      System.out.print("*");
    }
    System.out.println();
  }
}





