package com.github.kimhyunjin.leetcode;

import java.util.HashMap;
import java.util.Map;

public class LongestSubstringWithoutRepeat {

    /*
     * 내 풀이
     * */
    public int lengthOfLongestSubstring(String s) {
        int answer = 0;
        for (int i = 0; i < s.length(); i++) {
            int len = getSubstringLen(s, i);
            if (len > answer) answer = len;
        }

        return answer;
    }

    private int getSubstringLen(String s, int startIndex) {
        int len = 0;

        Map<String, Integer> charCountMap = new HashMap<>();
        for (int i = startIndex; i < s.length(); i++) {
            String sub = s.substring(i, i + 1);
            if (charCountMap.get(sub) != null) return len;
            else {
                charCountMap.put(sub, 1);
                len++;
            }
        }

        return len;
    }

    /*
     * 더 좋은 풀이
     * sliding window 사용하기
     * A sliding window is an abstract concept commonly used in array/string problems.
     * A window is a range of elements in the array/string
     * which usually defined by the start and end indices
     * */
    public int betterSolution(String s) {

        int answer = 0;
        Map<Character, Integer> charIndexMap = new HashMap<>();

        // sliding window range [left, right]
        int strLen = s.length();
        for (int left = 0, right = 0; right < strLen; right++) {
            char currentChar = s.charAt(right);
            boolean isRepeat = charIndexMap.containsKey(currentChar);
            if (isRepeat) {
                // 중복된 단어가 left와 right 사이에 있다면
                // 중복된 단어의 다음 인덱스로 jump 해서 새 윈도우를 만든다.
                left = Math.max(left, charIndexMap.get(currentChar));
            }

            // 윈도우의 크기가 곧 중복되지 않은 단어의 길이
            int substringLenWithoutRepeat = right - left + 1;
            answer = Math.max(answer, substringLenWithoutRepeat);

            // 현재 글자 위치의 다음 인덱스를 저장
            charIndexMap.put(currentChar, right + 1);
        }

        return answer;
    }

    public static void main(String[] args) {
        LongestSubstringWithoutRepeat solution = new LongestSubstringWithoutRepeat();
        int answer = solution.lengthOfLongestSubstring("abcabcbb");
        System.out.println(answer == 3);
    }
}
