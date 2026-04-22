package com.github.kimhyunjin.inflearn.stackqueue;

import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Curriculum {
    private static boolean solution(String essentialClass, String plan) {
        Queue<Character> essentialsQueue = new LinkedList<>();
        for (char c : essentialClass.toCharArray()) {
            essentialsQueue.add(c);
        }
        for (char c : plan.toCharArray()) {
            if (essentialClass.contains(Character.toString(c))) {
                if (!essentialsQueue.isEmpty() && essentialsQueue.peek() == c) {
                    essentialsQueue.poll();
                } else if (!essentialsQueue.isEmpty() && essentialsQueue.peek() != c){ // 선수과목이 남아있음
                    return false;
                }
            }
        }
        return essentialsQueue.isEmpty(); // 필수과목은 모두 수강해야한다.
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        String essentialClass = in.next();
        String plan = in.next();
        if (solution(essentialClass, plan)) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }
        return ;
    }
}
