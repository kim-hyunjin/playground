package com.github.kimhyunjin.inflearn.string;

import java.util.Locale;
import java.util.Scanner;

public class Palindrome {
    public String solution(String input) {
        String reversed = new StringBuilder(input).reverse().toString();
        if (input.equalsIgnoreCase(reversed)) {
            return "YES";
        } else {
            return "NO";
        }
    }

    public String solution2(String input) {
        input = input.toUpperCase();
        for (int i = 0; i < input.length()/2; i++) {
            if (input.charAt(i) != input.charAt(input.length() - 1 - i)) {
                return "NO";
            }
        }
        return "YES";
    }

    public static void main(String[] args) {
        Palindrome palindrome = new Palindrome();
        Scanner in = new Scanner(System.in);
        String input1 = in.next();
        System.out.println(palindrome.solution(input1));
        return;
    }
}
