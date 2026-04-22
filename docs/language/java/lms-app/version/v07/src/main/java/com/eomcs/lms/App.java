package com.eomcs.lms;

import java.sql.Date;
import java.util.Scanner;

public class App {
  public static void main(String[] args) {
    Scanner keyboard = new Scanner(System.in);
    
    //강의 정보를 담을 메모리의 설계도를 만든다.
    // 클래스 - 어플리케이션에서 다를 특정 데이터의 메모리 구조 설계
    // 이렇게 개발자가 새롭게 정의한 데이터 타입을 "사용자 정의 데이터 타입"이라 부른다.
    // C언어에서는 structure. 
    class Lesson {
      int no;
      String title;
      String description;
      Date startDate;
      Date endDate;
      int totalHours;
      int dayHours;
    }
    
    final int SIZE = 100;  //레슨 레퍼런스 배열 사이즈
    Lesson[] lessons = new Lesson[SIZE]; //레슨 레퍼런스 생성

    int count = 0; //입력개수를 저장할 변수
    //입력 받기
    for(int i = 0; i < SIZE; i++) {
      count++;
      Lesson le = new Lesson(); 
      
      System.out.print("번호를 입력하세요 : ");
      le.no = keyboard.nextInt();
      keyboard.nextLine(); //nextInt() 후 남아있는 줄바꿈 기호 제거

      System.out.print("수업명을 입력하세요 : ");
      le.title = keyboard.nextLine();
      
      System.out.print("설명을 입력하세요 : ");
      le.description = keyboard.nextLine();

      System.out.print("시작일을 입력하세요 : ");
      le.startDate = Date.valueOf(keyboard.next());
      keyboard.nextLine();
      
      System.out.print("종료일을 입력하세요 : ");
      le.endDate = Date.valueOf(keyboard.next());
      keyboard.nextLine();

      System.out.print("총수업시간을 입력하세요 : ");
      le.totalHours = keyboard.nextInt();
      keyboard.nextLine();
      
      System.out.print("일수업시간을 입력하세요 : ");
      le.dayHours = keyboard.nextInt();
      keyboard.nextLine();
      
      lessons[i] = le;
      
      System.out.print("계속 입력하시겠습니까?(Y/N) ");
      String response = keyboard.nextLine();
      if (!response.equalsIgnoreCase("y"))  //대소문자를 구분하지 않고 비교한다.
        break;
    }
    
    System.out.println();
    
    //입력개수만큼 출력
    for(int i = 0; i < count; i++) {
    System.out.printf("번호: %d\n", lessons[i].no);
    System.out.printf("수업명: %s\n", lessons[i].title);
    System.out.printf("설명: %s\n", lessons[i].description);
    System.out.printf("기간: %s ~ %s\n", lessons[i].startDate, lessons[i].endDate);
    System.out.printf("총수업시간: %d시간\n", lessons[i].totalHours);
    System.out.printf("일수업시간: %d시간\n", lessons[i].dayHours);
    System.out.println("-------------------------------------------");
    }
    keyboard.close();
  }
}
