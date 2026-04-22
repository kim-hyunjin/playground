package com.github.kimhyunjin.inflearn.array;

import java.util.Scanner;

public class MatrixMaxSum {

    private int solution(int[][] matrix) {
        int[] rowSum = new int[matrix.length];
        int[] colSum = new int[matrix.length];
        int mainDiagonal = 0;
        int reverseDiagonal = 0;

        for (int y = 0; y < matrix.length; y++) {
            for (int x = 0; x < matrix.length; x++) {
                rowSum[y] += matrix[y][x];
                colSum[x] += matrix[y][x];
                if (y == x) {
                    mainDiagonal += matrix[y][x];
                }
            }
        }
        for (int x = matrix.length - 1, y = 0; x >= 0; x--) {
            reverseDiagonal += matrix[y][x];
            y++;
        }

        int max = 0;
        for (int n : rowSum) {
            if (n > max) max = n;
        }
        for (int n : colSum) {
            if (n > max) max = n;
        }
        if (mainDiagonal > max) max = mainDiagonal;
        if (reverseDiagonal > max) max = reverseDiagonal;
        return max;
    }

    // 따로 행과 열의 합을 담는 배열을 준비할 필요없이 변수 두 개로 합계 구하면 되고,
    // 추가로 배열을 순회하며 max 값을 찾을 필요도 없었다.
    private int solution2(int[][] matrix) {
        int answer = Integer.MIN_VALUE;

        int row, col;
        for (int i = 0; i < matrix.length; i++) {
            row = 0; col = 0;
            for (int j = 0; j < matrix.length; j++) {
                row += matrix[i][j]; // 열을 i로 고정
                col += matrix[j][i]; // 행을 i로 고정
            }
            answer = Math.max(answer, row); // 표준 라이브러리의 유용한 함수를 기억해뒀다가 다음에 잘 활용하자
            answer = Math.max(answer, col);
        }

        int main = 0, reverse = 0;
        for (int i = 0; i < matrix.length; i++) {
            main += matrix[i][i];
            reverse += matrix[i][matrix.length - 1 - i]; // 행이 1 감소할 때 열은 1증가하므로
        }
        answer = Math.max(answer, main);
        answer = Math.max(answer, reverse);

        return answer;
    }

    public static void main(String[] args){
        MatrixMaxSum matrixMaxSum = new MatrixMaxSum();
        Scanner in=new Scanner(System.in);
        int size = in.nextInt();
        int[][] matrix = new int[size][size];
        for (int y = 0; y < matrix.length; y++) {
            for (int x = 0; x < matrix.length; x++) {
                matrix[y][x] = in.nextInt();
            }
        }

        System.out.println(matrixMaxSum.solution2(matrix));
        return ;
    }
}
