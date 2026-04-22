package com.github.kimhyunjin.inflearn.stackqueue;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class SavingPrincessTest {

    @Test
    public void test() {
        int princeCnt = 8;
        int outCall = 3;
        int expect = 7;

        int actual = SavingPrincess.solution2(princeCnt, outCall);

        Assertions.assertEquals(expect, actual);
    }
}
