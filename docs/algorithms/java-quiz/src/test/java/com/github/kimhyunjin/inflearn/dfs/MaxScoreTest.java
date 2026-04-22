package com.github.kimhyunjin.inflearn.dfs;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class MaxScoreTest {

    @Test
    public void test() {
        MaxScore.timeLimit = 20;
        MaxScore.problem = new int[][] {
                {10, 5},
                {25, 12},
                {15, 8},
                {6, 3},
                {7, 4}
        };
        MaxScore maxScore = new MaxScore();
        maxScore.solution(0, 0, 0);
        int expected = 41;
        int actual = MaxScore.answer;
        Assertions.assertEquals(expected, actual);
    }
}
