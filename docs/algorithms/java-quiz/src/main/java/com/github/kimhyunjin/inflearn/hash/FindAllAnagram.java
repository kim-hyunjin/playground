package com.github.kimhyunjin.inflearn.hash;

import java.util.*;

public class FindAllAnagram {

    private static int solution(String S, String T) {
        int answer = 0;

        char[] targetChars = T.toCharArray();
        Arrays.sort(targetChars);
        String target = compressChars(targetChars);

        int lt = 0, rt = T.length();
        while (rt <= S.length()) {
            char[] tmp = S.substring(lt, rt).toCharArray();
            Arrays.sort(tmp);
            if (target.equals(compressChars(tmp))) answer++;
            lt++;
            rt++;
        }

        return answer;
    }

    public static int solution2(String S, String T) {
        int answer = 0;
        HashMap<Character, Integer> SMap = new HashMap<>();
        HashMap<Character, Integer> TMap = new HashMap<>();

        for (char c : T.toCharArray()) TMap.put(c, TMap.getOrDefault(c, 0) + 1);

        // 윈도우 만들기
        for (int i = 0; i < T.length() - 1; i++) SMap.put(S.charAt(i), SMap.getOrDefault(S.charAt(i), 0) + 1);

        // two pointer, 윈도우 밀기
        int lt = 0, rt = T.length() - 1;
        for (; rt < S.length(); rt++) {
            SMap.put(S.charAt(rt), SMap.getOrDefault(S.charAt(rt), 0) + 1);

            if (SMap.equals(TMap)) answer++; // Map.equals()를 사용하면 쉽게 비교할 수 있다.

            if (SMap.get(S.charAt(lt)) > 1) {
                SMap.put(S.charAt(lt), SMap.get(S.charAt(lt)) - 1);
            } else {
                SMap.remove(S.charAt(lt));
            }
            lt++;
        }

        return answer;
    }

    private static String compressChars(char[] chars) {
        StringBuilder result = new StringBuilder();

        LinkedHashMap<Character, Integer> map = new LinkedHashMap<>();
        for (char c : chars) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }
        for (Map.Entry<Character, Integer> entry : map.entrySet()) {
            result.append(entry.getKey() + entry.getValue());
        }

        return result.toString();
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String S = in.next();
        String T = in.next();
        System.out.println(solution(S, T));
        return;
    }
}

/**
 * map.equals()를 사용하면 map의 키와 값들이 같은지 확인할 수 있다.
 */
