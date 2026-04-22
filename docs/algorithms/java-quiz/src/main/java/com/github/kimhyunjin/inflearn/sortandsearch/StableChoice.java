package com.github.kimhyunjin.inflearn.sortandsearch;

import java.util.Arrays;
import java.util.Scanner;

/**
 * 결정함수
 */
public class StableChoice {

    public int solution(int[] stables, int numOfHorse) {
        int answer = 0;
        int lt = 1;
        int rt = Arrays.stream(stables).max().getAsInt();
        while (lt <= rt) {
            int mid = (lt + rt) / 2;
            if (isCanAllHorsePutInStable(stables, numOfHorse, mid)) {
                answer = mid;
                lt = mid + 1;
            } else {
                rt = mid - 1;
            }
        }
        return answer;
    }

    // 유효함수
    private boolean isCanAllHorsePutInStable(int[] stables, int numOfHouse, int minDistance) {
        int lastStable = stables[0]; // 가장 앞에 있는 마굿간에 말을 넣어야 말 배치 간격을 가장 넓힐 수 있다.
        int houseInStable = 1;
        for (int i = 1; i < stables.length; i++) {
            if (stables[i] - lastStable >= minDistance) {
                lastStable = stables[i];
                houseInStable++;
            }
        }
        return houseInStable >= numOfHouse;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int numOfStable = in.nextInt();
        int numOfHorse = in.nextInt();
        int[] stableLocations = new int[numOfStable];
        for (int i = 0; i < numOfStable; i++) {
            stableLocations[i] = in.nextInt();
        }
        StableChoice stableChoice = new StableChoice();
        System.out.println(stableChoice.solution(stableLocations, numOfHorse));
        return ;
    }

}
