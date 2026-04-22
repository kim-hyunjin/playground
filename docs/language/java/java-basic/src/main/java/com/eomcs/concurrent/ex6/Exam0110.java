// 스레드 재사용 - 1단계) 재사용전
package com.eomcs.concurrent.ex6;

import java.util.Scanner;

public class Exam0110 {

  public static void main(String[] args) {

    class MyThread extends Thread {
      int count;

      public void setCount(int count) {
        this.count = count;
      }

      @Override
      public void run() {
        try {
          for (int i = count; i > 0; i--) {
            System.out.printf("\n>>>" + i);
            Thread.sleep(1000);
          }
        }catch (InterruptedException e) {
          e.printStackTrace();
        }
      }
    }// MyThread

    MyThread t = new MyThread();
    Scanner keyScan = new Scanner(System.in);

    while(true) {
      System.out.print("카운트? ");
      String str = keyScan.nextLine();
      if (str.equals("quit")) {
        break;
      }

      int count = Integer.parseInt(str);
      t.setCount(count);
      t.start();
      // Dead 상태의 스레드를 다시 시작하려하면 예외가 발생한다.
      // run() 메서드 호출이 끝나, Dead 상태가 된 스레드는
      // 다시 시작시킬 수 없다!
    }
    System.out.println("main 스레드 종료!");
    keyScan.close();
  }//main()
}//Exam0110


