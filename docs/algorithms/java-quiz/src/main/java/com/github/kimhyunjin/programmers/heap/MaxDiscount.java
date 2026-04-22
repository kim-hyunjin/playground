package com.github.kimhyunjin.programmers.heap;

import java.util.ArrayList;
import java.util.Collections;
import java.util.PriorityQueue;

public class MaxDiscount {

    public static int solution(int[] prices, int[] discounts) {
        PriorityQueue<Integer> pricesHeap = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Double> discountsHeap = new PriorityQueue<>(Collections.reverseOrder());
        ArrayList<Integer> discountedPrices = new ArrayList<>();
        for (int price : prices) {
            pricesHeap.add(price);
        }
        for (int discount : discounts) {
            discountsHeap.add((double)discount / 100);
        }
        while (!pricesHeap.isEmpty()) {
            Integer price = pricesHeap.poll();
            if (!discountsHeap.isEmpty()) {
                double maxDiscount = discountsHeap.poll();
                price = price - (int)(price * maxDiscount);
            }
            discountedPrices.add(price);
        }

        return discountedPrices.stream().reduce(0, Integer::sum);
    }

    public static void main(String[] args) {
        int[] prices = {13000, 88000, 10000};
        int[] discounts = {30, 20};
        int result = solution(prices, discounts);
        int expected = 82000;
        if (result == expected) {
            System.out.println("Correct!");
        } else {
            System.out.println("Wrong!");
        }

        int[] prices2 = {32000, 18000, 42500};
        int[] discounts2 = {50, 20, 65};
        int result2 = solution(prices2, discounts2);
        int expected2 = 45275;
        if (result2 == expected2) {
            System.out.println("Correct!");
        } else {
            System.out.println("Wrong!");
        }
    }
}
