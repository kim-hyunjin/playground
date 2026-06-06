package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

/**
 * maxNum까지의 수를 pm길이 만큼 나열
 */
public class Permutation {
    static int[] pm;
    static int maxNum;

    public void DFS(int LEVEL) {
        if (LEVEL == pm.length) {
            for (int x : pm) System.out.print(x + " ");
            System.out.println();
        } else {
            for (int i = 1; i <= maxNum; i++) {
                pm[LEVEL] = i;
                DFS(LEVEL+1);
            }
        }
    }

    public static void main(String[] args) {
        Permutation permutation = new Permutation();
        Scanner kb = new Scanner(System.in);

        maxNum = kb.nextInt();
        int pmLen = kb.nextInt();

        pm = new int[pmLen];
        permutation.DFS(0);
    }
}
