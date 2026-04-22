package com.github.kimhyunjin.inflearn.string;

import java.util.Scanner;

public class Palindrome2 {
    public String toAlphabet(String input) {
        String onlyAlphabet = "";
        for (char c : input.toCharArray()) {
            if (Character.isAlphabetic(c)) {
                onlyAlphabet += c;
            }
        }
        return onlyAlphabet;
    }
    public String solution(String input) {
        input = toAlphabet(input);
        String reversed = new StringBuilder(input).reverse().toString();
        if (input.equalsIgnoreCase(reversed)) {
            return "YES";
        } else {
            return "NO";
        }
    }

    /** replaceAll, 정규식 사용 */
    public String solution2(String input) {
        input = input.toUpperCase().replaceAll("[^A-Z]", "");
        String reversed = new StringBuilder(input).reverse().toString();
        if (input.equals(reversed)) {
            return "YES";
        }
        return "NO";
    }

    public static void main(String[] args) {
        Palindrome2 palindrome = new Palindrome2();
        Scanner in = new Scanner(System.in);
        String input1 = in.nextLine();
        System.out.println(palindrome.solution2(input1));
        return;
    }
}
