package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

public class DoggiesOnTruck2 {
    static int[] doggies;
    static int loadableWeight;
    // 정답을 전역으로 빼고, DFS를 돌리는 방법도 있음
    static int answer = Integer.MIN_VALUE;
    public void solution(int L, int sum) {
        if (sum > loadableWeight) return;
        if (L == doggies.length) {
            answer = Math.max(answer, sum);
        }
        else {
            solution(L+1, sum+doggies[L]);
            solution(L+1, sum);
        }
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        loadableWeight = in.nextInt();
        int numOfDoggies = in.nextInt();
        doggies = new int[numOfDoggies];
        for (int i=0; i<doggies.length; i++) {
            doggies[i] = in.nextInt();
        }
        DoggiesOnTruck2 doggiesOnTruck = new DoggiesOnTruck2();
        doggiesOnTruck.solution(0, 0);
        System.out.println(answer);

        return ;
    }
}
