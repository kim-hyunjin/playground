package com.github.kimhyunjin.inflearn.array;

import java.util.Scanner;

/**
 given
 5
 5 3 7 2 3
 3 7 1 6 1
 7 2 5 3 4
 4 3 6 4 1
 8 7 3 5 2

 expect
 10
 */
public class FindMountain {

    private int solution(int[][] land) {
        int peaks = 0;
        final int size = land.length - 1;

        for (int y = 1; y < size; y++) {
            for (int x = 1; x < size; x++) {
                final int candidate = land[y][x];
                final int up = land[y - 1][x];
                final int right = land[y][x + 1];
                final int down = land[y + 1][x];
                final int left = land[y][x - 1];
                if (candidate > up
                        && candidate > right
                        && candidate > down
                        && candidate > left) {
                    peaks++;
                }
            }
        }

        return peaks;
    }

    // 미리 x와 y좌표 상하좌우 세트를 배열로 만들어놓고 쓰면 좋다.
    int[] dy = {-1, 0, 1, 0};
    int[] dx = {0, 1, 0, -1};
    private int solution2(int[][] arr) {
        int answer = 0;

        int n = arr.length - 1;
        for (int y = 1; y < n; y++) {
            for (int x = 1; x < n; x++) {
                boolean flag = true;
                // 상하좌우 비교
                for (int k = 0; k < 4; k++) {
                    int ny = y + dx[k];
                    int nx = x + dy[k];
                    if(arr[ny][nx] >= arr[y][x]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    answer++;
                }
            }
        }
        return answer;
    }

    public static void main(String[] args) {
        FindMountain findMountain = new FindMountain();
        Scanner in = new Scanner(System.in);
        final int input1 = in.nextInt();
        final int size = input1 + 2;
        // 가장 자리는 모두 0으로 설정
        final int[][] land = new int[size][size];
        for (int y = 1; y < size - 1; y++) {
            for (int x = 1; x < size - 1; x++) {
                land[y][x] = in.nextInt();
            }
        }
        System.out.println(findMountain.solution2(land));
        return;
    }
}
