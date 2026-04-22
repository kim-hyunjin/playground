package com.eomcs.basic.ex99;

public class Exam231 {
  public static void main(String[] args) {
    java.util.Scanner scanner = new java.util.Scanner(System.in);

    // nextInt() 다음에 nextLine()을 호출할 때 공백 문자가 읽히는 문제 해결
    System.out.print("입력> ");
    int i1 = scanner.nextInt();
    int i2 = scanner.nextInt();

    String s1 = scanner.next();   //=> 다음의 완전한 토큰을 읽는다. 한 개의 토큰(단어)은 앞 뒤 공백으로 구분된다.

    System.out.println("---------------");

    System.out.println(i1);
    System.out.println(i2);
    System.out.println(s1);
  }
}