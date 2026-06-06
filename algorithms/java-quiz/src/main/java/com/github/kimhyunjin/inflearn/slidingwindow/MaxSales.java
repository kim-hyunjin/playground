package com.github.kimhyunjin.inflearn.slidingwindow;

import java.util.Scanner;

public class MaxSales {

    private int calculateMaxSales(int[] sales, int consecutiveDays) {
        int sum = 0;
        for (int i = 0; i < consecutiveDays; i++) {
            sum += sales[i];
        }
        int max = sum;

        for (int i = consecutiveDays; i < sales.length; i++) {
            sum += (sales[i] - sales[i - consecutiveDays]); // 윈도우 이동
            max = Math.max(max, sum);
        }
        return max;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int days = in.nextInt();
        int continuity = in.nextInt();
        int[] sales = new int[days];
        for (int i = 0; i < days; i++) {
            sales[i] = in.nextInt();
        }
        MaxSales maxSales = new MaxSales();
        System.out.println(maxSales.calculateMaxSales(sales, continuity));
        return ;
    }

}
