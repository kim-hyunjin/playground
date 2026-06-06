package com.github.kimhyunjin.inflearn.slidingwindow;

import java.util.Scanner;

/*
    input 15
    output 3
 */
public class ConsecutiveNSum {

    private static int solution(int targetSum) {
        int answer = 0;
        int[] arr = new int[targetSum];
        for (int i = 1; i < targetSum; i++) {
            arr[i] = i;
        }

        int f = 1, b = 1, sum = 0;
        while (b < arr.length) {
            if (sum == targetSum) {
                answer++;
                sum -= arr[f++];
            } else if (sum < targetSum) {
                sum += arr[b++];
            } else {
                sum -= arr[f++];
            }
        }

        while (f < arr.length) {
            if (sum == targetSum) {
                answer++;
            }
            sum -= arr[f++];
        }

        return answer;
    }

    private static int solution2(int target) {
        // 목표값이 되는 연속된 자연수의 두 합은 목표값 / 2 + 1까지만 찾아봐도 된다.
        int answer = 0, lt = 0, sum = 0;

        int[] arr = new int[target / 2 + 1];
        for (int i = 0; i < arr.length; i++) arr[i] = i + 1;

        for (int rt = 0; rt < arr.length; rt++) {
            sum += arr[rt];
            if (sum == target) answer++;
            while (sum >= target) {
                sum -= arr[lt++];
                if (sum == target) answer++;
            }
        }

        return answer;
    }

    /* 수학으로 풀기
       미리 연속된 자연수를 나열해두고 목표값에 그만큼 뺀다.(1과 2)
       15 - 1 - 2
       그리고 나열된 수에 동일하게 값을 나눠준다.(정확히 나누어떨어지지 않으면 나열된 개수(여기선 2개)로는 연속된 합으로 목표값을 만들지 못함)
       12 / 2 = 6
       1 + 6 = 7
       2 + 6 = 8
       ==> 7 + 8 = 15

       15 -1 -2 -3
       9 / 3 = 3
       1 + 3
       2 + 3
       3 + 3
       ==> 4 + 5 + 6 = 15
     */
    private static int solution3(int target) {
        int answer = 0, cnt = 1;
        target--;
        while (target > 0) {
            target -= ++cnt;
            if (target % cnt == 0) answer++;
        }
        return answer;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int targetSum = in.nextInt();
        System.out.println(solution3(targetSum));
        return ;
    }
}
