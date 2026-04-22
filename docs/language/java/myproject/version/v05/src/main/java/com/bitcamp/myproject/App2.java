package com.bitcamp.myproject;

import java.sql.Date;
import java.util.Scanner;

public class App2 {

  public static void main(String[] args) {
    Scanner input = new Scanner(System.in);
    
    System.out.print("이름을 입력하세요: ");
    String name = input.nextLine();
    
    System.out.print("이메일을 입력하세요: ");
    String email = input.nextLine();
    
    System.out.print("암호를 입력하세요: ");
    String password = input.nextLine();
    
    System.out.print("사진을 입력하세요: ");
    String photo = input.nextLine();
    
    System.out.print("전화번호를 입력하세요: ");
    String phoneNumber = input.nextLine();
    
    Date createdDate = new Date(System.currentTimeMillis());
    int number = 1;
    
    
    System.out.println();
    
    System.out.printf("번호: %d\n", number);
    System.out.printf("이름: %s\n", name);
    System.out.printf("이메일: %s\n", email);
    System.out.printf("암호: %s\n", password);
    System.out.printf("사진: %s\n", photo);
    System.out.printf("전화: %s\n", phoneNumber);
    System.out.printf("가입일: %s", createdDate);
    
    input.close();
  }
}
