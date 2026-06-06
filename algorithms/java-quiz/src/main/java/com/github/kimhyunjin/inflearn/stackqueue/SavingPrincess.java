package com.github.kimhyunjin.inflearn.stackqueue;

import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class SavingPrincess {

    private static int solution(int numberOfPrince, int K) {
        LinkedList<Integer> list = new LinkedList<>();
        for (int i = 1; i <= numberOfPrince; i++) {
            list.add(i);
        }
        int i = 0;
        while (list.size() > 1) {
            i += (K - 1);
            i = i % list.size();
            list.remove(i);
        }
        return list.getFirst();
    }

    // queue를 사용한 예
    public static int solution2(int numberOfPrince, int K) {
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 1; i <= numberOfPrince; i++) {
            queue.add(i);
        }
        int answer = 0;
        while (!queue.isEmpty()) {
            for (int i = 1; i < K; i++) {
                queue.add(queue.poll()); // K번째가 아닌 왕자들은 맨 뒤로 다시 보낸다.
            }
            queue.poll(); // K번째 왕자는 빠진다.
            if (queue.size() == 1) answer = queue.poll();
        }
        return answer;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int numberOfPrince = in.nextInt();
        int K = in.nextInt();
        System.out.println(solution(numberOfPrince, K));
        return ;
    }
}
