package com.bitcamp.myproject;

import java.util.Scanner;

public class App {
    public static void main(String[] args) {
      
      Scanner input = new Scanner(System.in);
      
      int arrSize = 100;
      String[] account = new String[arrSize];
      String[] purpose = new String[arrSize];
      int[] balance = new int[arrSize];
      long totalBalance = 0;
      String response = "";
      
      int count = 0;
      for (int i = 0; i < arrSize; i++) {
        System.out.print("계좌번호를 입력하세요: ");
        account[i] = input.nextLine();
        
        System.out.print("계좌용도를 입력하세요: ");
        purpose[i] = input.nextLine();
        
        System.out.print("잔액을 입력하세요: ");
        balance[i] = Integer.parseInt(input.nextLine());
        
        totalBalance += balance[i];
        count++;
        
        System.out.print("\n계좌정보를 추가하시겠습니까?(y/n) ");
        response = input.nextLine();
        System.out.println();
        
        if (!response.equalsIgnoreCase("y")) {
          break;
        }
        
      }
      
      input.close();
      System.out.println();
      
      for (int i = 0; i < count; i++) {
      System.out.println("-------------------------------------");
      System.out.printf("계좌번호: %s\n", account[i]);
      System.out.printf("계좌용도: %s\n", purpose[i]);
      System.out.printf("잔액: %d\n", balance[i]);
      }
      
      System.out.println("=====================================");
      System.out.printf("총잔액: %d", totalBalance);
    }
}
