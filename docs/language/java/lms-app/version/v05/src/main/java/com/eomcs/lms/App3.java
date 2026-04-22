package com.eomcs.lms;

import java.sql.Date;
import java.util.Scanner;

public class App3 {

  public static void main(String[] args) {
    
    Scanner keyboard = new Scanner(System.in);
    
    System.out.print("번호를 입력하세요: ");
    int number = keyboard.nextInt();
    
    System.out.print("내용을 입력하세요: ");
    String content = keyboard.next();
    
    Date writeDate = new Date(System.currentTimeMillis());
    
    int visiting = 0;
    
    System.out.println();
    
    System.out.printf("번호: %s\n", number);
    System.out.printf("내용: %s\n", content);
    System.out.printf("작성일: %s\n", writeDate);
    System.out.printf("조회수: %d", visiting);
    
    keyboard.close();
  }

}
