package com.eomcs.lms;

import java.sql.Date;
import java.util.Scanner;

public class App2 {

  public static void main(String[] args) {
    Scanner keyboard = new Scanner(System.in);

    class Member {
      int no;
      String name;
      String email;
      String password;
      String photo;
      String tel;
      Date date;
    }
    
    final int SIZE = 100;
    Member[] members = new Member[SIZE];

    int count = 0;
    for (int i = 0; i < SIZE; i++) {
      count++;
      Member m = new Member();
      
      System.out.print("번호를 입력하세요: ");
      m.no = keyboard.nextInt();

      System.out.print("이름을 입력하세요: ");
      m.name = keyboard.next();

      System.out.print("이메일을 입력하세요: ");
      m.email = keyboard.next();

      System.out.print("암호를 입력하세요: ");
      m.password = keyboard.next();

      System.out.print("사진을 입력하세요: ");
      m.photo = keyboard.next();

      System.out.print("전화번호를 입력하세요: ");
      m.tel = keyboard.next();
      
      Date today = new Date(System.currentTimeMillis());
      m.date = today;

      members[i] = m;
      
      keyboard.nextLine();
      System.out.print("계속 입력하시겠습니까?(Y/N) ");
      String response = keyboard.nextLine();
      if (!response.equalsIgnoreCase("y"))
        break;
    }

    System.out.println();
    
    for (int i = 0; i <count; i++) {
    System.out.println("-----------------------");
    System.out.printf("번호: %d\n", members[i].no);
    System.out.printf("이름: %s\n", members[i].name);
    System.out.printf("이메일: %s\n", members[i].email);
    System.out.printf("암호: %s\n", members[i].password);
    System.out.printf("사진: %s\n", members[i].photo);
    System.out.printf("전화번호: %s\n", members[i].tel);
    System.out.printf("가입일: %s\n", members[i].date);
    }
    keyboard.close();
  }
}
