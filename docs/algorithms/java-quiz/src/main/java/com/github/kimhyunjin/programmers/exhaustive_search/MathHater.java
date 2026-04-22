package com.github.kimhyunjin.programmers.exhaustive_search;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

/**
 * 수포자는 수학을 포기한 사람의 준말입니다. 수포자 삼인방은 모의고사에 수학 문제를 전부 찍으려 합니다. 수포자는 1번 문제부터 마지막 문제까지 다음과 같이 찍습니다.
 *
 * 1번 수포자가 찍는 방식: 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, ...
 * 2번 수포자가 찍는 방식: 2, 1, 2, 3, 2, 4, 2, 5, 2, 1, 2, 3, 2, 4, 2, 5, ...
 * 3번 수포자가 찍는 방식: 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, ...
 *
 * 1번 문제부터 마지막 문제까지의 정답이 순서대로 들은 배열 answers가 주어졌을 때, 가장 많은 문제를 맞힌 사람이 누구인지 배열에 담아 return 하도록 solution 함수를 작성해주세요.
 *
 * 제한 조건
 * 시험은 최대 10,000 문제로 구성되어있습니다.
 * 문제의 정답은 1, 2, 3, 4, 5중 하나입니다.
 * 가장 높은 점수를 받은 사람이 여럿일 경우, return하는 값을 오름차순 정렬해주세요.
 */
public class MathHater {

    static class Student {
        int no;
        int[] pattern;
        int score = 0;

        Student(int no, int[] pattern) {
            this.no = no;
            this.pattern = pattern;
        }

        int getAnswer(int index) {
            return pattern[index % pattern.length];
        }

        void scoreUp() {
            score++;
        }

        int getNo() {
            return no;
        }

        @Override
        public String toString() {
            return "Student{" +
                    "no=" + no +
                    ", pattern=" + Arrays.toString(pattern) +
                    ", score=" + score +
                    '}';
        }
    }

    public static int[] solution(int[] answers) {
        Student student1 = new Student(1, new int[]{1, 2, 3, 4, 5});
        Student student2 = new Student(2, new int[]{2, 1, 2, 3, 2, 4, 2, 5});
        Student student3 = new Student(3, new int[]{3, 3, 1, 1, 2, 2, 4, 4, 5, 5});

        List<Student> students = new ArrayList<>();
        students.add(student1);
        students.add(student2);
        students.add(student3);

        for (int i = 0; i < answers.length; i++) {
            int answer = answers[i];
            for (Student student : students) {
                if (answer == student.getAnswer(i)) {
                    student.scoreUp();
                }
            }
        }

        Student excellentStudent = students.stream().max(Comparator.comparingInt(o -> o.score)).orElse(null);
        if (excellentStudent == null) {
            return new int[]{};
        }

        int highestScore = excellentStudent.score;
        return students.stream().filter(student -> student.score == highestScore).sorted(Comparator.comparingInt(o -> o.no)).mapToInt(Student::getNo).toArray();
    }

    public static void main(String[] args) {
        int[] answers = {1, 2, 3, 4, 5};
        int[] expected = {1};
        int[] result = solution(answers);
        checkIsCorrect(result, expected);

        int[] answers2 = {1, 3, 2, 4, 2};
        int[] expected2 = {1, 2, 3};
        int[] result2 = solution(answers2);
        checkIsCorrect(result2, expected2);
    }

    private static void checkIsCorrect(int[] answer, int[] expected) {
        if (Arrays.equals(expected, answer)) {
            System.out.println("OK");
        } else {
            System.out.println("NOT OK");
        }
    }
}
