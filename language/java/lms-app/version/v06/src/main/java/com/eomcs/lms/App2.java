package com.eomcs.lms;

import java.sql.Date;
import java.util.Scanner;

public class App2 {

  public static void main(String[] args) {

    Scanner keyboard = new Scanner(System.in);
    Date today = new Date(System.currentTimeMillis());
    final int SIZE = 100;

    int[] number = new int[SIZE];
    String[] name = new String[SIZE];
    String[] email = new String[SIZE];
    String[] password = new String[SIZE];
    String[] photo = new String[SIZE];
    String[] tel = new String[SIZE];
    Date[] date = new Date[SIZE];

    int count = 0;
    for (int i = 0; i < SIZE; i++) {
      count++;
      System.out.print("번호를 입력하세요: ");
      number[i] = keyboard.nextInt();

      System.out.print("이름을 입력하세요: ");
      name[i] = keyboard.next();

      System.out.print("이메일을 입력하세요: ");
      email[i] = keyboard.next();

      System.out.print("암호를 입력하세요: ");
      password[i] = keyboard.next();

      System.out.print("사진을 입력하세요: ");
      photo[i] = keyboard.next();

      System.out.print("전화번호를 입력하세요: ");
      tel[i] = keyboard.next();

      date[i] = today;

      keyboard.nextLine();
      System.out.print("계속 입력하시겠습니까?(Y/N) ");
      String response = keyboard.nextLine();
      if (!response.equalsIgnoreCase("y"))
        break;
    }

    System.out.println();
    
    for (int i = 0; i <count; i++) {
    System.out.printf("번호: %d\n", number[i]);
    System.out.printf("이름: %s\n", name[i]);
    System.out.printf("이메일: %s\n", email[i]);
    System.out.printf("암호: %s\n", password[i]);
    System.out.printf("사진: %s\n", photo[i]);
    System.out.printf("전화번호: %s\n", tel[i]);
    System.out.printf("가입일: %s", date[i]);
    System.out.println("-----------------------");
    }
    keyboard.close();
  }
}
