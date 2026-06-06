package com.eomcs.basic.ex06.assignment;

import java.util.Scanner;

public class Test01 {
  public static void main(String[] args) {
    Scanner keyScan = new Scanner(System.in);
    System.out.print("밑변의 길이? ");
    int length = keyScan.nextInt();
    
    // 밑변길이에 도달할 때까지 한 층 내려갈때마다 별 찍는 개수(카운트) 1씩 증가
    int count = 1;
    while (count <= length) {
      // 1부터 카운트수까지 별 찍기
      int star = 1;
      while(star <= count) {
        System.out.print("*");
        star++;
      }
      // 한 층 내려와서 카운트 증가
      System.out.println();
      count++;
      keyScan.close();
    }
  }
}