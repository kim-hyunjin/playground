package com.github.kimhyunjin.inflearn.stackqueue;

import java.util.*;

public class PuppetDraw {

    private static int solution(List<Queue<Integer>> board, int[] moves) {
        int answer = 0;
        Stack<Integer> stack = new Stack<>();
        for (int m : moves) {
            Queue<Integer> col = board.get(m - 1);
            if (col.isEmpty()) continue; // 인형이 없는 곳이라면 아무런 일도 일어나지 않는다.

            int puppet = col.poll();
            if (!stack.isEmpty() && stack.peek() == puppet) {
                stack.pop();
                answer += 2;
            } else {
                stack.push(puppet);
            }
        }

        return answer;
    }

    // 큐 대신 2차원 배열 그대로 사용한 풀이
    public static int solution2(int[][] board, int[] moves) {
        int answer = 0;

        Stack<Integer> stack = new Stack<>();
        for (int pos : moves) {
            // 크레인을 1씩 내린다.
            for (int i = 0; i < board.length; i++) {
                if(board[i][pos-1] != 0) {
                    // 인형 뽑음
                    int temp = board[i][pos-1];
                    board[i][pos-1] = 0;
                    if(!stack.isEmpty() && temp == stack.peek()) {
                        answer += 2;
                        stack.pop();
                    } else {
                        stack.push(temp);
                    }
                    break;
                }
            }
        }

        return answer;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);

        int N = in.nextInt();
        List<Queue<Integer>> board = new ArrayList<>();
        for (int i = 0; i < N; i++) {
            board.add(new LinkedList<>());
        }
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                int puppet = in.nextInt();
                if (puppet != 0) board.get(j).add(puppet); // 0은 인형이 비어있다는 뜻이므로 인형이 있을 때만 큐에 넣음. 먼저 뽑혀야 할 인형이 큐에 먼저 들어간다.
            }
        }

        int M = in.nextInt();
        int[] moves = new int[M];
        for (int i = 0; i < M; i++) {
            moves[i] = in.nextInt();
        }

        System.out.println(solution(board, moves));
        return ;
    }
}

/**
 * 회고
 * 처음에는 습관처럼 입력값을 int[][] 배열로 받아서 이를 List<Queue>로 바꾸려고 했다.
 * 애초에 입력값을 받을 때 내가 필요한 형태로 받는 것이 앞으로도 문제풀이에 유용할 것 같다.
 *
 * 처음에는 문제에 나온 예제 그림을 보고 인형들을 무작정 Stack에 집어넣으려고 했다.
 * 하지만 입력값을 받는 형태를 보니 Queue를 사용하는 것이 올바른 접근이었다.
 *
 * 앞으로 stack과 queue 중 어떤 자료구조를 선택해야할지 조금만 더 신중할 필요가 있겠다.
 */
