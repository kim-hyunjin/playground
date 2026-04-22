package com.github.kimhyunjin.inflearn.sortandsearch;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class MischiefMaker {

    public List<Integer> solution(int[] students) {
         ArrayList<Integer> answer = new ArrayList<>();
         int[] correctlySortedStudents = students.clone();
         Arrays.sort(correctlySortedStudents);
         
         for (int i = 0; i < students.length; i++) {
             if (students[i] != correctlySortedStudents[i]) answer.add(i+1);
         }

         return answer;
     }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int N = in.nextInt();
        int[] students = new int[N];
        for (int i = 0; i < N; i++) {
            students[i] = in.nextInt();
        }

        MischiefMaker mischiefMaker = new MischiefMaker();
        List<Integer> result = mischiefMaker.solution(students);
        for (int i : result) {
            System.out.print(i + " ");
        }

        return ;
    }
}
