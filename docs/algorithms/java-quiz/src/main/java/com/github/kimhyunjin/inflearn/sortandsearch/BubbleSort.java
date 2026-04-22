package com.github.kimhyunjin.inflearn.sortandsearch;

import java.util.Scanner;

/**
 * 거품 정렬 또는 버블 정렬( - 整列, 영어: bubble sort, sinking sort)은 두 인접한 원소를 검사하여 정렬하는 방법이다.
 * 시간 복잡도가 {\displaystyle O(n^{2})}O(n^{2})로 상당히 느리지만,
 * 코드가 단순하기 때문에 자주 사용된다. 원소의 이동이 거품이 수면으로 올라오는 듯한 모습을 보이기 때문에 지어진 이름이다.
 * 양방향으로 번갈아 수행하면 칵테일 정렬이 된다.
 * [위키백과, https://ko.wikipedia.org/wiki/%EA%B1%B0%ED%92%88_%EC%A0%95%EB%A0%AC]
 */
public class BubbleSort {

    public static int[] sort(int[] arr) {
        // 뒤에서부터 큰 수가 정렬된다.
        for (int i = arr.length - 1; i > 0; i--) {
            for (int j = 0; j < i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int len = in.nextInt();
        int[] arr = new int[len];
        for (int i = 0; i < len; i++) {
            arr[i] = in.nextInt();
        }
        for (int i : sort(arr)) {
            System.out.print(i + " ");
        }
        return;
    }
}