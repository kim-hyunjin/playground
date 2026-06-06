package com.github.kimhyunjin.programmers.hash;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * - 문제
 * 문자열 배열 participant, completion 이 있을 때,
 * participant 에는 있지만 completion 에는 없는 문자열 한 개 찾기
 *
 * - 제한사항
 * completion의 길이는 participant의 길이보다 1이 작다.
 * 중복된 문자열이 있다.
 */
public class HashQuiz1 {

    public static String solution1(String[] participant, String[] completion) {
        String answer = "";
        HashMap<String, Integer> map = new HashMap<>();

        for(String player : participant) {
            map.put(player, map.getOrDefault(player, 0) + 1);
        }
        for(String player : completion) {
            map.put(player, map.get(player) - 1);
        }
        answer = map.entrySet().stream().filter(entry -> entry.getValue() != 0).findFirst().get().getKey();
        return answer;
    }

    /**
     * 문자열 정렬 사용
     * @param participant
     * @param completion
     * @return
     */
    public static String solution2(String[] participant, String[] completion) {
        Arrays.sort(participant);
        Arrays.sort(completion);

        int i;
        for (i = 0; i < completion.length; i++) {
            if (!participant[i].equals(completion[i])) {
                return participant[i];
            }
        }
        return participant[i];
    }

    public static String solution3(String[] participant, String[] completion) {
        Map<String, Long> map = Arrays.stream(participant).collect(
                Collectors.groupingBy(Function.identity(), Collectors.counting())
        );

        for(String player : completion) {
            Long value = map.get(player) - 1L;
            if (value == 0L) {
                map.remove(player);
            } else {
                map.put(player, value);
            }
        }

        return map.keySet().iterator().next();
    }

    public static void main(String[] args) {
        String[] participant = new String[]{"김씨", "이씨", "박씨"};
        String[] completion = new String[]{"김씨", "이씨"};

        String result = solution1(participant, completion);
        System.out.println(result);

        result = solution2(participant, completion);
        System.out.println(result);

        result = solution3(participant, completion);
        System.out.println(result);
    }
}
