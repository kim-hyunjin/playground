package com.github.kimhyunjin.inflearn.sortandsearch;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

public class MischiefMakerTest {

    private MischiefMaker mischiefMaker;

    @BeforeEach
    public void setup() {
        mischiefMaker = new MischiefMaker();
    }

    @Test
    public void test() {
        int[] expected = new int[]{3, 8};
        List<Integer> actual = mischiefMaker.solution(new int[]{120, 125, 152, 130, 135, 135, 143, 127, 160});

        Assertions.assertArrayEquals(expected, actual.stream().mapToInt(Integer::intValue).toArray());
    }

    @Test
    public void test2() {
        int[] expected = new int[]{24, 27};
        List<Integer> actual = mischiefMaker.solution(new int[]{122, 123, 125, 125, 128, 130, 133, 137, 138, 138, 140, 141, 142, 143, 145, 147, 149, 149, 154, 154, 155, 157, 161, 167, 167, 167, 161, 170, 173, 173});

        Assertions.assertArrayEquals(expected, actual.stream().mapToInt(Integer::intValue).toArray());
    }
}
