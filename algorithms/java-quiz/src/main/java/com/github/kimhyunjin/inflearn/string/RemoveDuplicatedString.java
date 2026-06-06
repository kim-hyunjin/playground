package com.github.kimhyunjin.inflearn.string;

import java.util.LinkedHashSet;
import java.util.Scanner;
import java.util.Set;

public class RemoveDuplicatedString {
    public String solution(String input) {
        Set<Character> characterSet = new LinkedHashSet<>();
        for (char c : input.toCharArray()) {
            characterSet.add(c);
        }
        StringBuilder sb = new StringBuilder();
        for (char c : characterSet) {
            sb.append(c);
        }
        return sb.toString();
    }
    public String solution2(String input) {
        String answer = "";
        for (int i = 0; i < input.length(); i++) {
            if (input.indexOf(input.charAt(i)) == i) answer += input.charAt(i);
        }
        return answer;
    }
    public static void main(String[] args){
        RemoveDuplicatedString removeDuplicatedString = new RemoveDuplicatedString();
        Scanner in=new Scanner(System.in);
        String input1 = in.next();
        System.out.println(removeDuplicatedString.solution2(input1));
        return ;
    }
}
