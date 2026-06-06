package com.github.kimhyunjin.inflearn.dfs;

import java.util.Scanner;

public class Graph {
    static int lastNode;
    static int edgeCnt;
    static int[][] graph;
    static int[] check;
    static int answer;

    /**
     * v에서 lastNode까지 가는 방법의 가지 수를 구한다.
     * 인접행렬 int[][] graph 를 이용해 구하는데, 정점의 개수가 많으면 비효율적이게 된다.
     * 예를 들어 정점이 10000개라면 10000*10000 크기의 배열을 만들어 순회해야 한다.
     * @param v 시작점
     */
    public void DFS(int v) {
        if (v == lastNode) answer++;
        else {
            for (int i=1; i<=lastNode; i++) {
                if(graph[v][i]==1 && check[i]==0) { // v에서 i로 갈 수 있는지, 이전에 간 적은 없는지 체크
                    check[i] = 1;
                    DFS(i);
                    check[i] = 0; // back 할 때 다음 트랙킹에서 방문할 수 있도록 0으로 바꿔준다.
                }
            }
        }
    }

    public static void main(String[] args) {
        Graph G = new Graph();
        Scanner kb = new Scanner(System.in);
        lastNode = kb.nextInt();
        edgeCnt = kb.nextInt();
        graph = new int[lastNode +1][lastNode +1];
        check = new int[lastNode +1];
        for (int i = 0; i < edgeCnt; i++) {
            graph[kb.nextInt()][kb.nextInt()] = 1;
        }
        check[1] = 1;
        G.DFS(1);
        System.out.println(answer);

    }
}
