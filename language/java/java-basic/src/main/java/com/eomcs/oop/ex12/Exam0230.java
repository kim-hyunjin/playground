// 람다(lambda) 문법
package com.eomcs.oop.ex12;

public class Exam0230 {

  static interface Player {
    void play();

    void stop();
  }

  public static void main(String[] args) {
    Player p1 = () -> System.out.println("Hello!"); // 컴파일 오류!
    p1.play();

  }
}


