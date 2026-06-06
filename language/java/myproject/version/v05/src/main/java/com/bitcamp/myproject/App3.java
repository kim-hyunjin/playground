package com.bitcamp.myproject;

import java.util.Scanner;

public class App3 {
  public static void main(String[] args) {
    Scanner input = new Scanner(System.in);
    
    System.out.print("제목을 입력하세요: ");
    String title = input.nextLine();
    
    System.out.print("지출금액을 입력하세요: ");
    int pay = Integer.parseInt(input.nextLine());
    
    System.out.print("사용처를 입력하세요: ");
    String forWhat = input.nextLine();
    
    int number = 1;
    
    System.out.println();
    
    System.out.printf("번호: %d\n", number);
    System.out.printf("제목: %s\n", title);
    System.out.printf("지출내역: %s원 - %s\n", pay, forWhat);
    System.out.printf("총 지출: %s원", pay);
    
  }
}
