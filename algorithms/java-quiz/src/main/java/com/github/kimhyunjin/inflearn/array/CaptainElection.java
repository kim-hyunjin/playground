package com.github.kimhyunjin.inflearn.array;

import java.util.*;

public class CaptainElection {

    private int solution(final int students, final int[][] table) {
        List<Set<Integer>> commons = new ArrayList<>();
        for (int y = 0; y < students; y++) {
            Set<Integer> sameClassRoomSet = new HashSet<>();
            for (int x = 0; x < 5; x++) {
                for (int y2 = 0; y2 < students; y2++) {
                    if (y == y2) continue;
                    if (table[y][x] == table[y2][x]) sameClassRoomSet.add(y2);
                }
            }
            commons.add(sameClassRoomSet);
        }

        int answer = 0;
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < commons.size(); i++) {
            if (commons.get(i).size() > max) {
                max = commons.get(i).size();
                answer = i + 1;
            }
        }

        return answer;
    }

    // 강좌 풀이 - list 나 set 없이도 간단히 풀이가 가능했다.
    private int solution2(final int n, final int[][] arr) {
        int answer = 0, max = Integer.MIN_VALUE;

        // i 학생 j 학생
        for (int i = 0; i < n; i++) {
            int cnt = 0;
            for (int j = 0; j < n; j++) {
                for (int k = 0; k < 5; k++) { // 1 ~ 5학년
                    if(arr[i][k] == arr[j][k]) { // 모든 i가 i, j 가 같은 경우라도 똑같이 count 하기때문에 상관없다.
                        cnt++;
                        break; // 한 번이라도 같은 반이었으면 더 비교할 필요 없다.
                    }
                }
            }
            if (cnt > max) {
                max = cnt;
                answer = i + 1;
            }
        }

        return answer;
    }


    public static void main(String[] args){
        CaptainElection captainElection = new CaptainElection();
        Scanner in=new Scanner(System.in);
        final int students = in.nextInt();
        int[][] table = new int[students][5];
        for (int y = 0; y < students; y++) {
            for (int x = 0; x < 5; x++) {
                table[y][x] = in.nextInt();
            }
        }

        System.out.println(captainElection.solution2(students, table));
        return ;
    }
}
