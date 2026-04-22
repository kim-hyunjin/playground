package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

public class MaxScore {

    static int timeLimit;
    static int[][] problem;
    static int answer = Integer.MIN_VALUE;

    public void solution(int L, int sumOfScore, int usedTime) {
        if (usedTime > timeLimit) return;
        if (L == problem.length) {
            answer = Math.max(answer, sumOfScore);
        } else {
            solution(L+1, sumOfScore+problem[L][0], usedTime+problem[L][1]);
            solution(L+1, sumOfScore, usedTime);
        }
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int numOfProblems = in.nextInt();
        problem = new int[numOfProblems][numOfProblems];
        timeLimit = in.nextInt();
        for (int i=0; i<numOfProblems; i++) {
            problem[i][0] = in.nextInt();
            problem[i][1] = in.nextInt();
        }
        MaxScore maxScore = new MaxScore();
        maxScore.solution(0, 0, 0);
        System.out.println(answer);
        return ;
    }
}
