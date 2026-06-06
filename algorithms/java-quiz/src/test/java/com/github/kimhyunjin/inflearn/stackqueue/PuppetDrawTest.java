package com.github.kimhyunjin.inflearn.stackqueue;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class PuppetDrawTest {

    @Test
    public void test() {
        // given
        int[][] puppets = {
                {0, 0, 0, 0, 0},
                {0, 0, 1, 0, 3},
                {0, 2, 5, 0, 1},
                {4, 2, 4, 4, 2},
                {3, 5, 1, 3, 1}
        };
        int[] move = {1, 5, 3, 5, 1, 2, 1, 4};
        int expect = 4;

        int actual = PuppetDraw.solution2(puppets, move);

        Assertions.assertEquals(expect, actual);

    }
}
