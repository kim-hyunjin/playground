package com.github.kimhyunjin.inflearn.stackqueue;

import java.util.Scanner;
import java.util.Stack;

public class Postfix {

    private static int solution(String exp) {
        Stack<Integer> stack = new Stack<>();
        for (char c : exp.toCharArray()) {
            if (Character.isDigit(c)) {
                stack.push(Character.getNumericValue(c));
            } else {
                int a = stack.pop();
                int b = stack.pop();

                if (c == '+') {
                    stack.push(b + a);
                } else if (c == '-') {
                    stack.push(b - a);
                } else if (c == '*') {
                    stack.push(b * a);
                } else {
                    stack.push(b / a);
                }
            }
        }
        return stack.pop();
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        String exp = in.next();
        System.out.println(solution(exp));
        return ;
    }
}
