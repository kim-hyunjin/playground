package com.github.kimhyunjin.inflearn.array;

import java.util.ArrayList;
import java.util.Scanner;

/**
 4 3
 3 4 1 2
 4 3 2 1
 3 1 4 2
 *
 */
public class Mentoring {

    private int solution(final int students, final int tests, final int[][] table) {
        ArrayList<Integer> mentorCandidate = new ArrayList<>();
        // 한번이라도 꼴등했다면 멘토가 될 수 없다.
        for (int s = 1; s <= students; s++) {
            boolean canBeCandidate = true;
            for (int y = 0; y < tests; y++) {
                if (s == table[y][students - 1]) {
                    canBeCandidate = false;
                    break;
                }
            }
            if (canBeCandidate) {
                mentorCandidate.add(s);
            }
        }

        int answer = 0;
        for (int mentor : mentorCandidate) {
            //System.out.println("mentor? : " + mentor);
            for (int mentee = 1; mentee <= students; mentee++) {
                if (mentor == mentee) continue;
                //System.out.println("mentee? : " + mentee);

                // 모든 테스트에서 등수가 앞서야 멘토-멘티가 짝지어질 수 있다.
                boolean canBeMentor = true;
                for (int[] test : table) {
                    //System.out.println(Arrays.toString(test));
                    int mentorRank = 0; int menteeRank = 0;
                    for (int i = 0; i < test.length; i++) {
                        if (test[i] == mentor) mentorRank = i + 1;
                        if (test[i] == mentee) menteeRank = i + 1;
                        if (mentorRank > 0 && menteeRank > 0) break;
                    }
                    //System.out.println("montor Rank: " + mentorRank + " mentee Rank: " + menteeRank);
                    if (mentorRank > menteeRank) canBeMentor = false; // rank가 낮아야 등수가 앞선 것이다.
                }

                if (canBeMentor) answer++;
            }

        }

        return answer;
    }

    /**
     * 강좌풀이
     * 학생 n 명의 멘토-멘티 짝 경우의 수는 n(n-1) 이다. 학생번호는 1부터 시작
     * m = 테스트 수
     */
    private int solution2(int n, int m, int[][] arr) {
        int answer = 0;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                int cnt = 0;
                for (int k = 0; k < m; k++) {
                    int pi = 0, pj = 0; // pi: i학생 등수, pj: j학생 등수
                    for (int s = 0; s < n; s++) {
                        if (arr[k][s] == i) pi = s;
                        if (arr[k][s] == j) pj = s;
                    }
                    if (pi<pj) cnt++; // 등수가 더 높으면 +
                }
                if (cnt == m) { // 모든 테스트에서 등수가 앞섰다면
                    answer++; // 정답 + 1
                }
            }
        }
        return answer;
    }

    public static void main(String[] args){
        Mentoring mentoring = new Mentoring();
        Scanner in=new Scanner(System.in);
        int students = in.nextInt();
        int tests = in.nextInt();
        int[][] table = new int[tests][students];

        for (int y = 0; y < tests; y++) {
            for (int x = 0; x < students; x++) {
                table[y][x] = in.nextInt();
            }
        }

        System.out.println(mentoring.solution2(students, tests, table));

        return ;
    }
}
