package com.eomcs.design_pattern.observer.after.h;

// 인터페이스 구현체가 메서드를 정의하기 쉽도록
// 이 클래스에서 미리 모든(또는 일부)메서드를 구현하였다.
// 이 클래스의 존재 이유는 인터페이스 구현체가 메서드를 정의하기 쉽도록
// 미리 구현된 메서드를 상속해주는 일을 한다.
// 즉 이 클래스 자체를 객체로 사용하려는 것이 아니다.
// 이런 경우 클래스를 추상클래스로 정의하면 좋다.
public abstract class AbstractCarObserver implements CarObserver{

  @Override
  public void carStarted() {

  }

  @Override
  public void carStopped() {

  }

}
