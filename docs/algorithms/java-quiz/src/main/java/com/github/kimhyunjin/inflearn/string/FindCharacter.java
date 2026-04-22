package com.github.kimhyunjin.inflearn.string;

import java.util.Scanner;

public class FindCharacter {
    public int solution(String str, char c) {
        int answer = 0;
        String lowerStr = str.toLowerCase();
        char lowerC = Character.toLowerCase(c);
        for (int i = 0; i < lowerStr.length(); i++) {
            if (lowerStr.charAt(i) == lowerC) answer++;
        }
        return answer;
    }
    public int solution2(String str, char c) {
        int answer = 0;
        String lowerStr = str.toLowerCase();
        char t = Character.toLowerCase(c);
        for (char x : lowerStr.toCharArray()) {
            if (x == t) answer++;
        }
        return answer;
    }
    public static void main(String[] args) {
        FindCharacter findCharacter = new FindCharacter();
        Scanner in = new Scanner(System.in);
        String str = in.next();
        char c = in.next().charAt(0);
        System.out.println(findCharacter.solution(str, c));
        return;
    }
}
