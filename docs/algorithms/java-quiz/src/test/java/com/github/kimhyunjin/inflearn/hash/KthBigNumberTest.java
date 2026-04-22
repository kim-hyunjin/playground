package com.github.kimhyunjin.inflearn.hash;

import com.github.kimhyunjin.inflearn.hash.KthBigNumber;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class KthBigNumberTest {

    @Test
    public void test() {
        // given
        int[] arr = new int[]{13, 15, 34, 23, 45, 65, 33, 11, 26, 42};
        int kth = 3;
        int expected = 143;

        // when
        int result = KthBigNumber.solution2(arr, kth);

        // then
        assertEquals(expected, result);
    }
}
