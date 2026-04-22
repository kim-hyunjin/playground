package com.github.kimhyunjin.inflearn.bfs;

import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class MazeShortestWay {

    int[][] check;
    int[] dy = {-1, 0, 1, 0};
    int[] dx = {0, 1, 0, -1};
    int[] goal;
    int[][] maze;
    Queue<int[]> Q = new LinkedList<>();

    MazeShortestWay(int[][] maze, int[] goal) {
        this.goal = goal;
        this.maze = maze;
        this.check = new int[maze.length][maze.length];
    }

    public int solution(int x, int y) {
        Q.add(new int[]{x, y});
        check[y][x] = 1;

        int L = 0;
        while(!Q.isEmpty()) {
            int len = Q.size();
            for (int i = 0; i < len; i++) {
                int[] curPos = Q.poll();

                for (int j = 0; j < dy.length; j++) {
                    int nextX = curPos[0] + dx[j];
                    int nextY = curPos[1] + dy[j];

                    if (nextX == goal[0] && nextY == goal[1]) return L + 1;

                    if (nextX < 0 || nextY < 0 || nextX >= maze.length || nextY >= maze.length) continue;

                    if (maze[nextY][nextX] != 1 && check[nextY][nextX] == 0) {
                        check[nextY][nextX] = 1;
                        Q.offer(new int[]{nextX, nextY});
                    }
                }
            }
            L++;
        }
        return -1;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int mazeSize = 7;
        int[][] maze = new int[mazeSize][mazeSize];
        for (int i = 0; i < mazeSize; i++) {
            for (int j = 0; j < mazeSize; j++) {
                maze[i][j] = in.nextInt();
            }
        }

        MazeShortestWay mazeShortestWay = new MazeShortestWay(maze, new int[]{6, 6});
        System.out.println(mazeShortestWay.solution(0, 0));
        return ;
    }
}
