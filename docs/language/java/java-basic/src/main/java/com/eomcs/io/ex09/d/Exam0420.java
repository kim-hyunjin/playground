// Java I/O API 사용하기 - ObjectInputStream으로 Serialize 데이터를 읽기
package com.eomcs.io.ex09.d;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.ObjectInputStream;

public class Exam0420 {

  public static void main(String[] args) throws Exception {
    FileInputStream fileIn = new FileInputStream("temp/test11.data");
    BufferedInputStream bufIn = new BufferedInputStream(fileIn);
    ObjectInputStream in = new ObjectInputStream(bufIn);

    // 테스트 1:
    // - Member 클래스를 변경하지 않은 상태에서 데이터 읽기
    // - 결과 => OK!
    // 테스트 2:
    // - Member 클래스에 tel 필드 추가하고 데이터 읽기
    // - 결과 => OK!
    // 테스트 3:
    // - Member 클래스에서 age 필드를 제거하고 데이터 읽기
    // - 결과 => OK!
    Member member = (Member) in.readObject();

    in.close();

    System.out.println(member);

  }

}


