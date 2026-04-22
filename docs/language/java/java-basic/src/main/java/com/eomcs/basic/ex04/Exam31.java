package com.eomcs.basic.ex04;

public class Exam31 {
  public static void main(String[] args) {
    // 부동소수점 변수 - 메모리 크기
    float f;

    f = 3.141592f; // 7자리까지는 거의 대부분 정상적으로 들어간다.
    System.out.println(f);

    f = 3.1415927f; // 8자리부터는 데이터가 달라질 수 있다.
    System.out.println(f);

    f = 3.1415929f; // 3.141593
    System.out.println(f);

    f = 0.0000003141592f; // 3.141592E-7  :  소수점 이하인 경우 앞에 있는 0은 무관
    System.out.println(f);

    f = 0.00000031415929f; // 3.1415928E-7
    System.out.println(f);

    f = 314159200000.0f; // 3.14159202E11  :  데이터가 달라짐.
    System.out.println(f);


    double d;
    d = 9.87654321234567; // 15자리
    System.out.println(d);

    d = 98765432.1234567; // 15자리
    System.out.println(d);

    d = 98765432123456.7; // 15자리
    System.out.println(d);

    d = 9.876543212345678; // 9.876543212345679  :  데이터가 달라짐.  16자리부터 데이터가 달라질 확률이 높음
    System.out.println(d);

    d = 9.876543212345674; // 9.876543212345673  :  데이터가 달라짐.
    System.out.println(d);

    // 변수와 리터럴
    f = 99999.88f;
    System.out.println(f);

    f = 99999.887777f;   // 7자리 초과! 4바이트 유효자릿수를 넘어갔다. 때문에 7자리까지인 99999.89로 저장됨.
    System.out.println(f);

    d = 99999.88f;       // 99999.8828125  float의 7자리까지는 그대로이나 double에 맞추어 8~16자리에 왜곡된 값이 들어감.
    System.out.println(d);

    d = 99999.88;
    System.out.println(d);

    float f1 = 99988.88f;
    float f2 = 11.11111f;
    System.out.println(f1);
    System.out.println(f2);

    float f3 = f1 + f2;     // float과 float의 계산결과는 float이다.
    System.out.println(f3); // 99999.99
    // 99988.88
    //+   11.11111
    //------------
    // 99999.99111
    //뒤 111이 잘림.

    double d1 = 99988.88;
    double d2 = 11.11111;
    double d3 = d1 + d2;    // 부동소수점 간 계산할 때에는 double이 좋다.
    System.out.println(d3); // 99999.99111

    f1 = 3.141592f;
    d1 = f1;  //  컴파일 OK. 값이 왜곡되어 들어감.
    System.out.println(d1);  // 3.141592025756836
    
    //f1 = d1; // 컴파일 에러


  }
}