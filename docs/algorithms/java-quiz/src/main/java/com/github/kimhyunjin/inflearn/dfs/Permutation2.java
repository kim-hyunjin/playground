package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

public class Permutation2 {
    static int[] permutation, check, numbers;

    public void DFS(int L) {
        if(L == permutation.length) {
            for (int x : permutation) {
                System.out.print(x + " ");
            }
            System.out.println();
        } else {
            for (int i = 0; i < numbers.length; i++) {
                if (check[i] == 0) {
                    check[i] = 1;
                    permutation[L] = numbers[i];
                    DFS(L+1);
                    check[i] = 0;
                }
            }
        }
    }

    public static void main(String[] args) {
        Permutation2 pm = new Permutation2();
        Scanner kb = new Scanner(System.in);
        int n = kb.nextInt();
        int m = kb.nextInt();
        numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = kb.nextInt();
        }
        check = new int[n];
        permutation = new int[m];
        pm.DFS(0);

    }
}
