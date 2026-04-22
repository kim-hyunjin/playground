package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

public class Combination {
    static int n, r;
    static int[][] mem;

    /**
     * 0C0 부터 nCn 까지의 수를 모두 구해 mem 배열에 저장한다.
     * 재귀는 0 ~ n까지 수행된다.
     */
    public void DFS(int L) {
        if(L == n + 1) {
            return;
        } else {
            mem[L][0] = 1;
            for (int i = 1; i < L; i++) {
                mem[L][i] = mem[L-1][i-1] + mem[L-1][i];
            }
            mem[L][L] = 1;
            DFS(L+1);
        }
    }

    /**
     * nCr = n-1Cr-1 + n-1Cr 공식을 재귀로 표현
     */
    public int DFS(int n, int r) {
        if(mem[n][r] > 0) return mem[n][r];
        if(n==r || r==0) return 1;

        return mem[n][r] = DFS(n-1, r-1) + DFS(n-1, r);
    }

    public static void main(String[] args) {
        Scanner in=new Scanner(System.in);
        n = in.nextInt();
        r = in.nextInt();
        mem = new int[n + 1][n + 1];
        Combination combination = new Combination();
        combination.DFS(n, r);
        return ;
    }
}
