package com.github.kimhyunjin.inflearn.sortandsearch;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class SortTest {

    @Test
    public void insertion_sort_test() {
        // given
        int[] arr = {11, 7, 5, 6, 10, 9};
        int[] expect = {5, 6, 7, 9, 10, 11};

        // when
        int[] actual = InsertionSort.solution(arr);

        // then
        Assertions.assertArrayEquals(expect, actual);
    }

    @Test
    public void selection_sort_test() {
        // given
        int[] arr = {11, 7, 5, 6, 10, 9};
        int[] expect = {5, 6, 7, 9, 10, 11};

        // when
        int[] actual = SelectionSort.solution(arr);

        // then
        Assertions.assertArrayEquals(expect, actual);
    }

    @Test
    public void bubble_sort_test() {
        // given
        int[] arr = {11, 7, 5, 6, 10, 9};
        int[] expect = {5, 6, 7, 9, 10, 11};

        // when
        int[] actual = BubbleSort.sort(arr);

        // then
        Assertions.assertArrayEquals(expect, actual);
    }

}
