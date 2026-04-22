package com.eomcs.spring.ioc.ex13.c;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Caller {

  @Autowired
  X x;

  public void test() {
    // 실제 test()에서 호출하는 m1()은 X의 프록시 객체에 정의되어 있는 m1()을 호출하는 것이다.
    //
    // X의 프록시 클래스가 다음과 같이 동작할 것이라 짐작할 수 있다.

    // class XProxy extends X {
    // X original;
    // MyAdvice myAdvice;
    //
    // public XProxy(X original, MyAdvice myAdvice) {
    // this.original = original;
    // this.myAdvice = myAdvice;
    // }
    //
    // public int m1(int a, int b) {
    // myAdvice.doBefore();
    // try {
    // try {
    // original.m1(a, b);
    // } catch(Exception e) {
    // throw e;
    // } finally {
    // myAdvice.doAfter();
    // }
    // myAdvice.doAfterReturning();
    // } catch(Exception e) {
    // myAdvice.doAfterThrowing();
    System.out.println("test()..... 시작");

    int result = x.m1(10, 2);
    System.out.printf("result: %d\n", result);

    result = x.m1(10, 0);
    System.out.printf("result: %d\n", result);

    System.out.println("test()..... 끝");
  }
}
