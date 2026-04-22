package com.github.kimhyunjin.inflearn.dfs;

import java.util.Arrays;
import java.util.Collections;
import java.util.Scanner;

public class ChangeCoin {
    static Integer[] coins;
    static int change;
    static int answer = Integer.MAX_VALUE;

    public void DFS(int usedCoin, int sum) {
        if (usedCoin >= answer) return;
        if (sum > change) return;
        if (sum == change){
            answer = usedCoin;
        } else {
           for (int c : coins) {
               DFS(usedCoin+1, sum+c);
           }
        }
    }
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int N = in.nextInt();
        coins = new Integer[N];
        for (int i = 0; i < N; i++) {
            coins[i] = in.nextInt();
        }
        Arrays.sort(coins, Collections.reverseOrder());
        change = in.nextInt();

        ChangeCoin changeCoin = new ChangeCoin();
        changeCoin.DFS(0, 0);
        System.out.println(answer);

        return ;
    }

}
