package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

public class PermutationGuess {
    static int[] combinations, permutations, check;
    static int[][] mem;
    static int N, F;
    boolean flag = false;

    public int calCombination(int n, int r) {
        if(mem[n][r] > 0) return mem[n][r];
        if(n==r || r==0) return 1;
        return mem[n][r] = calCombination(n-1, r-1) + calCombination(n-1, r);
    }

    public void DFS(int L, int sum) {
        if(flag) return; // 답을 구했다면 더 이상 재귀를 돌 필요가 없다. 스택에 쌓여있는 다른 DFS함수들을 모두 리턴시킨다.
        if(L==N) {
            if(sum==F) {
                for (int x : permutations) {
                    System.out.print(x + " ");
                }
                flag = true;
            }
        } else {
            for (int i = 1; i <= N; i++) {
                if(check[i] == 0) {
                    check[i] = 1; // 순열을 구하기 때문에 체크 필요.
                    permutations[L] = i;
                    DFS(L+1, sum+(permutations[L]*combinations[L]));
                    check[i] = 0;
                }
            }
        }
    }

    /**
     * 조합 3C0 3C1 3C2 3C3
     * 순열  3   1   2   4
     * 위에서 각 열의 (조합 * 순열)의 합이 F 값이다.
     */
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        N = in.nextInt();
        F = in.nextInt();
        combinations = new int[N];
        permutations = new int[N];
        check = new int[N+1];
        mem = new int[N][N];
        PermutationGuess permutationGuess = new PermutationGuess();
        for (int i = 0; i < N; i++) {
            combinations[i] = permutationGuess.calCombination(N-1, i);
        }
        permutationGuess.DFS(0, 0);
        return ;
    }
}
