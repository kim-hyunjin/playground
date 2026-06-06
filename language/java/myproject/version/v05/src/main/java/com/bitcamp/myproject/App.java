package com.bitcamp.myproject;

import java.util.Scanner;

public class App {
    public static void main(String[] args) {
      
      Scanner input = new Scanner(System.in);
      
      System.out.print("계좌번호를 입력하세요: ");
      String account = input.nextLine();
      
      System.out.print("계좌용도를 입력하세요: ");
      String purpose = input.nextLine();
      
      System.out.print("잔액을 입력하세요: ");
      int balance = Integer.parseInt(input.nextLine());
      
      System.out.print("이번달 수입액을 입력하세요: ");
      int income = Integer.parseInt(input.nextLine());
      
      System.out.print("이번달 지출액을 입력하세요: ");
      int outcome = Integer.parseInt(input.nextLine());
      
      System.out.println();
      
      System.out.printf("계좌번호: %s\n", account);
      System.out.printf("계좌용도: %s\n", purpose);
      System.out.printf("잔액: %d\n", balance);
      System.out.printf("이번 달 수입액: %d원\n", income);
      System.out.printf("이번 달 지출액: %d원", outcome);
      
      input.close();
    }
}
