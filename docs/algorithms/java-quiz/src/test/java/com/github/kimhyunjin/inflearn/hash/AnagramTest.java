package com.github.kimhyunjin.inflearn.hash;

import com.github.kimhyunjin.inflearn.hash.Anagram;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class AnagramTest {

    @Test
    public void test() {
        // given
        String input1 = "AbaAeCe";
        String input2 = "baeeACA";

        Assertions.assertTrue(Anagram.solution2(input1, input2));
    }

}
