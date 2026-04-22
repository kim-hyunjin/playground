package com.eomcs.basic.ex99;

public class Exam23 {
  public static void main(String[] args) {
    java.util.Scanner scanner = new java.util.Scanner(System.in);

    // 정수와 문자열 한 줄을 입력 받기
    System.out.print("입력> ");
    int i1 = scanner.nextInt();
    int i2 = scanner.nextInt();
    String s = scanner.nextLine();  

    System.out.println("---------------");

    System.out.println(i1);
    System.out.println(i2);
    System.out.println(s); //nextInt() 다음부터 출력되기 시작.
  }
}