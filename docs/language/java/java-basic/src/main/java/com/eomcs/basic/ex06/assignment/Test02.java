package com.eomcs.basic.ex06.assignment;

import java.util.Scanner;

public class Test02 {
  public static void main(String[] args) {
    Scanner keyScan = new Scanner(System.in);
    System.out.println("가로 길이는? ");
    int length = keyScan.nextInt();
    
    // 가로길이에 도달할 때까지 별 한개씩 증가
    int count = 1;
    while (count <= length) {
      // 카운트 개수만큼 별찍기
      int star = 1;
      while (star <= count) {
        System.out.print("*");
        star++;
      }
      //한층 내려와서 카운트 증가
      System.out.println();
      count++;
    }

      // 가로길이만큼 별찍고 그 이후로 별 한개씩 감소 
    count = count-1;
    while (count >= 1) {
      // 카운트 개수만큼 별 찍기
      int star = 1;
      while (star <= count) {
        System.out.print("*");
        star++;
      }
      // 층 내려올때마다 카운트 감소
      System.out.println();
      count--;
    }
    keyScan.close();
  }
}
