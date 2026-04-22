package com.github.kimhyunjin.inflearn.hash;

import java.util.*;

public class Anagram {

    public static boolean solution(String input1, String input2) {
        char[] chars1 = input1.toCharArray();
        char[] chars2 = input2.toCharArray();
        Arrays.sort(chars1);
        Arrays.sort(chars2);

        return compressChars(chars1).equals(compressChars(chars2));
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

    // 위와 같이 정렬 후 문자열로 만들어 비교할 필요 없다.
    // 캐릭터 배열 하나는 HashMap에 집어넣고, 다른 캐릭터 배열은 순회하면서 HashMap에서 빼면 된다.
    public static boolean solution2(String input1, String input2) {
        HashMap<Character, Integer> map = new HashMap<>();
        for (char c : input1.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }
        for (char c : input2.toCharArray()) {
            if (!map.containsKey(c) || map.get(c) == 0) {
                return false;
            } else {
                map.put(c, map.get(c) - 1);
            }
        }
        return true;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        String input1 = in.next();
        String input2 = in.next();
        boolean result = solution(input1, input2);
        if (result) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }
        return ;
    }
}
