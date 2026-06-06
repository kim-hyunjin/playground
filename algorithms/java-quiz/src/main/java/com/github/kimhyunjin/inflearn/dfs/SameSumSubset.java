package com.github.kimhyunjin.inflearn.dfs;

import java.util.ArrayList;
import java.util.Scanner;

public class SameSumSubset {

    static ArrayList<Integer> numbers;
    static int[] check;
    static boolean answer = false;

    public void solution(int index) {
        if (answer) return;
        if(index == numbers.size()) {
            int a = 0;
            int b = 0;
            for (int n : numbers) {
                if (check[n] == 1) a += n;
                else b += n;
            }
            if (a == b) answer = true;
        } else {
            check[numbers.get(index)] = 1;
            solution(index+1);

            check[numbers.get(index)] = 0;
            solution(index+1);
        }
    }

    public static void main(String[] args){
        Scanner in=new Scanner(System.in);
        int N = in.nextInt();
        numbers = new ArrayList<>();
        int max = 0;
        for (int i = 0; i < N; i++) {
            int num = in.nextInt();
            numbers.add(num);
            max = Math.max(max, num);
        }
        check = new int[max+1];
        SameSumSubset sameSumSubset = new SameSumSubset();
        sameSumSubset.solution(0);
        if (answer) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }

        return ;
    }
}
