package com.github.kimhyunjin.inflearn.slidingwindow;

import java.util.Scanner;

public class MaxLengthSubsequence {

    /*
        input
        20 2
        1 0 1 1 1 1 1 0 1 0 1 1 1 1 1 0 1 1 0 1

        output
        13
     */
    private static int solution(int[] arr, int life) {
        int len = 0, maxLen = 0;
        int f = 0, b = 0;
        while (b < arr.length) {
            if (arr[b] == 1) {
                len++; b++;
            } else {
                if (life > 0) {
                    len++; b++;
                    life--;
                } else {
                    if (arr[f++] == 0) {
                        len--;
                        life++;
                    } else {
                        len--;
                    }
                }
            }
            maxLen = Math.max(len, maxLen);
        }

        return maxLen;
    }

    private static int solution2(int[] arr, int life) {
        int answer = 0, usedLife = 0, lt = 0;
        for (int rt = 0; rt < arr.length; rt++) {
            if(arr[rt] == 0) usedLife ++;
            // 0 을 1로 바꾸는 데 필요한 life가 없다면 lt를 늘려가며 life 회복하기
            while (usedLife > life) {
                if(arr[lt] == 0) usedLife--;
                lt++;
            }
            // 현재 윈도우의 크기 : rt - lt + 1
            answer = Math.max(answer, rt - lt + 1);
        }
        return answer;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int len = in.nextInt();
        int life = in.nextInt();
        int[] arr = new int[len];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = in.nextInt();
        }
        System.out.println(solution2(arr, life));
        return ;
    }
}
