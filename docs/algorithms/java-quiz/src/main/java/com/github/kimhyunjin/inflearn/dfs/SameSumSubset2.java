package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

public class SameSumSubset2 {

    static int[] numbers;
    static int total;
    static boolean answer = false;

    public void solution(int index, int sum) {
        if(answer) return;
        if(sum>total/2) return; // 합이 전체값이 절반을 넘어서면 더 밑으로 탐색할 필요가 없다.(이미 합이 같은 부분집합이 불가)
        if(index == numbers.length) {
            if ((total-sum) == sum) answer = true; // 같은 부분집합인지 확인하기 위한 간단한 방법
        } else {
            // 합에 더할지 말지 따로 체크 배열을 둘 필요없이 합을 만들어 넘기면서 탐색하면 된다.
            solution(index+1, sum+numbers[index]); // 합에 더하는 경우
            solution(index+1, sum); // 더하지 않는 경우
        }
    }

    public static void main(String[] args){
        Scanner in=new Scanner(System.in);
        int N = in.nextInt();
        numbers = new int[N];
        for (int i = 0; i < N; i++) {
            int num = in.nextInt();
            numbers[i] = num;
            total += num; // 전체 값을 미리 구해두고 같은 부분합인지 확인할 때 사용
        }
        SameSumSubset2 sameSumSubset = new SameSumSubset2();
        sameSumSubset.solution(0, 0);
        if (answer) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }

        return ;
    }
}
