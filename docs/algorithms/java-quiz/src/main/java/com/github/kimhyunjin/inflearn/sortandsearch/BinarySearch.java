package com.github.kimhyunjin.inflearn.sortandsearch;

import java.util.Arrays;
import java.util.Scanner;

public class BinarySearch {

    // 재귀로 풀기
    private int solution(int[] sortedNumbers, int target, int start, int end) {
        if (start > end) return -1;

        int mid = (start + end) / 2;
        if (sortedNumbers[mid] == target) return mid + 1;

        if (sortedNumbers[mid] > target) {
            return solution(sortedNumbers, target, start, mid - 1);
        } else {
            return solution(sortedNumbers, target, mid + 1, end);
        }

    }

    // while 문으로 풀기
    private int solution2(int[] numbers, int target) {
        Arrays.sort(numbers);
        int lt = 0, rt = numbers.length - 1;
        while (lt <= rt) {
            int mid = (lt + rt) / 2;
            if (numbers[mid] == target) {
                return mid + 1;
            }
            if (numbers[mid] > target) rt = mid - 1;
            else lt = mid + 1;
        }
        return -1;
    }


    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int N = in.nextInt();
        int target = in.nextInt();
        int[] numbers = new int[N];
        for (int i = 0; i < N; i++) {
            numbers[i] = in.nextInt();
        }
        Arrays.sort(numbers);

        BinarySearch binarySearch = new BinarySearch();
        System.out.println(binarySearch.solution(numbers, target, 0, numbers.length - 1));
        return ;
    }

}
