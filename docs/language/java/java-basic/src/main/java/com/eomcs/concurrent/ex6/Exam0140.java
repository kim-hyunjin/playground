// 스레드 재사용 - 4단계) wait()/notify() 사용
package com.eomcs.concurrent.ex6;

import java.util.Scanner;

public class Exam0140 {

  public static void main(String[] args) {

    class MyThread extends Thread {
      int count;

      public void setCount(int count) {
        this.count = count;
        // synchronized 블록에 지정된 객체의 사용을 기다리는 스레드에 대해 작업을 시작할 것을 알린다.
        synchronized (this) {
          notify();
          // 이 객체를 사용하는 스레드에게
          // 이제 기다림을 끝내고 작업을 시작하라고 알린다.
          // notify()도 동기화 영역에서 호출해야 한다.
          // 그렇지 않으면 java.lang.IllegalMonitorStateException 오류 발생!
        }
      }

      @Override
      synchronized public void run() {
        // 스레드를 재사용하려면 다음과 같이 run() 메서드가 종료되지 않게 해야한다.
        System.out.println("스레드 시작");
        try {
          while (true) {
            System.out.println("스레드 대기 중...");
            System.out.println("카운트? ");
            wait();
            // 스레드를 시작하자 마자 일단 작업 지시를 기다리게 한다.
            // wait()는 반드시 동기화 영역 안에서 호출해야 한다.
            // 동기화 영역?
            // => synchronized로 선언된 블럭이나 메서드
            // 어떤 객체를 대상으로 여러 스레드가 동시에 사용하지 못하게 할 것인지 지정해야 한다.
            //
            // 기다림을 끝내는 방법은?
            // => notify()를 통해 기다림이 끝났음을 알림받아야한다.
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
    t.start();

    Scanner keyScan = new Scanner(System.in);
    while(true) {

      String str = keyScan.nextLine();
      if (str.equals("quit")) {
        break;
      }

      int count = Integer.parseInt(str);
      t.setCount(count);
    }
    System.out.println("main 스레드 종료!");
    keyScan.close();
  }//main()
}//Exam0110



