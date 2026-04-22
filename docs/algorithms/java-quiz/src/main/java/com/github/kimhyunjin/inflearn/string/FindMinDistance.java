package com.github.kimhyunjin.inflearn.string;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class FindMinDistance {
    public int getMinDistance(int position, List<Integer> charIndexes) {
        int min = Integer.MAX_VALUE;
        for (int charIndex : charIndexes) {
            if (Math.abs(position - charIndex) < min) {
                min = Math.abs(position - charIndex);
            }
        }
        return min;
    }
    public int[] solution(String str, char c) {
        int[] distance = new int[str.length()];
        List<Integer> charIndexes = new ArrayList<>();
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) == c) {
                charIndexes.add(i);
            }
        }
        for (int i = 0; i < str.length(); i++) {
            distance[i] = getMinDistance(i, charIndexes);
        }
        return distance;
    }

    public int[] solution2(String str, char c) {
        int[] answer = new int[str.length()];
        int p = 101; // 문자열의 길이는 100을 넘지 않으므로
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) == c) {
                p = 0;
            } else {
                p++;
            }
            answer[i] = p;
        }
        p = 101;
        for (int i = str.length() - 1; i >=0; i--) {
            if (str.charAt(i) == c) {
                p = 0;
            } else {
                p++;
                answer[i] = Math.min(answer[i], p);
            }
        }
        return answer;
    }
    public static void main(String[] args){
        FindMinDistance findMinDistance = new FindMinDistance();
        Scanner in=new Scanner(System.in);
        String str = in.next();
        String character = in.next();
        for (int i : findMinDistance.solution2(str, character.charAt(0))) {
            System.out.print(i + " ");
        }
        return ;
    }
}
