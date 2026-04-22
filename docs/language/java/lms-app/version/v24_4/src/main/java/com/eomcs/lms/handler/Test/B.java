package com.eomcs.lms.handler.Test;

public class B {
  public A a() {
    return new Aa(this);
  }
  public void b() {
    System.out.println("b메소드");
  }
}
