package com.github.kimhyunjin.inflearn.sortandsearch;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

public class LRUTest {

    @Test
    public void lru_solution1_test() {
        LRU lru = new LRU();
        List<Integer> result = lru.solution(3, new int[]{1, 7, 3, 5, 9, 10, 4, 5, 6, 10});
        String actual = "";
        for (int i : result) {
            actual += i + " ";
        }
        String expect = "10 6 5";

        Assertions.assertEquals(expect, actual.trim());
    }

    @Test
    public void lru_solution2_test() {
        LRU lru = new LRU();
        int[] result = lru.solution2(3, new int[]{1, 7, 3, 5, 9, 10, 4, 5, 6, 10});
        String actual = "";
        for (int i : result) {
            actual += i + " ";
        }
        String expect = "10 6 5";

        Assertions.assertEquals(expect, actual.trim());
    }
}
