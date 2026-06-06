package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

/**
 * 1 ~ n 까지의 수 중에서 r개 뽑는 조합을 모두 출력
 */
public class Combination2 {
    static int n, r;
    static int[] combi;

    public void DFS(int L, int i) {
        if(L==r) {
            for (int x : combi) {
                System.out.print(x + " ");
            }
            System.out.println();
        } else {
            for (; i <= n; i++) {
                combi[L] = i;
                DFS(L+1, i+1);
            }
        }
    }

    public static void main(String[] args) {
        Combination2 combination2 = new Combination2();
        Scanner kb = new Scanner(System.in);
        n = kb.nextInt();
        r = kb.nextInt();
        combi = new int[r];
        combination2.DFS(0, 1);
    }
}
