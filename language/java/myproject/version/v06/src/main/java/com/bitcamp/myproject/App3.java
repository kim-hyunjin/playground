package com.bitcamp.myproject;

import java.text.SimpleDateFormat;
import java.util.Scanner;

public class App3 {
  public static void main(String[] args) {
    Scanner input = new Scanner(System.in);
    int arrSize = 100;
    int count = 0;
    int[] outlay = new int[arrSize];
    String[] expen = new String[arrSize];
    String response = "";
    SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
    String today = date.format(System.currentTimeMillis());
    long totalAmount = 0;
    
    for(int i = 0; i < arrSize; i++) {

      System.out.print("지출금액을 입력하세요: ");
      outlay[i] = Integer.parseInt(input.nextLine());

      System.out.print("사용처를 입력하세요: ");
      expen[i] = input.nextLine();

      
      totalAmount += outlay[i];
      count++;
      
      
      System.out.print("\n추가로 입력하시겠습니까?(y/n) ");
      response = input.nextLine();
      System.out.println("----------------------------------");
      if(!response.equalsIgnoreCase("y")) {
        break;
      }
      
    }
    
    input.close();

    System.out.println();
    System.out.printf("**** %s 지출내역 ****\n", today);
    System.out.println("------------------------------------");
    
    for (int i = 0; i < count; i++) {
    System.out.printf("지출내역: %d원 - %s\n", outlay[i], expen[i]);
    }
    System.out.println("=====================================");
    System.out.printf("총 지출: %d원\n", totalAmount);
    
    

  }
}
