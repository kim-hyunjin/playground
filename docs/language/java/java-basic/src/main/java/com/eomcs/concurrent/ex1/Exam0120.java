// 멀티 스레드 적용 후
package com.eomcs.concurrent.ex1;

public class Exam0120 {

  // CPU의 시간을 쪼개서 왔다갔다 하면서
  // 동시에 실행하고픈 코드가 있다면,
  // 다음과 같이 Thread를 상속받아
  // run() 메서드에 그 코드를 넣는다.
  static class MyThread extends Thread {
    @Override
    public void run() {
      // 기존 실행 흐름과 분리하여 따로 실행시킬 코드를
      // 이 메서드에 둔다.
      for (int i = 0; i < 1000; i++) {
        System.out.println("==> " + i);
      }
    }
  }

  public static void main(String[] args) {
    // 코드 실행 라인을 새로 만들어 따로 실행한다.
    // 스레드는 비동기로 동작한다.
    // 스레드에 작업을 시킨 후, 그 스레드가 작업이 끝날 때까지 기다리지 않고 즉시 리턴한다.
    // 따라서 스레드 작업과 main()의 코드가 병행(concurrent)으로 실행한다.
    new MyThread().start();

    for (int i = 0; i < 1000; i++) {
      System.out.println(">>> " + i);
    }
  }

}

// # 멀티태스킹(multi-tasking)
// - 한 개의 CPU가 여러 코드를 동시에 실행하는 것
// - 실제는 이 코드와 저 코드를 왔다갔다하면서 실행한다.
// - CPU속도가 빨라 명령어가 동시에 실행되는 것처럼 보인다.

// # CPU 스케줄링 https://ko.wikipedia.org/wiki/%EC%8A%A4%EC%BC%80%EC%A4%84%EB%A7%81_(%EC%BB%B4%ED%93%A8%ED%8C%85)
// - CPU의 실행 시간을 쪼개 코드를 실행하는 방법.
// 1) Windows OS에서 사용하는 방식 : Round-Robin 방식
//   - CPU실행시간을 일정하게 쪼개서 각 프로세스를 처리하는 방식
// 2) Unix, Linux에서 사용하는 방식 : Priority 방식
//   - 우선 순위가 높은 코드에 더 많은 실행 시간을 배정하는 방식
//   - 문제점: 우선 순위가 낮은 프로그래밍인 경우 CPU 시간을 배정받지 못하는 문제가 발생.
//   - 해결책? CPU를 배정받지 못할 때마다 우선 순위를 높임 : 에이징(aging)기법

// ## 컨텍스트 스위칭(context switching)
//  - CPU를 실행 시간을 쪼개 이 코드 저 코드를 실행할 때 마다
//    실행 위치 및 정보(context)를 저장하고 로딩하는 과정이 필요하다.
//    이 과정을 컨텍스트 스위칭이라 부른다.
// https://jeong-pro.tistory.com/93

// main() 메서드를 실행하는 기본 실행 흐름에서 새로운 실행 흐름으로 분기하고 싶다면,
// Thread 클래스에 분기해서 실행할 코드를 담으면 된다.
// 그러면 두 개의 실행 흐름이 서로 왔다 갔다 하면서 실행된다.


