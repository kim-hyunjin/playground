package com.eomcs.lms;

import java.util.Scanner;

public class App {
  public static void main(String[] args) {
    Scanner keyboard = new Scanner(System.in);
    
    System.out.print("번호를 입력하세요 : ");
    int number = keyboard.nextInt();
    
    keyboard.nextLine(); //nextInt() 후 남아있는 줄바꿈 기호 제거
    
    System.out.print("수업명을 입력하세요 : ");
    String classname = keyboard.nextLine();
    
    System.out.print("설명을 입력하세요 : ");
    String description = keyboard.nextLine();
    
    System.out.print("시작일을 입력하세요 : ");
    String startDate = keyboard.nextLine();
    
    System.out.print("종료일을 입력하세요 : ");
    String endDate = keyboard.nextLine();
    
    System.out.print("총수업시간을 입력하세요 : ");
    int totalHours = keyboard.nextInt();
    keyboard.nextLine();
    
    System.out.print("일수업시간을 입력하세요 : ");
    int dayHours = keyboard.nextInt();
    keyboard.nextLine();

    System.out.println();
    
    System.out.printf("번호: %d\n", number);
    System.out.printf("수업명: %s\n", classname);
    System.out.printf("설명: %s\n", description);
    System.out.printf("기간: %s ~ %s\n", startDate, endDate);
    System.out.printf("총수업시간: %d시간\n", totalHours);
    System.out.printf("일수업시간: %d시간\n", dayHours);
    
    keyboard.close();
  }
}
