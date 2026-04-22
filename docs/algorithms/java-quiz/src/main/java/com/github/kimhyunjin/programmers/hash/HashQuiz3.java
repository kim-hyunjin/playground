package com.github.kimhyunjin.programmers.hash;

import java.util.*;
import java.util.stream.Collectors;

/**
 * - 문제
 * 2차원 배열 문자열 원소들의 서로 다른 조합 구하기
 */
public class HashQuiz3 {
    public static int solution1(String[][] clothes) {
        int answer = 1;
        Map<String, Integer> clothesMap = new HashMap<>();
        for (String[] clothe : clothes) {
            // 옷가지 종류에 따라 개수 세기
            clothesMap.put(clothe[1],
                    clothesMap.getOrDefault(clothe[1], 0) + 1);
        }

        // 경우의 수 계산하기(옷가지들의 서로 다른 조합)
        for (int count : clothesMap.values()) {
            answer *= (count+1); // 한 종류의 의상을 입지 않는 경우를 포함하기 위해 +1
        }

        return answer - 1; // 모든 의상을 입지 않는 경우는 없기 때문에 -1
    }

    /**
     * 스트림을 사용한 풀이
     * @param clothes
     * @return
     */
    public static int solution2(String[][] clothes) {
        return Arrays.stream(clothes).collect(
                Collectors.groupingBy(clothe -> clothe[1],
                        Collectors.mapping(clothe -> clothe[0],
                                Collectors.counting()))) // 옷가지 종류에 따라 개수 세기
                .values()
                .stream()
                .reduce(1L, (x, y) -> x * (y + 1)).intValue() - 1; // 경우의 수 계산하기(옷가지들의 서로 다른 조합)
    }

    public static void main(String[] args) {
        String[][] clothes = new String[][]{
        {"yellow_hat", "headgear"}, {"blue_sunglasses", "eyewear"}, {"green_turban", "headgear"}
        };
        System.out.println(solution1(clothes));
    }
}
