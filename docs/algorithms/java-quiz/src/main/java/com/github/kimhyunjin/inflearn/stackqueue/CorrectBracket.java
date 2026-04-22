package com.github.kimhyunjin.inflearn.stackqueue;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.Stack;

public class CorrectBracket {

    private static boolean isRightBracket(String brackets) {
        List<Character> left = new ArrayList<>();
        List<Character> right = new ArrayList<>();
        for (char c : brackets.toCharArray()) {
            if (c == '(') left.add(c);
            if (c == ')') {
                right.add(c);
                if (left.size() < right.size()) return false;
            }
        }

        return left.size() == right.size();
    }

    // 스택 사용하기
    public static boolean isRightBracket2(String brackets) {
        Stack<Character> stack = new Stack<>();
        for (char c : brackets.toCharArray()) {
            if (c == '(') {
                stack.push(c);
            } else if (c == ')') {
                if (stack.isEmpty()) {
                    return false;
                } else {
                    stack.pop();
                }
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        String brackets = in.next();
        if (isRightBracket2(brackets)) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }
        return ;
    }

}
