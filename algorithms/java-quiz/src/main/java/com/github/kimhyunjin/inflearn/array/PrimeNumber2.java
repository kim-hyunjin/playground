package com.github.kimhyunjin.inflearn.array;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class PrimeNumber2 {

    private List<Integer> solution(int[] numbers) {
        List<Integer> result = new ArrayList<>();

        for (int number : numbers) {
            StringBuilder sb = new StringBuilder();
            int reversed = Integer.parseInt(sb.append(number).reverse().toString());
            
            if (isPrime(reversed)) {
                result.add(reversed);
            }
        }

        return result;
    }

    private List<Integer> solution2(int[] numbers) {
        List<Integer> result = new ArrayList<>();

        for (int number : numbers) {
            int reversed = getReverseNum(number);

            if (isPrime(reversed)) {
                result.add(reversed);
            }
        }

        return result;
    }

    private int getReverseNum(int originNum) {
        int result = 0;
        int tmp = originNum;
        while (tmp > 0) {
            int t = tmp % 10; // 10으로 나눈 나머지는 1의 자리다.
            result = result * 10 + t; // 숫자를 뒤집기 위해 이전에 구해둔 값의 자리수 올리기
            tmp = tmp / 10; // 사용된 숫자는 10으로 나눠 잘라내기
        }
        return result;
    }

    private boolean isPrime(int num) {
        if (num == 1) return false;

        for (int i = 2; i * i <= num; i++ ) {
            if (num % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args){
        PrimeNumber2 primeNumber2 = new PrimeNumber2();

        Scanner in=new Scanner(System.in);
        int input1 = in.nextInt();
        int[] numbers = new int[input1];
        for (int i = 0; i < input1; i++) {
            numbers[i] = in.nextInt();
        }

        for (int n : primeNumber2.solution(numbers)) {
            System.out.print(n + " ");
        }

        System.out.println();

        for (int n : primeNumber2.solution2(numbers)) {
            System.out.print(n + " ");
        }

        return ;
    }
}
