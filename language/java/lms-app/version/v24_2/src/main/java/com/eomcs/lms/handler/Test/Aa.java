package com.eomcs.lms.handler.Test;

public class Aa implements A{
  B b;
  
  public Aa(B b) {
    this.b = b;
  }
  
  @Override
  public void a() {
    System.out.println("a() 구현");
    b.b();
  }
}
