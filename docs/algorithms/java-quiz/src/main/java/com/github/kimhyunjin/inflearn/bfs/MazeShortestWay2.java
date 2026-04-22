package com.github.kimhyunjin.inflearn.bfs;

import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class MazeShortestWay2 {

    static class Point {
        int x;
        int y;

        public Point(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }

    int[] dy = {-1, 0, 1, 0};
    int[] dx = {0, 1, 0, -1};
    int[][] maze;
    int[][] dis;
    Queue<Point> Q = new LinkedList<>();

    MazeShortestWay2(int[][] maze) {
        this.maze = maze;
        this.dis = new int[maze.length][maze.length];
    }

    public void solution(int x, int y) {
        Q.add(new Point(x, y));
        maze[y][x] = 1;

        while(!Q.isEmpty()) {
            Point cur = Q.poll();

            for (int i = 0; i < dy.length; i++) {
                int nx = cur.x + dx[i];
                int ny = cur.y + dy[i];

                if (nx >= 0 && ny >= 0 && nx < maze.length && ny < maze.length && maze[ny][nx] == 0) {
                    maze[ny][nx] = 1;
                    Q.offer(new Point(nx, ny));
                    dis[ny][nx] = dis[cur.y][cur.x] + 1;
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

        MazeShortestWay2 mazeShortestWay = new MazeShortestWay2(maze);
        mazeShortestWay.solution(0, 0);
        if (mazeShortestWay.dis[6][6] == 0) System.out.println(-1);
        else System.out.println(mazeShortestWay.dis[6][6]);
        return ;
    }
}
