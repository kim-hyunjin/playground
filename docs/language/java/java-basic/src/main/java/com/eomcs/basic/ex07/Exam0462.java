package com.eomcs.basic.ex07;

//# 메서드 : 스택 오버플로우 오류!
//
public class Exam0462 {

  static int sum(int value) {
    // 종료 조건을 빼버리면, 무한으로 호출한다.

    if (value == 1)
      return 1;

    long a1 = 100, a2 = 100, a3 = 100, a4 = 100, a5 = 100, a6 = 1, a7 = 1, a8 = 1, a9 = 1;
    long a11 = 1, a12 = 1, a13 = 1, a14 = 1, a15 = 1, a16 = 1, a17 = 1, a18 = 1, a19 = 1;
    long a111 = 1, a112 = 1, a113 = 1, a114 = 1, a115 = 1, a116 = 1, a117 = 1, a118 = 1, a119 = 1;
    return value + sum(value - 1);
  }

  public static void main(String[] args) {
    // 호출하는 메서드의 로컬 변수가 클 때는 스택 메모리가 빨리 찬다.
    // => 즉 스택오버플로우는 메서드 호출 회수가 아닌, 메서드에서 생성하는 로컬 변수의
    //    크기에 영향을 받는다.
    System.out.println(sum(11000));
  }
}