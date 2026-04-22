package com.eomcs.basic.ex04;

public class Exam16 {
  public static void main(String[] args) {
    // 변수의 종류
    // => primitive data type(자바 원시 데이터 타입)
    byte b; // 1byte 크기를 갖는 메모리
    short s; // 2byte
    int i; // 4byte
    long l; // 8byte

    float f; // 4byte
    double d; // 8byte

    boolean bool; // jvm에서 int로 취급 4byte

    char c; // 2byte

    // => reference : 다른 메모리의 주소를 저장하는 변수
    String str;               //문자열을 저장하고 있는 메모리의 주소를 저장
    java.sql.Date date;       //날짜 정보를 저장하고 있는 메모리의 주소를 저장
    Thread t;                 //쓰레드 정보를 저장하고 있는 메모리의 주소를 저장
    java.net.Socket socket;   //네트워크 연결 정보를 저장하고 있는 메모리의 주소를 저장

    
  }
}