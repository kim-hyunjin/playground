package com.github.kimhyunjin.inflearn.stackqueue;

import java.util.*;

public class EraseInBracket {

    private static String solution(String s) {
        Stack<Character> stack = new Stack<>();
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '(') {
                stack.push(c);
            } else if (c == ')') {
                stack.pop();
            } else {
                if (stack.isEmpty()) sb.append(c); // 남아있는 열린 괄호가 없다면 괄호 밖에 있다는 뜻
            }
        }
        return sb.toString();
    }


    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        String input1 = in.next();
        System.out.println(solution(input1));
        return ;
    }
}
