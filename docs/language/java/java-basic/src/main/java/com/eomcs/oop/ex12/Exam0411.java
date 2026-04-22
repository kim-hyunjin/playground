// 람다(lambda) 문법
package com.eomcs.oop.ex12;

public class Exam0411 {

  static interface Interest {
    double compute(int money);
  }

  static Interest getInterest(final double rate) {
    class MyInterest implements Interest {
      @Override
      public double compute(int money) {
        // 로컬(익명) 클래스 안에서 바깥 클래스의 로컬 변수를 사용하면
        // 컴파일러는 자동으로 그 값을 보관하기 위해
        // 필드를 추가한다.
        // 또한 그 값을 받을 수 있도록 생성자를 변경한다.
        // 따라서 개발자가 직접 필드나 생성자를 정의할 필요가 없다.
        return money + (money * rate / 100);
      }
    }
    return new MyInterest();
  }

  public static void main(String[] args) {
    Interest i = getInterest(2);
    System.out.printf("%.1f\n", i.compute(10_000_000));

    Interest i2 = getInterest(2.5);
    System.out.printf("%.1f\n", i2.compute(10_000_000));
  }
}


