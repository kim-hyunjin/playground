package com.eomcs.basic.ex07.test;

public class Test01 {
  public static void main(String[] args) {
    //Function
    // 입력 값: X, 리턴 값: X
    m1();
    
    // 입력 값: O, 리턴 값: X
    m2("홍길동");
    
    // 입력 값: X, 리턴 값: O
    String s = m3();    //리턴값을 String s로 받음
    System.out.println(s);
    
    // 입력 값: O, 리턴 값: O
    String s2 = m4("홍길동");
    System.out.println(s2);
  }
  
  static void m1() {    //void : return값이 없다는 뜻, () : function에서 받는 데이터 없음
    System.out.println("Hello!");
  }
  
  static void m2(String name) { //String 데이터를 받음
    // 함수 안에 선언된 변수를 로컬 변수라 부른다.
    // 로컬 변수 중에서 함수(메서드)가 호출될 때 넘어온 값을 받는 변수를
    // "파라미터(parameter)"라 부른다.
    // 함수를 호출할 때 넘겨주는 값을 "아규먼트(argument)"라 부른다.
    // 
    System.out.println("Hello, " + name);
  }
  
  static String m3() {          //String 데이터를 return
    String message = "Hello!";
    return message;
  }
  
  static String m4(String name) {
    String message = name + "님 안녕하세요!";
    return message;
  }
  
}
