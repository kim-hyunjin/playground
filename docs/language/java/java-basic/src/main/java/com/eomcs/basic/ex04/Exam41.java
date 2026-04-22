package com.eomcs.basic.ex04;

public class Exam41 {
  public static void main(String[] args) {
    // 문자 변수
    short s; // 2byte
    char c;

    s = -32768;
    s = 32767;
    // s = 32768;  범위초과. 컴파일 에러

    c = 0;
    c = 65535;
    // c = -1;  컴파일 에러
    // c = 65536  컴파일 에러

    char c1 = 65;             // A
    char c2 = 0x41;           // A
    char c3 = 0b0100_0001;    // A
    char c4 = 'A';            // A의 문자의 코드값이 변수 c4에 들어간다.(자바의 경우 유니코드 값; UCS-2 코드값)
    System.out.println(c1);
    System.out.println(c2);
    System.out.println(c3);
    System.out.println(c4);

    int i1 = 65;
    int i2 = 'A';
    int i3;
    i3 = i2 + 1;
    System.out.println(i1);   // 65
    System.out.println(i2);   // 65
    System.out.println(i3);   // 66
    System.out.println((char)i3);   // B

    // A ~ Z 까지 출력하기

    for (int i = 65; i < 'A' + 26; i++) {
      System.out.print((char)i);
    }
  }
}