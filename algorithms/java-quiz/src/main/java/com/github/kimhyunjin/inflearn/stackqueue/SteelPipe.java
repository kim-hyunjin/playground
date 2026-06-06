package com.github.kimhyunjin.inflearn.stackqueue;

import java.util.Scanner;
import java.util.Stack;

public class SteelPipe {

    private static int solution(String arrange) {
        int answer = 0;
        Stack<Character> stack = new Stack<>();
        int steelCnt = 0;
        for (char c : arrange.toCharArray()) {
            if (c == '(') {
                steelCnt++;
            } else {
                steelCnt--;
                if (!stack.isEmpty() && stack.peek() == '(') { // 레이저
                    answer += steelCnt;
                } else if (!stack.isEmpty() && stack.peek() == ')'){ // 막대 끝
                    answer++;
                }
            }
            stack.push(c);
        }
        return answer;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        String arrange = in.next();
        System.out.println(solution(arrange));
        return ;
    }

}
