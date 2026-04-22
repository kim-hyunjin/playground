package com.github.kimhyunjin.programmers.stack_queue;

import java.util.Arrays;

public class StockPrice {
    public static void main(String[] args) {
        System.out.println(Arrays.toString(solution(new int[]{1, 2, 3, 2, 3})));
    }

    public static int[] solution(int[] prices) {
        int[] answer = new int[prices.length];
        for(int i = 0; i < prices.length; i++) {
            for (int j = i + 1; j < prices.length; j++) {
                answer[i] += 1;
                if (prices[j] < prices[i]) {
                    break;
                }
            }
        }
        return answer;
    }
}
