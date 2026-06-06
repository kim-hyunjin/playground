package com.github.kimhyunjin.inflearn.array;

import java.util.Scanner;

public class CalculateScore {

    // 내가 푼 풀이 - 불필요하게 배열 순회를 많이 해서 좋지 않은 풀이...
    private int solution(int[] ox) {
        int[] scores = new int[ox.length];

        for (int i = 0; i < ox.length; i++) {
            if (ox[i] == 0) scores[i] = 0;
            if (ox[i] == 1) {
                int score = 1;
                for (int j = i - 1; j >= 0; j--) {
                    if (ox[j] == 0) break;
                    score++;
                }
                scores[i] = score;
            }
         }

        int result = 0;
        for (int n : scores) {
            result += n;
        }
        return result;
    }

    private int solution2(int[] ox) {
        int answer = 0;
        int cnt = 0;
        for (int n : ox) {
            if (n == 1) {
                cnt++;
                answer += cnt;
            } else cnt = 0;
        }
        return answer;
    }

    public static void main(String[] args){
        CalculateScore calculateScore = new CalculateScore();
        Scanner in=new Scanner(System.in);
        int input1 = in.nextInt();
        int[] ox = new int[input1];
        for (int i = 0;  i < input1; i++) {
            ox[i] = in.nextInt();
        }

        System.out.println(calculateScore.solution(ox));
        System.out.println(calculateScore.solution2(ox));

        return ;
    }
}
