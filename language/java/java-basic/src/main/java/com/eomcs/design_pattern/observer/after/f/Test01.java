package com.eomcs.design_pattern.observer.after.f;

public class Test01 {

  public static void main(String[] args) {
    Car car = new Car();

    car.addCarObserver(new SafebeltCarObserver());
    car.addCarObserver(new EngineOilCarObserver());
    car.addCarObserver(new BreakOilCarObserver());
    car.addCarObserver(new LightOffCarObserver());

    // 썬루프를 닫는 옵저버를 추가한다.
    car.addCarObserver(new SunroofCloseCarObserver());

    car.start();

    car.run();

    car.stop();

    // 업그레이드를 수행한 다음 시간이 지난 후
    // 5) 시동 끌 때 썬루프를 자동으로 닫기
    // => 썬루프를 자동으로 닫는 옵저버(SunroofCloseCarObserver)를 정의한다.
    // => Car 객체에 등록한다.
  }
}








