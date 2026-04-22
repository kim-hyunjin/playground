// 람다(lambda) 문법
package com.eomcs.oop.ex12;

public class Exam0210 {

  static interface Player {
    void play();
  }

  public static void main(String[] args) {
    Player p1 = () -> System.out.println("Hello!");
    p1.play();

  }
}


