// Character Stream - 문자 배열 읽기
package com.eomcs.io.ex03;

import java.io.FileReader;

public class Exam0220 {

  public static void main(String[] args) throws Exception {
    FileReader in = new FileReader("temp/test2.txt");

    // UTF-16 문자 코드 값을 저장할 배열을 준비한다.
    // => 이렇게 임시 데이터를 저장하기 위해 만든 바이트 배열을 보통 "버퍼(buffer)"라 한다.
    char[] buf = new char[100];

    // read(버퍼의주소)
    // => 버퍼가 꽉 찰 때까지 읽는다.
    // => 물론 버퍼 크기보다 파일의 데이터가 적으면 파일을 모두 읽어 버퍼에 저장한다.
    // => 리턴 값은 읽은 문자의 개수이다.
    // => 파일을 읽을 때 JVM의 문자코드표에 따라 바이트를 읽는다.
    //    그리고 2바이트 UCS2 코드 값으로 변환하여 리턴한다.
    // => JVM의 문자코드표가 UTF-8이라면,
    //    파일을 읽을 때, 영어나 숫자, 특수기호는 1바이트를 읽어 UCS2로 변환할 것이고
    //    한글은 3바이트를 읽어 UCS2으로 변환할 것이다.
    int count = in.read(buf);
    // JVM(UCS2)  File(UTF-8)
    // 00 41 <=== 41
    // 00 42 <=== 42
    // 00 43 <=== 43
    // ac 00 <=== EA B0 80
    // ac 01 <=== EA B0 81
    // ac 04 <=== EA B0 84
    // b6 18 <=== EB 98 98
    // b6 25 <=== EB 98 A5

    in.close();

    System.out.printf("%d\n", count);
    for (int i = 0; i < count; i++)
      System.out.printf("%c(%x) ", buf[i], (int)buf[i]);

    System.out.println();

  }

}




