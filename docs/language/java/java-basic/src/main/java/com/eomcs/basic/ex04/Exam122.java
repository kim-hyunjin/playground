package com.eomcs.basic.ex04;

public class Exam122 {
  public static void main(String[] args) {
    // 여러 개의 변수 선언과 값 초기화시키기
    int i = 0, j, k = 10;
    char c = '가';
    String s = "string";
    System.out.printf("%d %c %s\n", i, c, s);
    System.out.println((int)(c));
    System.out.println(i + k + c + s);  //문자 코드에 정수가 더해져 문자코드를 정수로 취급.
  }
}