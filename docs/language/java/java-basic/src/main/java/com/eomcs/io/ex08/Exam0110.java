// DataOutputStream을 이용하여 객체 출력 - 인스턴스의 값을 출력
package com.eomcs.io.ex08;

import java.io.FileOutputStream;

public class Exam0110 {

  public static void main(String[] args) throws Exception {

    // 상속을 통한 기능 확장의 문제점
    // - 자바는 다중 상속이 불가능하기 때문에
    //   여러 클래스에 있는 기능을 조합하려면
    //   별도의 클래스를 생성하여 기존 코드를 복사해와야한다.
    //   결국 코드가 중복되는 문제가 발생한다.
    //
    //   또한 상황에 따라 다양한 조합을 수행하다보면
    //   중복코드를 갖는 클래스가 많이 생성되어 유지보수를 어려워진다.
    //
    // 해결책?
    // - 확장 기능을 장식품(DECORATOR)처럼 붙였다 뗐다 할수 있게 만들자.
    // - like 'LEGO' block!
    // - 붙이는 부분이 같은 유형으로 되어 있다.
    //
    // Decorator Design Pattern
    // - 모든 부품은 같은 유형으로 되어 있다.
    // - 즉, 같은 부모의 자식이다.
    // - 다른 부품을 붙일 수 있도록 생성자를 만든다.

    // 첫 번째 부품
    FileOutputStream fileOut = new FileOutputStream("temp/test6.data");

    // 부품 추가
    // 기존의 FileOutputStream 객체에 String, int, boolean 값을 출력하는
    // 장신구/보조장치/플러그인(decorator)을 장착한다.
    // 장신구 객체를 생성할 때 이 장신구가 사용할 부품을 생성자 parameter로 전달한다.
    DataOutputStream out = new DataOutputStream(fileOut);

    Member member = new Member();
    member.name = "AB가각간";
    member.age = 27;
    member.gender = true;

    // 장신구/보조장치/플러그인(decorator)를 사용하여 String,int,boolean 값을 출력한다.
    out.writeUTF(member.name);
    out.writeInt(member.age);
    out.writeBoolean(member.gender);

    out.close();

    System.out.println("데이터 출력 완료!");

  }

}
