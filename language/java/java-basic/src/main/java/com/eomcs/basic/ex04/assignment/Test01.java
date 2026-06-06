// 과제 1 : 계산기 애플리케이션을 작성하라.
// - 실행
// 값1? 10
// 값2? 20
// 연산자(+,-,*,/)? +
// => 10 + 20 = 30 
//
package com.eomcs.basic.ex04.assignment;

import java.util.Scanner;

public class Test01 {
  public static void main(String[] args) {
    Scanner keyboard = new Scanner(System.in);

    System.out.print("값1? ");
    double a = keyboard.nextDouble();

    System.out.print("값2? ");
    double b = keyboard.nextDouble();

    System.out.print("연산자(+,-,*,/)? ");
    String s = keyboard.next();

    keyboard.close();
    
    double result = 0;
    
    switch (s) {                //연산자에 따른 계산결과를 변수 result에 할당
      case "+": result = a + b;
      break;
      case "-": result = a - b;
      break;
      case "*": result = a * b;
      break;
      case "/": result = a / b;
      break;
      default : s = ""; 
      break;
    }
    
    if (s.equals("")) {
      System.out.println("\n!!사용할 수 없는 연산자입니다!!");
    } else {
      if (result == (long)result) {    //소수점이 없으면 long으로 출력.
        System.out.printf("\n==> %d %s %d = %d", (long)a, s, (long)b, (long)result);
      } else {
        System.out.printf("\n==> %f %s %f = %12.4f", a, s, b, result);  //소수점 이하 4자리까지만 출력.
      }
    }
    
    System.out.println("\n\n****어플리케이션을 종료합니다****");
  }
}
