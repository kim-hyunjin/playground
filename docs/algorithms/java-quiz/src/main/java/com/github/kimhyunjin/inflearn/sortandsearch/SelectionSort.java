package com.github.kimhyunjin.inflearn.sortandsearch;

import java.util.Scanner;

/**
 * 선택 정렬(選擇整列, selection sort)은 제자리 정렬 알고리즘의 하나로, 다음과 같은 순서로 이루어진다.
 *
 * 주어진 리스트 중에 최소값을 찾는다.
 * 그 값을 맨 앞에 위치한 값과 교체한다(패스(pass)).
 * 맨 처음 위치를 뺀 나머지 리스트를 같은 방법으로 교체한다.
 * 비교하는 것이 상수 시간에 이루어진다는 가정 아래, n개의 주어진 리스트를 이와 같은 방법으로 정렬하는 데에는 Θ(n2) 만큼의 시간이 걸린다.
 *
 * 선택 정렬은 알고리즘이 단순하며 사용할 수 있는 메모리가 제한적인 경우에 사용시 성능 상의 이점이 있다.
 * [위키백과, https://ko.wikipedia.org/wiki/%EC%84%A0%ED%83%9D_%EC%A0%95%EB%A0%AC]
 */
public class SelectionSort {

    public static int[] solution(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int min = Integer.MAX_VALUE;
            int minIndex = -1;
            for (int j = i; j < arr.length; j++) {
                if (arr[j] < min) {
                    min = arr[j];
                    minIndex = j;
                }
            }
            int tmp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = tmp;
        }
        return arr;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int len = in.nextInt();
        int[] arr = new int[len];
        for (int i = 0; i < len; i++) arr[i] = in.nextInt();

        for (int i : solution(arr)) {
            System.out.print(i + " ");
        }
        return ;
    }

}
