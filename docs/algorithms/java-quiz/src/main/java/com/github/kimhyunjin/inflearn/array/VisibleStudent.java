package com.github.kimhyunjin.inflearn.array;

import java.util.Scanner;

public class VisibleStudent {

    public int solution(int[] students) {
        int answer = 1;
        int tallest = students[0];
        for (int i = 1; i < students.length; i++) {
            if (students[i] > tallest) {
                tallest = students[i];
                answer++;
            }
        }

        return answer;
    }

    public static void main(String[] args){
        VisibleStudent visibleStudent = new VisibleStudent();
        Scanner in=new Scanner(System.in);
        int input1 = Integer.parseInt(in.nextLine());
        int[] students = new int[input1];
        for (int i = 0; i < input1; i++) {
            students[i] = in.nextInt();
        }

        System.out.println(visibleStudent.solution(students));
        return ;
    }

}
