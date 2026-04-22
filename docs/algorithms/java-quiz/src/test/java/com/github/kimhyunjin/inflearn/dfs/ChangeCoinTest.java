package com.github.kimhyunjin.inflearn.dfs;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;

public class ChangeCoinTest {

    @Test
    public void test() {
        ChangeCoin changeCoin = new ChangeCoin();

        ChangeCoin.coins = new Integer[]{1, 5, 10, 15, 20, 25, 30, 50, 70, 65, 90};
        Arrays.sort(ChangeCoin.coins, Collections.reverseOrder());
        ChangeCoin.change = 390;

        changeCoin.DFS(0, 0);
        int expected = 5;
        int actual = ChangeCoin.answer;
        Assertions.assertEquals(expected, actual);
    }
}
