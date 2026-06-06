package com.github.kimhyunjin.inflearn.array;

import java.util.Arrays;
import java.util.Comparator;
import java.util.Scanner;

public class Ranking {

    private int[] solution(int[] scores) {
        // 점수순으로 정렬
        Integer[] ranking = Arrays.stream(scores).boxed().toArray(Integer[]::new);
        Arrays.sort(ranking, Comparator.reverseOrder());

        // 내 등수를 랭킹 배열을 순회하며 찾기
        int[] result = new int[scores.length];
        for (int i = 0; i < scores.length; i++) {
            for (int j = 0; j < scores.length; j++) {
                if (scores[i] == ranking[j]) {
                    result[i] = j + 1;
                    break;
                }
            }
        }
        return result;
    }

    // 불필요하게 따로 정렬할 필요없이 이중 for 문만으로도 단순하게 해결 가능한 문제였음
    private int[] solution2(int[] scores) {
        int[] result = new int[scores.length];
        for (int i = 0; i < scores.length; i++) {
            result[i] = 1; // 나보다 큰 점수가 없으면 1등이므로 1로 셋팅
            for (int score : scores) {
                if (score > scores[i]) result[i] += 1; // 나보다 큰 점수가 있으면 등수가 1씩 밀려난다. -> 이부분이 이 풀이의 주요한 아이디어
            }
        }
        return result;
    }

    public static void main(String[] args){
        Ranking ranking = new Ranking();
        Scanner in = new Scanner(System.in);
        int input1 = in.nextInt();
        int[] scores = new int[input1];
        for (int i = 0; i < input1; i++) {
            scores[i] = in.nextInt();
        }
        int[] ranked = ranking.solution2(scores);
        for (int i : ranked) {
            System.out.print(i + " ");
        }
        return ;
    }
}
