// 람다(lambda) 문법
package com.eomcs.oop.ex12;

public class Exam0321 {

  static interface Calculator {
    int compute(int a, int b);
  }

  static void test(Calculator c) {
    System.out.printf("결과: %d\n", c.compute(100, 200));
  }

  public static void main(String[] args) {
    // 익명클래스
    test(new Calculator() {
      @Override
      public int compute(int a, int b) {
        return a + b;
      }
    });

    test(new Calculator() {
      @Override
      public int compute(int a, int b) {
        return a * b;
      }
    });
  }
}


