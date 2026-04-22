package com.eomcs.basic.ex05;

// 산술 연산자 : 명시적 형변환
public class Exam01_7 {
    public static void main(String[] args) {
        byte b;
        
        //b = 256;    // 컴파일 오류!

        // type casting을 명시적으로 지정.
        // => 단 메모리보다 더 큰 값이라면 형변환할 때 값이 잘린다.
        b = (byte)256;
        // int(4byte)  => 0000 0000 0000 0000 0000 0001 0000 0000
        // byte(1byte) =>                               0000 0000
        // 4바이트 중에서 앞의 3바이트가 잘리고 뒤의 1바이트만 b에 저장된다.
        System.out.println(b); // 0
        
        // 결론!
        // => 큰 메모리의 값을 작은 메모리에 넣으려고 형변환을 사용하기도 하는데
        //    다만, 값이 잘리지 않을 때만 할 것!
        
    }
}
