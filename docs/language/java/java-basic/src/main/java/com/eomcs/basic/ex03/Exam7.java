package com.eomcs.basic.ex03;

// 이스케이프 문자(escape character)

public class Exam7 {
  public static void main(String[] args) {
    // 이스케이프 문자
    // - 문자를 제어하는 기능을 가진 문자
    // - 문법
    //    \n , \r, \f, \t, \b, \', \", \\
    //
    System.out.println("Hello,World!");
    System.out.println("Hello,\nWorld!");     // 줄바꿈
    System.out.println("Hello,\rabc");        // 커서(cursor; 문자를 출력할 위치를 가리킴)를 처음으로 돌리는 문자
                                              // Hello,를 쓰고 커서를 처음으로 보내 그 뒤 abc를 출력. Hel을 덮어씀
    System.out.println("Hello,\b\b\bWorld!"); // 커서를 이전으로 한칸 이동시키는 문자
                                              // Hello,를 쓰고 커서를 이전으로 3칸 이동시킨뒤 World!를 출력. 'lo,'가 덮어써짐
    System.out.println("Hello,\tWorld!");     // tap 공간을 추가시키는 문자
    System.out.println("Hello,\fWorld!");     // formfeed; 과거 dot print에서 사용하던 기능
    System.out.println("Hello,\"W\"orld!");   // " 문자를 추가시키는 문자
    System.out.println("Hello,\'W\'orld!");
    System.out.println("Hello,'W'orld!");     // ""안에서 ' 문자는 그냥 적어도 된다.
    System.out.println('\'');                 // ''안에서 ' 문자를 출력하려면 \ 필요.
    System.out.println('\"');                 
    System.out.println('"');                  // ''안에 " 문자는 그냥 적어도 된다.
    System.out.println("C:\\Users\\user");    // \ 문자를 출력하고싶으면 \\

    // 대부분 언어에서 이스케이프 문자는 동일.
  }
}
    // 줄바꿈 코드
    // Carrage Return(CR) : 0d
    // Line Feed(LF) : 0a
    //
    // - windows OS 에서는 줄바꿈을 표시하기 위해 CRLF 2바이트 코드를 삽입한다.
    // - Unix OS 에서는 줄바꿈을 표시하기 위해 LF 1바이트 코드를 삽입한다.