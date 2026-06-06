package com.eomcs.basic.ex99;

public class Exam22 {
  public static void main(String[] args) {
    // 키보드 정보를 가져오기
    java.io.InputStream keyboard = System.in;

    java.util.Scanner scanner = new java.util.Scanner(keyboard);

    System.out.print("입력> ");
    int i1 = scanner.nextInt(); // 공백과 CRLF를 만날때까지 입력받은 숫자만 int로 리턴
    int i2 = scanner.nextInt(); // 입력받은 문자열이 숫자가 아니라면 int로 바꿀 수 없기 때문에 실행 오류!
    int i3 = scanner.nextInt();

    System.out.println("---------------------------");

    System.out.println(i1);
    System.out.println(i2);
    System.out.println(i3);



  }
}