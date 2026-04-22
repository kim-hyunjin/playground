// 스레드 재사용 - 2단계) sleep()/timeout 사용
package com.eomcs.concurrent.ex6;

import java.util.Scanner;

public class Exam0120 {

  public static void main(String[] args) {

    class MyThread extends Thread {
      int count;

      public void setCount(int count) {
        this.count = count;
      }

      @Override
      public void run() {
        // 스레드를 재사용하려면 다음과 같이 run() 메서드가 종료되지 않게 해야한다.
        System.out.println("스레드 시작");
        try {
          while (true) {
            // 사용자가 다음 카운트 값을 입력할 시간을 주기 위해
            // 10초 정도 스레드를 멈춘다.
            Thread.sleep(10000);

            System.out.println("카운트 시작");
            for (int i = count; i > 0; i--) {
              System.out.printf("==> %d\n", i);
              Thread.sleep(1000);
            }
          }
        }catch (InterruptedException e) {
          e.printStackTrace();
        }
      }
    }// MyThread

    MyThread t = new MyThread();

    // 미리 스레드를 시작시켜 놓는다.
    t.start();

    Scanner keyScan = new Scanner(System.in);

    while(true) {
      System.out.println("카운트? ");
      String str = keyScan.nextLine();
      if (str.equals("quit")) {
        break;
      }

      int count = Integer.parseInt(str);
      t.setCount(count); // 스레드의 카운트 값을 변경한다.
      // sleep()을 이용한 스레드 재활용 방식은
      // 스레드를 일정시간 잠재웠다가 깨어난 후 작업하게 만든다.
      // 스레드가 잠든 사이에 작업할 내용을 설정해두면,
      // 스레드가 깨어나서 변경사항에 따라 작업을 수행할 것이다.
      // 문제는,
      // => 스레드에 지정된 sleep시간동안 작업이 실행되지 않는다.
      // => 또한, 작업을 시키고 싶지 않아도 깨어나면 작업을 시작한다.
    }
    System.out.println("main 스레드 종료!");
    keyScan.close();
  }//main()
}//Exam0110


