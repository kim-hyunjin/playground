package com.github.kimhyunjin.inflearn.array;

import java.util.Scanner;

public class Fibonacci {

    public int[] solution(int n) {
        int[] answer = new int[n];
        answer[0] = 1;
        answer[1] = 1;
        for (int i = 2; i < n; i++) {
            answer[i] = answer[i-2] + answer[i-1];
        }
        return answer;
    }

    // 배열을 안쓰고 바로 출력하기
    public void solution2(int n) {
        int a = 1, b = 1, c;
        System.out.print(a + " " + b + " ");
        for(int i = 2; i < n; i++) {
            c = a + b;
            System.out.print(c + " ");
            a = b;
            b = c;
        }
    }

    public static void main(String[] args){
        Fibonacci fibonacci = new Fibonacci();
        Scanner in=new Scanner(System.in);
        int input1 = in.nextInt();
        for(int x : fibonacci.solution(input1)) System.out.print(x + " ");
        return ;
    }

}
