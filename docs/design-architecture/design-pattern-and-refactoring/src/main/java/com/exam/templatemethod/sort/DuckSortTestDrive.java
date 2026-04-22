package com.exam.templatemethod.sort;

import java.util.Arrays;

public class DuckSortTestDrive {
    public static void main(String[] args) {
        Duck[] ducks = {
                new Duck("꽥꽥이", 8),
                new Duck("꽉꽉이", 2),
                new Duck("뀍뀍이", 7),
                new Duck("미운오리", 2),
                new Duck("이쁜오리", 10)
        };
        System.out.println("정렬 전:");
        display(ducks);

        Arrays.sort(ducks);

        System.out.println("\n정렬 후:");
        display(ducks);
    }

    private static void display(Duck[] ducks) {
        for (Duck duck : ducks) {
            System.out.println(duck);
        }
    }
}
