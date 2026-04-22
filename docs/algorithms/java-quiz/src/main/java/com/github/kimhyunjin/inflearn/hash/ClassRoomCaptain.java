package com.github.kimhyunjin.inflearn.hash;

import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class ClassRoomCaptain {

    private static char solution(char[] votes) {
        Map<Character, Integer> candidate = new HashMap<>();
        for (char vote : votes) {
            candidate.put(vote, candidate.getOrDefault(vote, 0) + 1);
        }
        return candidate.entrySet().stream().max(Comparator.comparingInt(Map.Entry::getValue)).get().getKey();
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int cnt = in.nextInt();
        String voteString = in.next();
        char[] votes = new char[cnt];
        for (int i = 0; i < cnt; i++) {
            votes[i] = voteString.charAt(i);
        }
        System.out.println(solution(votes));
        return ;
    }
}
