package com.eomcs.basic.ex05.assignment;

import java.util.Scanner;

public class Test01 {
  public static void main(String[] args) {
    Scanner input = new Scanner(System.in);
    System.out.println("시작 정수 ~ 끝 정수까지의 합 구하기");
    System.out.println("***********************************");
    System.out.print("시작 정수를 입력하세요> ");
    int a = input.nextInt();
    System.out.print("끝 정수를 입력하세요> ");
    int b = input.nextInt();
    
    int total = 0;
    for (int i = a; i < b+1; i++) {
      total += i;
    }
    
    System.out.println("-----------------------------------");
    System.out.printf("%d에서 %d까지의 합은 %d입니다.", a, b, total);
  }
  
}
