// 스레드 재사용 - Pooling 기법을 사용하여 스레드 재사용하기
package com.eomcs.concurrent.ex6;

import java.util.ArrayList;
import java.util.Scanner;

public class Exam0210 {
  static class MyThread extends Thread {
    int count;
    ThreadPool pool;

    public MyThread(String name, ThreadPool pool) {
      super(name);
      this.pool = pool;
    }

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
          // 작업하라는 알림이 올때까지 기다린다.
          wait();

          // 알림이 오면, 작업실행
          for (int i = count; i > 0; i--) {
            System.out.printf("[%s] %d\n", getName(), i);
            Thread.sleep(1000);
          }

          // 스레드의 작업이 끝났으면 스레드 풀로 돌아가야 한다.
          pool.add(this);

        }
      }catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
  }// MyThread

  interface ThreadPool<E> {
    E get();
    void add(E obj);
  }

  static class MyThreadPool implements ThreadPool<Thread> {
    ArrayList<MyThread> list = new ArrayList<>();

    public MyThreadPool() {
      MyThread t1 = new MyThread("@@@", this);
      t1.start();
      list.add(t1);

      MyThread t2 = new MyThread("###", this);
      t2.start();
      list.add(t2);

      MyThread t3 = new MyThread("$$$", this);
      t3.start();
      list.add(t3);
    }

    // 스레드 풀에서 한 개의 스레드를 꺼낸다.
    @Override
    public MyThread get() {
      if(list.size() > 0) {
        return list.remove(0);
      }
      return null;
    }

    // 스레드를 다 쓴 후에는 다시 스레드 풀에 돌려준다.
    @Override
    public void add(Thread t) {
      list.add((MyThread) t);
    }
  }//MyThreadPool

  public static void main(String[] args) {
    // 스레드 풀 준비!
    MyThreadPool threadPool = new MyThreadPool();
    Scanner keyScan = new Scanner(System.in);
    while(true) {

      try {
        String str = keyScan.nextLine();
        if (str.equals("quit")) {
          break;
        }

        int count = Integer.parseInt(str);

        // 스레드 풀에서 스레드를 한 개 꺼낸다.
        MyThread t = threadPool.get();
        if (t == null) {
          System.out.println("남는 스레드가 없습니다.");
          continue;
        }
        // 스레드 풀에서 스레드를 받았다면 카운트를 시작시킨다.
        t.setCount(count);

      } catch (Exception e) {
        System.out.println(e.getMessage());
      }
    }
    System.out.println("main 스레드 종료!");
    keyScan.close();
  }//main()
}//Exam0110



