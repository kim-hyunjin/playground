package com.eomcs.basic.ex02;

public class Exam3 {
  public static void main(String[] args) {
    System.out.println("애노테이션"); 
  }

  // 애노테이션(annotation)
  // - 컴파일러나 JVM에게 지시하는 명령

  @Override // <== 컴파일러에게 기능을 재정의함을 알리는 명령이다.
  public String toString() {
    return "okok";
  }
}