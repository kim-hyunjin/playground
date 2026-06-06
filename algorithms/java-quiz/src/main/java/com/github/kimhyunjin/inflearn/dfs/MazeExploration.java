package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

public class MazeExploration {

    int[] dy = {-1, 0, 1, 0};
    int[] dx = {0, 1, 0, -1};
    int[] goal;
    int[][] maze;
    int answer;
    int[][] check;

    MazeExploration(int[][] maze, int[] start, int[] goal) {
        this.goal = goal;
        this.maze = maze;
        this.check = new int[maze.length][maze.length];
        this.check[start[1]][start[0]] = 1;
    }

    public void DFS(int x, int y) {
        if(x == goal[0] && y == goal[1]) {
            answer++;
        } else {
            for (int i = 0; i < dy.length; i++) {
                int nextX = x + dx[i];
                int nextY = y + dy[i];

                if (nextX < 0 || nextY < 0 || nextX >= maze.length || nextY >= maze.length) continue;

                if (maze[nextY][nextX] != 1 && check[nextY][nextX] == 0) {
                    check[nextY][nextX] = 1;
                    DFS(nextX, nextY);
                    check[nextY][nextX] = 0;
                }
            }
        }
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
        MazeExploration mazeExploration = new MazeExploration(maze, new int[]{0,0}, new int[]{6, 6});
        mazeExploration.DFS(0, 0);
        System.out.println(mazeExploration.answer);
        return ;
    }
}
