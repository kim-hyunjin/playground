package com.eomcs.basic.ex06;

//# 흐름 제어문 - for 반복문
//
public class Exam0410 {
  public static void main(String[] args) {
    // for (변수선언 및 초기화; 조건; 증감문) 문장;
    // for (변수선언 및 초기화; 조건; 증감문) {문장1; 문장2; ...}

    // for 문의 전형적인 예
    for (int i = 1; i <= 5; i++) 
      System.out.println(i);
    //System.out.println(i); //불가능

    System.out.println("----------------------");
    for (int i = 1; i <= 5;) {
      System.out.println(i);
      i++; 
    }

    System.out.println("----------------------");
    int i = 1;
    for (; i <= 5;) {  // ;는 생략하면 안된다.
      System.out.println(i);
      i++; 
    }
    System.out.println(i);//가능

    System.out.println("----------------------");
    i = 1;
    for (;;) {  // ;는 생략하면 안된다. 이렇게 쓸 바에 while문 쓸 것.
      if (i > 5)
        break;
      System.out.println(i);
      i++; 
    }

  }
}
