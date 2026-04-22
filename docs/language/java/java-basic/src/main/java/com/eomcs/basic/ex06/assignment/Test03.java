package com.eomcs.basic.ex06.assignment;

import java.util.Scanner;

public class Test03 {
  public static void main(String[] args) {
    Scanner keyScan = new Scanner(System.in);
    System.out.print("피라미드 층 수는? ");
    int level = keyScan.nextInt();
    int floor = 1;
    int starLen = 1;
    int spaceLen = level-1;
    
    while (floor <= level) {
      //공백 찍는 기능
      int space = 1;
      while (space <= spaceLen) {
        System.out.print(" ");
        space++;
      }
      //별 찍는 기능
      int star = 1;
      while(star <= starLen) {
        System.out.print("*");
        star++;
      }
      //층수 내리고 별 길이 2개 증가, 공백 1감소.
      System.out.println();
      floor++;
      starLen += 2;
      spaceLen -= 1;
    }
    keyScan.close();
  }
}

