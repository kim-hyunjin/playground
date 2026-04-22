// 스레드 재사용 - 3단계) sleep()/timeout 사용
package com.eomcs.concurrent.ex6;

import java.util.Scanner;

public class Exam0130 {

  public static void main(String[] args) {

    class MyThread extends Thread {
      boolean enable;
      int count;

      public void setCount(int count) {
        this.count = count;
        // 카운트를 설정하면 스레드의 작업을 허락하게 하자
        this.enable = true;
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

            // 무조건 작업하지 말고,
            // enable이 true일때만 작업하게 하자!
            if (!enable) {
              continue;
            }
            System.out.println("카운트 시작");
            for (int i = count; i > 0; i--) {
              System.out.printf("==> %d\n", i);
              Thread.sleep(1000);
            }
            // 스레드의 작업이 끝나면 비활성 상태로 설정한다.
            enable = false;
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
      System.out.println("카운트? ");
      String str = keyScan.nextLine();
      if (str.equals("quit")) {
        break;
      }

      int count = Integer.parseInt(str);
      t.setCount(count);
      // 2단계보다는 나아졌다.
      // 스레드가 작업을 완료하면 10초동안 잠든다.
    }
    System.out.println("main 스레드 종료!");
    keyScan.close();
  }//main()
}//Exam0110



