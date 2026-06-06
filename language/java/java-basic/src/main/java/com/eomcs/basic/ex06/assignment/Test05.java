package com.eomcs.basic.ex06.assignment;

// 사용자로부터 나이를 입력받아 성년/미성년 여부를 출력하라!
public class Test05 {
  public static void main(String[] args) {
    int width = Console.inputInt("너비? ");
    int height = Console.inputInt("높이? ");
    Graphic.drawRactangle(width, height, "*");
  }  
}