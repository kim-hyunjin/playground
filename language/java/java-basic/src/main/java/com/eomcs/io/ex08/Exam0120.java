// DataInputStream으로 객체 읽기 - 파일이 데이터를 읽어 인스턴스로 만들기
package com.eomcs.io.ex08;

import java.io.FileInputStream;

public class Exam0120 {

  public static void main(String[] args) throws Exception {
    // 첫번째 부품
    FileInputStream fileIn = new FileInputStream("temp/test6.data");

    // 첫번째 부품에 다른 부품 연결
    // FileInputStream 객체에 String,int,boolean 값을 읽는
    // 플러그인/장신구/보조장치(decorator)를 장착한다.
    // - 이 장신구(DataInputStream)는 데이터를 가공하는 일을 한다.
    // - 실제 데이터를 읽는 일은 이 장신구와 연결된 부품(FileInputStream)이 한다.
    DataInputStream in = new DataInputStream(fileIn);

    Member member = new Member();

    // 플러그인을 통해 String, int, boolean 값을 읽는다.
    member.name = in.readUTF();
    member.age = in.readInt();
    member.gender = in.readBoolean();

    in.close();

    System.out.printf("%s\n", member);
  }
}






