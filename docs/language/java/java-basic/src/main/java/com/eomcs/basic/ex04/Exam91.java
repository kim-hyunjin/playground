package com.eomcs.basic.ex04;

// 형변환 : 정수 변수 ==> 부동소수점 변수

public class Exam91 {
  
  public static void main(String[] args) {
    byte b = 100;
    short s = 200;
    int i = 18_3456_7890;
    long l = 344_9876_9876_7654_3210L;
    
    // 크기에 상관없이 정수 변수의 값을 부동소수점 변수에 넣을 때
    // 컴파일 오류가 발생하지 않는다!
    // 단 실행할 때 유효자릿수가 넘어가면 값이 잘릴 수 있다.
    
    float f;
    f = b;
    System.out.println(f);
    f = s;
    System.out.println(f);
    f = i;
    System.out.println(f);  //  1.83456794E9
    f = l;
    System.out.println(f);  //  3.44987689E18
    
    
    double d;
    d = b;
    System.out.println(d);
    d = s;
    System.out.println(d);
    d = i;
    System.out.println(d);  //  1.83456789E9
    d = l;
    System.out.println(d);  //  3.449876987676543E18
    
  }
  
}


