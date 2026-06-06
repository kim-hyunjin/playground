package com.github.kimhyunjin.inflearn.bfs;

import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class FindCow {

    int[] check; // 중복 순회를 피하기 위해 체크 배열 필요.
    int[] move = {1, -1, 5}; // 움직일 수 있는 case 는 정해져 있기 때문에 미리 배열로 만들어놓으면 편함.
    Queue<Integer> Q = new LinkedList<>();

    public int solution(int myPos, int cowPos) {
        check = new int[10001]; // 최대 좌표 10000
        Q.add(myPos);
        check[myPos] = 1;

        int L = 0;
        while(!Q.isEmpty()) {
            int len = Q.size(); // 큐의 엘리먼트 개수가 계속 바뀌기 때문에 한 레벨만큼만 순회하려면 for 문 진입전에 미리 길이를 구해놔야함.
            for (int i = 0; i < len; i++) {
                int curPos = Q.poll();

                for (int k : move) {
                    int nextPos = curPos + k;
                    if (nextPos == cowPos) return L + 1;

                    // 범위 내 좌표에 있는지, 이전에 순회한 적이 있는지 체크(가장 짧은 이동거리를 찾는 문제이므로 이전에 이미 순회했다면 살펴볼 필요가 없다.)
                    if (nextPos >= 1 && nextPos <= 10000 && check[nextPos] == 0) {
                        check[nextPos] = 1;
                        Q.offer(nextPos);
                    }
                }

            }
            L++;
        }
        return -1;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int myPos = in.nextInt();
        int cowPos = in.nextInt();

        FindCow findCow = new FindCow();
        System.out.println(findCow.solution(myPos, cowPos));
        return ;
    }
}
