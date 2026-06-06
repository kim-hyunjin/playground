package com.github.kimhyunjin.inflearn.bfs;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Graph {

    static int vertex;
    static int edge;
    static ArrayList<ArrayList<Integer>> graph;
    static int[] check;
    static int[] dis;

    /**
     * start 정점에서 각 정점으로 가는 최소 이동 간선수를 구해 dis 배열에 기록한다.
     * @param start
     */
    public void BFS(int start) {
        Queue<Integer> Q = new LinkedList<>();
        check[start] = 1;
        dis[start] = 0;
        Q.offer(start);

        while(!Q.isEmpty()) {
            int cur = Q.poll();
            for (int nv : graph.get(cur)) {
                if (check[nv] == 0) { // 최단거리를 구하므로 이전에 방문한 적이 없어야 한다.
                    check[nv] = 1;
                    Q.offer(nv);
                    dis[nv] = dis[cur] + 1; // 다음 정점은 현재 정점에서 1이동한 것이므로
                }
            }
        }
    }

    public static void main(String[] args) {
        Graph G = new Graph();
        Scanner kb = new Scanner(System.in);
        vertex = kb.nextInt(); // 정점의 개수
        edge = kb.nextInt(); // 간선의 개수

        check = new int[vertex+1];
        dis = new int[vertex+1];

        graph = new ArrayList<>();
        for (int i=0; i<=vertex; i++) graph.add(new ArrayList<>());
        for (int i=0; i<edge; i++) {
            int a = kb.nextInt();
            int b = kb.nextInt();
            graph.get(a).add(b);
        }


        G.BFS(1);

    }
}
