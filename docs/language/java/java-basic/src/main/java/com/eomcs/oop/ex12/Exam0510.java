// 메서드 레퍼런스
package com.eomcs.oop.ex12;

public class Exam0510 {
  static class MyCalculator {
    public static int plus(int a, int b) {
      return a + b;
    }

    public static int minus(int a, int b) {
      return a - b;
    }

    public static int multiple(int a, int b) {
      return a * b;
    }

    public static int devide(int a, int b) {
      return a / b;
    }
  }

  static interface Calculator {
    double compute(int a, int b);
  }


  public static void main(String[] args) {
    // 메서드 한 개짜리 인터페이스 구현체를 만들 때
    // 기존 스태틱 메서드를 람다 구현체로 표현할 수 있다.
    // 단, 인터페이스에 선언된 메서드의 시그니쳐와 일치해야 한다.
    Calculator c1 = MyCalculator::plus;
    Calculator c2 = MyCalculator::minus;
    Calculator c3 = MyCalculator::multiple;
    Calculator c4 = MyCalculator::devide;
    System.out.println(c1.compute(100, 200));
    System.out.println(c2.compute(100, 200));
    System.out.println(c3.compute(100, 200));
    System.out.println(c4.compute(100, 200));
  }
}


