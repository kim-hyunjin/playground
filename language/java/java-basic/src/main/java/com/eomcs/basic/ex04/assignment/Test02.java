// 과제 1 : 가위,바위,보 게임 애플리케이션을 작성하라.
// - 실행1
// 가위,바위,보? 보
// 컴퓨터: 가위  
// => 졌습니다.
//
// - 실행2
// 가위,바위,보? 바위
// 컴퓨터: 가위
// => 이겼습니다.
//
package com.eomcs.basic.ex04.assignment;

import java.util.Scanner;

public class Test02 {
  public static void main(String[] args) {
    Scanner input = new Scanner(System.in);

    // 유저로부터 가위바위보 입력 받음
    System.out.print("가위, 바위, 보? ");
    String userRps = input.next();

    // 랜덤으로 컴퓨터 가위바위보 정하기
    int comNum = (int) (Math.random() * 3);  // 0 ~ 2 사이의 난수 발생
    String[] rpsArray = {"가위", "바위", "보"};
    String comRps = rpsArray[comNum];

    System.out.printf("컴퓨터: %s\n", comRps);

    if (userRps.equals("가위")) {
      switch (comRps) {
        case "가위": System.out.println("=> 비겼습니다.");
        break;
        case "바위": System.out.println("=> 졌습니다.");
        break;
        case "보": System.out.println("=> 이겼습니다.");
        break;
      }
    } else if (userRps.equals("바위")) {
        switch (comRps) {
        case "가위": System.out.println("=> 이겼습니다.");
        break;
        case "바위": System.out.println("=> 비겼습니다.");
        break;
        case "보": System.out.println("=> 졌습니다.");
        break;
      }
    } else if (userRps.equals("보")) {
      switch (comRps) {
        case "가위": System.out.println("=> 졌습니다.");
        break;
        case "바위": System.out.println("=> 이겼습니다.");
        break;
        case "보": System.out.println("=> 비겼습니다.");
        break;
      }
    } else {
      System.out.println("가위, 바위, 보 중에 하나만 입력해주세요.");
    }

      System.out.println("Game Over");


  }
}

