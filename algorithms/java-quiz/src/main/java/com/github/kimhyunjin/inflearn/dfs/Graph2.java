package com.github.kimhyunjin.inflearn.dfs;

import java.util.ArrayList;
import java.util.Scanner;

public class Graph2 {
    static int lastNode;
    static int edgeCnt;
    static ArrayList<ArrayList<Integer>> graph;
    static int[] check;
    static int answer;

    /**
     * v에서 lastNode까지 가는 방법의 가지 수를 구한다.
     * ArrayList를 사용해 현재 V에서 방문할 수 있는 정점만 방문한다.
     * @param v 시작점
     */
    public void DFS(int v) {
        if (v == lastNode) answer++;
        else {
            for (int nv : graph.get(v)) { // v에서 갈수있는 다음 정점을 모두 순회
                if (check[nv] == 0) {
                    check[nv] = 1;
                    DFS(nv);
                    check[nv] = 0;
                }
            }
        }
    }

    public static void main(String[] args) {
        Graph2 G = new Graph2();
        Scanner kb = new Scanner(System.in);
        lastNode = kb.nextInt();
        edgeCnt = kb.nextInt();
        graph = new ArrayList<>();
        for (int i = 0; i <= lastNode; i++) { // 주의! 0번은 사용하지 않지만 만들어두어야 한다.
            graph.add(new ArrayList<>());
        }
        check = new int[lastNode +1];
        for(int i = 0; i < edgeCnt; i++) {
            int a = kb.nextInt();
            int b = kb.nextInt();
            graph.get(a).add(b);
        }
        check[1] = 1;
        G.DFS(1);
        System.out.println(answer);

    }
}
