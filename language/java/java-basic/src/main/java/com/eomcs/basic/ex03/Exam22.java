package com.eomcs.basic.ex03;

// 리터럴(literal)
// - 자바 언어에서 값을 표기하는 문법

public class Exam22 {
  public static void main(String[] args) {
    // 10진수 리터럴
    System.out.println(2_3500_0000);  // _로 자릿수 표기
    System.out.println(235_000_000);
    // System.out.println(_235_000_000);  에러 
    // System.out.println(235_000_000_);  에러
    // System.out.println(_235_000_000);  에러
    // System.out.println(235_000_000_);  에러
    
    // 8진수 리터럴
    System.out.println(01_44);
    System.out.println(0_144);
    // System.out.println(_0144);  에러
    // System.out.println(0144_);  에러

    // 2진수
    System.out.println(0b110_0100);
    //  System.out.println(0b_1100100);  에러
    // System.out.println(0b1100100_);  에러
    // System.out.println(_0b1100100);  에러
    // 16진수
    System.out.println(0x64);   //0x숫자
    // System.out.println(0X_64);  에러
    //  System.out.println(_0X064);  에러
    //  System.out.println(0X0064_);  에러
  }
}