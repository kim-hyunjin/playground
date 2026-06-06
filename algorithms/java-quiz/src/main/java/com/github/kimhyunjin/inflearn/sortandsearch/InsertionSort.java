package com.github.kimhyunjin.inflearn.sortandsearch;

import java.util.Scanner;

/**
 * 삽입 정렬
 * 삽입 정렬(揷入整列, insertion sort)은 자료 배열의 모든 요소를 앞에서부터 차례대로 이미 정렬된 배열 부분과 비교하여,
 * 자신의 위치를 찾아 삽입함으로써 정렬을 완성하는 알고리즘이다.
 *
 * 배열이 길어질수록 효율이 떨어진다. 다만, 구현이 간단하다는 장점이 있다.
 *
 * 선택 정렬이나 거품 정렬과 같은 같은 O(n2) 알고리즘에 비교하여 빠르며, 안정 정렬이고 in-place 알고리즘이다.
 * [위키백과, https://ko.wikipedia.org/wiki/%EC%82%BD%EC%9E%85_%EC%A0%95%EB%A0%AC]
 */
public class InsertionSort {

    public static int[] solution(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int insertValue = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > insertValue) {
                arr[j + 1] = arr[j]; // 내가 삽입할 값의 자리를 마련하기 위해 더 큰 값들을 오른쪽으로 미는 중
                j--;
            }
            arr[j + 1] = insertValue;
        }
        return arr;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int len = in.nextInt();
        int[] arr = new int[len];
        for (int i = 0; i < arr.length; i++) arr[i] = in.nextInt();

        for (int i : solution(arr)) System.out.print(i + " ");
        return ;
    }

}
