package com.github.kimhyunjin.inflearn.dfs;

public class Recursive {

    public void DFS(int n) {
        if (n == 0) return;
        DFS(n - 1);
        System.out.print(n + " ");
    }

    // n을 이진수로 출력하기
    public void DFS2(int n) {
        if (n == 0) return;
        DFS2(n / 2);
        System.out.print(n % 2);
    }

    public int factorial(int n) {
        if (n == 1) return 1;
        return n * factorial(n - 1);
    }

    // 메모이제이션을 위한 배열
    public int[] fibo;
    // 재귀는 스택프레임이 계속 늘기때문에 무겁고 느리다. for문으로 구현하는게 더 성능이 좋다.
    public int fibonacci(int n) {
        if(fibo[n] > 0) return fibo[n];

        if (n == 1) return fibo[n] = 1;
        if (n == 2) return fibo[n] = 1;

        return fibo[n] = fibonacci(n - 2) + fibonacci(n - 1);
    }

    public static void main(String[] args) {
        Recursive recursive = new Recursive();
        recursive.fiboTest();
    }

    private void fiboTest() {
        Recursive recursive = new Recursive();
        int n = 45;
        recursive.fibo = new int[n + 1];
        recursive.fibonacci(n);
        for (int i = 1; i <= n; i++) System.out.print(recursive.fibo[i] + " ");
    }

}
