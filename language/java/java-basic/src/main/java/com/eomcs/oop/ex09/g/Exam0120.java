package com.eomcs.oop.ex09.g;

public class Exam0120 implements A {
  @Override
  public void m1() {
    // 인터페이스의 추상 메서드는 반드시 구현해야 한다.
    // 구현되지 않은 추상 메서드가 있으면
    // 클래스는 일반 클래스(concrete class)가 될 수 없다.
  }

  @Override
  public void m2() {
    // 인터페이스에서 default 메서드를 구현했기 때문에
    // 클래스에서는 구현해도 되고 안해도 된다.
  }


}
