package com.eomcs.basic.ex99;

public class Exam11 {
  public static void main(String[] args) {
    // 값 출력하기
    // println() 사용법
    // => 출력 + 줄바꿈
    System.out.println(100);    //정수 출력
    System.out.println(3.14);   //부동소수점 출력
    System.out.println(true);   //논리값 출력
    System.out.println('가');   //문자 출력
    System.out.println("안녕"); //문자열 출력

    System.out.println();

    // print() 사용법
    // => 출력
    System.out.print(100);
    System.out.print(3.14);
    System.out.print(true);
    System.out.print('가');
    System.out.print("안녕");

    System.out.print('\n');
    System.out.print("OK!\n");
    System.out.print("No");

    // printf() 사용법
    // => printf("형식", 값1, 값2, ...);
    System.out.printf("\n이름: %s", "홍길동");    //문자열은 %s
    System.out.printf("\n나이: %d", 20);          //숫자는 %d

    System.out.printf("\n이름(나이): %s(%d)", "홍길동", 20);

    // 정수 삽입
    // %d = decimal
    // %x = hexadecimal
    // %c = character
    System.out.printf("\n %d, %x, %c", 65, 65, 65);

    // 삽입될 값 지정하기
    // => %값위치$d
    System.out.printf("\n %1$d, %1$x, %1$c", 65);

    // 논리 값 삽입
    // %b
    System.out.printf("\n재직자: %s %b", true, true);  //문자열로도 출력가능.
    System.out.printf("\n나이: %s %d", 20, 20);

    // 출력할 공간 확보
    System.out.printf("\n이름: [%s]", "홍길동");
    System.out.printf("\n이름: [%20s]", "홍길동");  // 20자 공간에 "홍길동" 넣음. 오른쪽 정렬.
    System.out.printf("\n이름: [%-20s]", "홍길동"); // 왼쪽 정렬.

    System.out.printf("\n숫자: [%d]", 12345);
    System.out.printf("\n숫자: [%10d]", 12345);
    System.out.printf("\n숫자: [%-10d]", 12345);
    System.out.printf("\n숫자: [%010d]", 12345);    // 빈자리가 0으로 채워짐.
    System.out.printf("\n숫자: [%+010d], [%+010d]", 12345, -12345);   // 양수 음수 기호 표시. 기호가 자리 한칸 차지.

    // 날짜와 시간 다루기
    java.util.Date today = new java.util.Date();
    //today.setDate(9);    // -표시는 앞으로 없어질 기능임을 뜻함. 가능하면 안쓰는 것이 좋음.

    System.out.printf("\n%s", today);  // Thu Dec 12 12:04:06 KST 2019

    // 날짜 객체에서 년, 월, 일, 시, 분, 초, 요일 추출하기
    System.out.printf("\n%tY, %ty", today, today);  // %tY  :  연도를 4자리로 출력,  %ty  :  연도 뒤 2자리만 출력
    System.out.printf("\n%tB, %tb", today, today);  // 월 추출.   영어의 경우 %tB는 December,  %tb는 Dec 출력
    System.out.printf("\n%tm", today);              // 월의 숫자만 출력
    System.out.printf("\n%td, %te", today, today);  // 일 출력. %td  :  09, %te  :  9
    System.out.printf("\n%tA, %ta", today, today);  // 요일 출력.  %tA  :  월요일,  %ta  :  월
    System.out.printf("\n%tH, %tI", today, today);  // 시 출력.  %tH  :  24시로 출력.  %tI  :  13시를 1시로 출력.
    System.out.printf("\n%tM", today);              // 분 출력.
    System.out.printf("\n%tS, %tL, %tN", today, today, today);  // %tS  :  초,  %tL  :  밀리초,  %tN  :  나노초
    System.out.printf("\n%tp, %Tp", today, today);  // 오전 오후 출력.  영어의 경우 %tp  :  pm,  %Tp  :  PM

    // 2019-12-12 12:37:35
    System.out.printf("\n%1$tY-%1$tm-%1$td %1$tH:%1$tM:%1$tS", today);

    String str;
    str = String.format("\n%1$tY-%1$tm-%1$td %1$tH:%1$tM:%1$tS", today);  
    // String.format(format, args)과 형식이 동일. 우리가 원하는 문자열을 만들 때 사용할 수 있다.
    System.out.println(str);
  }
}