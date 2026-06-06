// 람다(lambda) 문법
package com.eomcs.oop.ex12;

public class Exam0414 {

  static interface Interest {
    double compute(int money);
  }

  static Interest getInterest(final double rate) {
    return money -> money + (money * rate / 100);
  }

  public static void main(String[] args) {
    Interest i = getInterest(2);
    System.out.printf("%.1f\n", i.compute(10_000_000));

    Interest i2 = getInterest(2.5);
    System.out.printf("%.1f\n", i2.compute(10_000_000));
  }
}


