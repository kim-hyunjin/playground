package com.github.kimhyunjin.inflearn.hash;

import com.github.kimhyunjin.inflearn.hash.FindAllAnagram;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class FindAllAnagramTest {

    @Test
    public void test() {
        String S = "bacaAacba";
        String T = "abc";
        assertEquals(FindAllAnagram.solution2(S, T), 3);
    }
}
