package com.eomcs.basic.ex04;
// 변수의 종류

public class Exam71 {
  
  int instanceVar;  // 인스턴스 필드(변수) => new 명령을 실행할 때 준비되는 변수
  static int classVar;  // 클래스 필드(변수) = 스태틱 필드(변수) => 클래스가 로딩될 때 준비되는 변수
  
  // 클래스 메서드 = 스태틱 메서드
  public static void main(String[] args/*로컬 변수(파라미터)*/) {
    // 로컬 변수
    // => 메서드를 실행할 때 준비되는 변수
    // => 메서드 블록 안에 선언된 변수
    // => 메서드 블록을 벗어나서 사용할 수 없다.
    int local;  // 로컬 변수
    int local2;
    
    // static 메서드에서는 static 필드를 사용할 수 있다.
    classVar = 200; // OK!
    
    // static이 안 붙은 인스턴스 필드를 사용할 수 없다.
    //instanceVar = 300;    // 컴파일 오류!
  }
  
  // 클래스 메서드 = 스태틱 메서드
  static void m1() {
    // 메서드 블럭이 다르면 변수도 다르다.
    // 그래서 같은 이름의 변수를 선언할 수 있다.
    int local; // 로컬 변수
    
    // 다른 메서드 블록에 있는 변수를 사용할 수 없다.
    // local2 = 100;   // 컴파일 오류!
    
    // static 메서드에서는 static 필드를 사용할 수 있다.
    classVar = 100; // OK!
    
    // static이 안 붙은 인스턴스 필드를 사용할 수 없다.
    //instanceVar = 400;    // 컴파일 오류!
  }
  
  // 인스턴스 메서드
  void m2() {
    int local;  // OK!
    
    // 인스턴스 메서드는 static필드와 instance필드 모두 사용 가능
    classVar = 200; // OK!
    instanceVar = 200;  // OK!  
  }
}


