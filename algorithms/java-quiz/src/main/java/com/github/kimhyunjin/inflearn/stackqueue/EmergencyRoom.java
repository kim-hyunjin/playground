package com.github.kimhyunjin.inflearn.stackqueue;

import java.util.*;

public class EmergencyRoom {

    private static int solution(int[] patient, int target) {
        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
        for (int p : patient) {
            heap.add(p);
        }
        int answer = 0;
        int i = 0;
        while(true) {
            if (patient[i] == heap.peek()) {
                answer++;
                if (i == target) break;
                heap.poll();
                patient[i] = 0;
            }
            i++;
            if (i == patient.length) i = i % patient.length;
        }
        return answer;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int len = in.nextInt();
        int targetPatient = in.nextInt();
        int[] patients = new int[len];
        for (int i = 0; i < len; i++) {
            patients[i] = in.nextInt();
        }

        System.out.println(solution(patients, targetPatient));
        return ;
    }

}
