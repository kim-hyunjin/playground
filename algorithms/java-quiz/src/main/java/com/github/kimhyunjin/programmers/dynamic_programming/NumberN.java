package com.github.kimhyunjin.programmers.dynamic_programming;

import java.util.HashSet;
/**
 * 문제 설명
 * 아래와 같이 5와 사칙연산만으로 12를 표현할 수 있습니다.
 *
 * 12 = 5 + 5 + (5 / 5) + (5 / 5)
 * 12 = 55 / 5 + 5 / 5
 * 12 = (55 + 5) / 5
 *
 * 5를 사용한 횟수는 각각 6,5,4 입니다. 그리고 이중 가장 작은 경우는 4입니다.
 * 이처럼 숫자 N과 number가 주어질 때, N과 사칙연산만 사용해서 표현 할 수 있는 방법 중 N 사용횟수의 최솟값을 return 하도록 solution 함수를 작성하세요.
 *
 * 제한사항
 * N은 1 이상 9 이하입니다.
 * number는 1 이상 32,000 이하입니다.
 * 수식에는 괄호와 사칙연산만 가능하며 나누기 연산에서 나머지는 무시합니다.
 * 최솟값이 8보다 크면 -1을 return 합니다.
 */
public class NumberN {
    public int solution(int N, int number) {
        HashSet<Integer>[] dp = new HashSet[9];
        for (int i = 1; i <= 8; i++) {
            HashSet<Integer> set = new HashSet<>();
            set.add(Integer.parseInt(String.valueOf(N).repeat(i)));
            dp[i] = set;
            for (int j = 1; j < i; j++) {
                for (int n1 : dp[j]) {
                    for (int n2 : dp[i - j]) {
                        dp[i].add(n1 + n2);
                        dp[i].add(n1 - n2);
                        dp[i].add(n1 * n2);
                        if (n2 != 0) {
                            dp[i].add(n1 / n2);
                        }
                    }
                }
            }
            if (dp[i].contains(number)) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        NumberN numberN = new NumberN();
        if (numberN.solution(5, 12) == 4) {
            System.out.println("exam1 OK");
        }
        if (numberN.solution(2, 11) == 3) {
            System.out.println("exam2 OK");
        }
    }
}
