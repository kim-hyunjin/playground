package com.github.kimhyunjin.inflearn.sortandsearch;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class CheckDuplicateTest {

    private CheckDuplicate application;

    @BeforeEach
    public void setup() {
        application = new CheckDuplicate();
    }

    @Test
    public void test1() {
        String expect = "D";
        String actual = application.solution(new int[]{20, 25, 52, 30, 39, 33, 43, 33});

        Assertions.assertEquals(expect, actual);
    }

    @Test
    public void test2() {
        String expect = "D";
        String actual = application.solution2(new int[]{20, 25, 52, 30, 39, 33, 43, 33});

        Assertions.assertEquals(expect, actual);
    }

}
