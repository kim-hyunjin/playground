package com.github.kimhyunjin.inflearn.sortandsearch;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class StableChoiceTest {

    @Test
    public void test() {
        StableChoice stableChoice = new StableChoice();
        int[] stables = new int[]{1, 5, 9};
        int numOfHorse = 2;
        int actual = stableChoice.solution(stables, numOfHorse);
        int expected = 8;

        Assertions.assertEquals(expected, actual);
    }
}
