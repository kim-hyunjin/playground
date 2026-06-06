package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

public class DoggiesOnTruck {
    static int[] doggies;
    static int loadableWeight;
    public int solution(int L, int sum) {
        if (sum > loadableWeight) return sum - doggies[L-1];
        if (L == doggies.length) return sum;
        else {
            return Math.max(solution(L+1, sum+doggies[L]), solution(L+1, sum));
        }
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        loadableWeight = in.nextInt();
        int numOfDoggies = in.nextInt();
        doggies = new int[numOfDoggies];
        for (int i=0; i<doggies.length; i++) {
            doggies[i] = in.nextInt();
        }
        DoggiesOnTruck doggiesOnTruck = new DoggiesOnTruck();
        System.out.println(doggiesOnTruck.solution(0, 0));

        return ;
    }
}
