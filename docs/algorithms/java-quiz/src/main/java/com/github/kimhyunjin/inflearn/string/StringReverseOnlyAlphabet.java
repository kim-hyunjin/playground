package com.github.kimhyunjin.inflearn.string;

import java.util.Scanner;

public class StringReverseOnlyAlphabet {
    public boolean isAlphabet(char c) {
        return (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
    }
    public String solution(String str) {
        char[] chars = str.toCharArray();
        int lt = 0;
        int rt = chars.length - 1;
        while (lt < rt) {
            if (isAlphabet(chars[lt]) && isAlphabet(chars[rt])) {
                char tmp = chars[lt];
                chars[lt] = chars[rt];
                chars[rt] = tmp;
            }
            lt++;
            rt--;
        }
        return String.valueOf(chars);
    }
    public static void main(String[] args){
        StringReverseOnlyAlphabet stringReverseOnlyAlphabet = new StringReverseOnlyAlphabet();
        Scanner in=new Scanner(System.in);
        String input = in.next();
        System.out.println(stringReverseOnlyAlphabet.solution(input));
        return ;
    }
}
