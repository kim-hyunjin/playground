package com.eomcs.basic.ex06.assignment;

import java.util.Scanner;

public class Console {
  
  @Deprecated   //annotation. 특별한 주석.
  static int inputInt() {
    return inputInt("밑변 길이? ");
  }
  
  static int inputInt(String message) {
    Scanner keyScan = new Scanner(System.in);
    System.out.print(message);
    int width = keyScan.nextInt();
    //keyScan.close();
    return width;
  }
  
}
