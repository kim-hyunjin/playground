package com.eomcs.basic.ex03;

// 부동 소수점 리터럴(literal)

public class Exam31 {
  public static void main(String[] args) {
    //고정소수점
    System.out.println(3.14159);

    //부동소수점
    System.out.println(0.0314159e2); //0.0314159 * 10^2
    System.out.println(31.4159e-1);  //0.0314159 * 10^(-1)
    System.out.println(314.159e-2);  //0.0314159 * 10^(-2)
    System.out.println(3141.59e-3);  //0.0314159 * 10^(-3)
  }
}