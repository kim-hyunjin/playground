package com.github.kimhyunjin.inflearn.stackqueue;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class CorrectBracketTest {

    @Test
    public void test() {
        String brackets = "(()()(()))";
        final boolean expect = true;

        boolean actual = CorrectBracket.isRightBracket2(brackets);

        Assertions.assertEquals(expect, actual);
    }
}
