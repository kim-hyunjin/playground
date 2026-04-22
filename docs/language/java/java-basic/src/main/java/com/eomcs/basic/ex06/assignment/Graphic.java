package com.eomcs.basic.ex06.assignment;

public class Graphic {
  static void drawLine(int length) {
    int x = 0;
    while(x++ < length) {
      System.out.print("*");
    }
  }
  
  static void drawLine(int length, String s) {
    int x = 0;
    while(x++ < length) {
      System.out.print(s);
    }
  }
  
  static void drawRactangle(int width, int height, String s) {
    for (int i = 0; i < height; i++) {
      for (int j = 0; j < width; j++) {
        System.out.print(s);
      }
      System.out.println();
    }
  }
}
