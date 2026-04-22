package com.eomcs.design_pattern.observer.after.h;

public class EngineOilCarObserver extends AbstractCarObserver {
  // Observer 디자인 패턴과 추상 클래스의 결합
  // CarObserver를 직접 구현하는 대신에
  // AbstractCarObserver를 상속 받으면 코딩하기가 편하다.
  // => AbstractCarObserver 클래스를 참고할 것.
  //
  @Override
  public void carStarted() {
    System.out.println("엔진 오일 유무 검사");
  }
}
