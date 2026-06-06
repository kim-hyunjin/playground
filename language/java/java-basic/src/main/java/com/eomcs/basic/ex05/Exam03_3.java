// 논리 연산자 : && vs &
package com.eomcs.basic.ex05;

public class Exam03_3 {
    public static void main(String[] args) {
        boolean a = false;
        boolean b = false;
        boolean r = a && (b = true); 
        // 계산 순서
        // r = a && (b = true)
        // r = false && (b = true)
        // => && 연산에서 왼쪽 값이 false라 이미 결과는 false로 정해짐.
        // r = a && true
        // r = false && true
        // r = false
        System.out.printf("a=%b, b=%b, r=%b\n", a, b, r); // a=false, b=false, r=false

        a = false;
        b = false;
        r = a & (b = true);
        // r = a && true  => b변수의 값을 true로 바꿈.
        // r = false && true
        // r = false
        System.out.printf("a=%b, b=%b, r=%b\n", a, b, r); // a=false, b=true, r=false
    }
}
// &&, ||
// - 앞의 피연산자의 값으로 결과를 알 수 있다면 뒤의 명령은 실행하지 않는다.
// 
// &, |
// - 앞의 피연산자로 결과를 알 수 있을 지라도, 
//   뒤에 놓은 명령까지 모두 실행한다.