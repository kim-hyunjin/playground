package com.github.kimhyunjin.inflearn.twopointer;

import java.util.*;

public class CommonElement {

    private int[] solution(int[] arr1, int[] arr2) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int a : arr1) {
            map.put(a, map.getOrDefault(a, 0) + 1);
        }
        for (int a: arr2) {
            map.put(a, map.getOrDefault(a, 0) + 1);
        }
        List<Integer> list = new ArrayList<>();
        map.forEach((key, value) -> {
            if (value == 2) {
                list.add(key);
            }
        });

        return list.stream().sorted().mapToInt(i -> i).toArray();
    }

    // 포인터 2개 사용
    private List<Integer> solution2(int[] arr1, int[] arr2) {
        ArrayList<Integer> answer = new ArrayList<>();
        Arrays.sort(arr1);
        Arrays.sort(arr2);
        int p1 = 0, p2 = 0;
        while (p1 < arr1.length && p2 < arr2.length) {
            if (arr1[p1] == arr2[p2]) {
                answer.add(p1);
                p1++;
                p2++;
            } else if (arr1[p1] < arr2[p2]) {
                p1++;
            } else p2++;
        }
        return answer;
    }

    public static void main(String[] args){
        CommonElement commonElement = new CommonElement();
        Scanner in=new Scanner(System.in);
        int input1 = in.nextInt();
        int[] arr1 = new int[input1];
        for (int i = 0; i < arr1.length; i++) {
            arr1[i] = in.nextInt();
        }
        int input2 = in.nextInt();
        int[] arr2 = new int[input2];
        for (int i = 0; i < arr2.length; i++) {
            arr2[i] = in.nextInt();
        }

        for(int a : commonElement.solution(arr1, arr2)) {
            System.out.print(a + " ");
        }

        return ;
    }
}
