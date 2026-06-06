package com.github.kimhyunjin.inflearn.string;

import java.util.Scanner;

public class LongestWordInSentence {
    public String solution(String sentence) {
        String longest = "";
        String[] words = sentence.split("\\s");
        for (String word : words) {
            if (word.length() > longest.length()) {
                longest = word;
            }
        }
        return longest;
    }
    public String solution2(String str) {
        String answer = "";
        int max = Integer.MIN_VALUE;
        String[] words = str.split(" ");
        for (String x : words) {
            int len = x.length();
            if (len > max) {
                max = len;
                answer = x;
            }
        }
        return answer;
    }
    public String solution3(String str) {
        String answer = "";
        int max = Integer.MIN_VALUE, pos;
        while((pos = str.indexOf(" ")) != -1) {
            String tmp = str.substring(0, pos);
            int len = tmp.length();
            if (len > max) {
                max = len;
                answer = tmp;
            }
            str = str.substring(pos+1);
        }
        if (str.length() > max) answer = str;
        return answer;
    }
    public static void main(String[] args){
        LongestWordInSentence longestWordInSentence = new LongestWordInSentence();
        Scanner in=new Scanner(System.in);
        String input = in.nextLine();
        System.out.println(longestWordInSentence.solution(input));
        return ;
    }
}
