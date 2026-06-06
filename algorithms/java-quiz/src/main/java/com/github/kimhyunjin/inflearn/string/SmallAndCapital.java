package com.github.kimhyunjin.inflearn.string;

import java.util.Scanner;

public class SmallAndCapital {
    public String solution(String str) {
        StringBuilder sb = new StringBuilder();
        for (char x : str.toCharArray()) {
            if(Character.isUpperCase(x)) {
                sb.append(Character.toLowerCase(x));
            } else {
                sb.append(Character.toUpperCase(x));
            }
        }
        return sb.toString();
    }
    public String solution2(String str) {
        // 대문자 65 ~ 90
        // 소문자 97 ~ 122
        // a - A = 32
        StringBuilder answer = new StringBuilder();
        for (char x : str.toCharArray()) {
            if (x >= 65 && x <= 90) {
                answer.append((char) (x + 32));
            } else {
                answer.append((char) (x - 32));
            }
        }
        return answer.toString();
    }

    public static void main(String[] args){
        SmallAndCapital smallAndCapital = new SmallAndCapital();
        Scanner in=new Scanner(System.in);
        String input = in.next();
        System.out.println(smallAndCapital.solution(input));
        return ;
    }
}
