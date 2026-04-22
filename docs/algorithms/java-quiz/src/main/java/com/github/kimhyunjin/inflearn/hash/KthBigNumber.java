package com.github.kimhyunjin.inflearn.hash;

import java.util.*;

public class KthBigNumber {

    private static int solution(int[] arr, int kth) {
        Set<Integer> set = new HashSet<>();
        for (int i = 0; i < arr.length; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                for (int k = j + 1; k < arr.length; k++) {
                    set.add(arr[i] + arr[j] + arr[k]);
                }
            }
        }

        int[] sorted = set.stream().sorted((a, b) -> b - a).mapToInt(Integer::intValue).toArray();
        if (sorted.length >= kth) {
            return sorted[kth - 1];
        } else {
            return -1;
        }
    }

    // TreeSet을 사용하면 정렬과 동시에 중복을 제거할 수 있다.
    public static int solution2(int[] arr, int kth) {
        TreeSet<Integer> treeSet = new TreeSet<>(Collections.reverseOrder()); // 오름차순으로 정렬하기 위해 생성자에 Comparator를 넘겨줌
        for (int i = 0; i < arr.length; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                for (int k = j + 1; k < arr.length; k++) {
                    treeSet.add(arr[i] + arr[j] + arr[k]);
                }
            }
        }
        int k = kth;
        for (int i : treeSet) {
            k--;
            if (k == 0) return i; // k번째 값이 정답
        }
        return -1;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int len = in.nextInt();
        int[] arr = new int[len];
        int kth = in.nextInt();
        for (int i = 0; i < len; i++) {
            arr[i] = in.nextInt();
        }
        System.out.println(solution(arr, kth));
        return ;
    }
}

/**
 * 처음에 문제를 풀때는 Set으로 중복을 없애고 직접 정렬했지만
 * 강의를 통해, TreeSet을 사용하면 정렬과 동시에 중복을 없앨 수 있다는 것을 알게되었다.
 *
 * 정렬만을 위해서라면 이진트리로 된 TreeMap을 사용할 수도 있다.
 * HashMap은 O(1)로 값을 꺼낼 수 있고,
 * TreeMap은 log(n)으로 꺼낼 수 있다.
 */
