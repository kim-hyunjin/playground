// Java I/O API 사용하기 - ObjectInputStream으로 Serialize 데이터를 읽기
package com.eomcs.io.ex09.c;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.ObjectInputStream;

public class Exam0320 {

  public static void main(String[] args) throws Exception {
    FileInputStream fileIn = new FileInputStream("temp/test10.data");
    BufferedInputStream bufIn = new BufferedInputStream(fileIn);
    ObjectInputStream in = new ObjectInputStream(bufIn);

    // Serialize로 출력된 데이터를 읽어 다시 원래의 객체로 만들기
    Member member = (Member) in.readObject();

    in.close();

    System.out.println(member);

    // 테스트1 :
    // - Exam0310에서 Member 객체를 출력한다.
    // - Exam0320에서 Member 객체를 읽는다.

    // 테스트2 :
    // - Exam0310에서 Member 객체를 출력한다.
    // - Member 클래스에서 인스턴스 필드 'tel'을 추가한다.
    // - toString()도 변경한다.
    // - Exam0320에서 Member 객체를 읽는다.
    // 결과 : InvalidClassException 발생
    // 이유?
    // deserialize할때
    // 즉, readObject()를 통해 바이트 배열을 읽어 객체를 생성할 때,
    // 같은 클래스인지 검사한다.
    // 만약 다른 클래스라면 InvalidClassException 오류가 발생한다.

    // serialize 클래스와 deserialize 클래스가 같은지 검사하는 방법?
    // - 클래스에 내장된 스태틱 변수인 serialVersionUID의 값을 비교한다.
    //
    // serialVersionUID 스태틱 변수?
    // - java.io.Serializable 이 붙은 클래스는 항상 이 변수를 내장한다.
    // - 개발자가 이 변수의 값을 명시적으로 지정하지 않으면
    //   컴파일러가 자동 부여한다.
    // - 컴파일러는 클래스가 다르면 이 변수의 값도 다르게 한다.
    //
    // 과정
    // 1) 처음에 멤버 클래스를 작성하였다.
    // 2) 컴파일러는 이 클래스에 serialVersionUID 변수에 대해 임의의 값을 부여하였다.
    // 3) Exam0310에서 Member 객체를 출력할 때 이 변수의 값도 출력하였다.
    // 4) Member클래스를 변경하면 컴파일러는 serialVersionUID 변수의 값도 변경시킨다.
    // 5) Exam0320에서 바이트 배열을 읽어서 Member 객체를 생성하려 하였다.
    //    그러나 파일에 저장된 serialVersionUID의 값과 객체 생성을 위해 사용할
    //    Member클래스의 serialVersionUID의 값이 달라 컴파일러는 오류를 띄웠다.

  }

}


