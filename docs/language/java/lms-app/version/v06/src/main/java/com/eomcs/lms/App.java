package com.eomcs.lms;

import java.sql.Date;
import java.util.Scanner;

public class App {
  public static void main(String[] args) {mmk
    Scanner keyboard = new Scanner(System.in);

    final int SIZE = 100;
    int[] no = new int[SIZE];
    String[] title = new String[SIZE];
    String[] description = new String[SIZE];
    Date[] startDate = new Date[SIZE];
    Date[] endDate = new Date[SIZE];
    int[] totalHours = new int[SIZE];
    int[] dayHours = new int[SIZE];

    int count = 0;
    for(int i = 0; i < SIZE; i++) {
      count++;
      System.out.print("번호를 입력하세요 : ");
      int number = keyboard.nextInt();

      keyboard.nextLine(); //nextInt() 후 남아있는 줄바꿈 기호 제거

      System.out.print("수업명을 입력하세요 : ");
      title[i] = keyboard.nextLine();
      
      System.out.print("설명을 입력하세요 : ");
      description[i] = keyboard.nextLine();
      

      System.out.print("시작일을 입력하세요 : ");
      startDate[i] = Date.valueOf(keyboard.next());

      keyboard.nextLine();
      
      System.out.print("종료일을 입력하세요 : ");
      endDate[i] = Date.valueOf(keyboard.next());
      keyboard.nextLine();

      System.out.print("총수업시간을 입력하세요 : ");
      totalHours[i] = keyboard.nextInt();
      keyboard.nextLine();
      
      System.out.print("일수업시간을 입력하세요 : ");
      dayHours[i] = keyboard.nextInt();
      keyboard.nextLine();
      
      System.out.println("계속 입력하시겠습니까?(Y/N) ");
      String response = keyboard.nextLine();
      if (!response.equalsIgnoreCase("y"))  //대소문자를 구분하지 않고 비교한다.
        break;
    }
    
    System.out.println();
    
    for(int i = 0; i < count; i++) {
    System.out.printf("번호: %d\n", no[i]);
    System.out.printf("수업명: %s\n", title[i]);
    System.out.printf("설명: %s\n", description[i]);
    System.out.printf("기간: %s ~ %s\n", startDate[i], endDate[i]);
    System.out.printf("총수업시간: %d시간\n", totalHours[i]);
    System.out.printf("일수업시간: %d시간\n", dayHours[i]);
    }
    keyboard.close();
  }
}
