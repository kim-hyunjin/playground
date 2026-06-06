package com.eomcs.design_pattern.observer.after.c;

public class SafebeltCarObserver implements CarObserver {

  @Override
  public void carStarted() {
    System.out.println("안전벨트 착용 여부 검사");

  }

  @Override
  public void carStopped() {

  }

}
