package com.github.kimhyunjin.inflearn.sortandsearch;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class CheckDuplicate {

    public String solution(int[] numbers) {
        Set<Integer> set = new HashSet();
        for (int num : numbers) {
            if (set.contains(num)) return "D";
            set.add(num);
        }
        return "U";
    }

    // 정렬로도 풀어볼 수 있다.
    public String solution2(int[] numbers) {
        Arrays.sort(numbers);
        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] == numbers[i+1]) return "D";
        }
        return "U";
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int N = in.nextInt();
        int[] numbers = new int[N];
        for (int i = 0; i < numbers.length; i++) {
            numbers[i] = in.nextInt();
        }
        CheckDuplicate checkDuplicate = new CheckDuplicate();
        System.out.println(checkDuplicate.solution(numbers));

        return ;
    }
}
