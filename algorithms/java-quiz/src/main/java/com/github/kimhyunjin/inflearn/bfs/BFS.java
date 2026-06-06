package com.github.kimhyunjin.inflearn.bfs;

import com.github.kimhyunjin.inflearn.dfs.DFS;

import java.util.LinkedList;
import java.util.Queue;

/**
 * 넓이 우선 탐색 : 레벨 탐색
 */
public class BFS {
    Node root;

    public void search(Node root) {
        Queue<Node> Q = new LinkedList<>();
        Q.offer(root);
        int L = 0;
        while(!Q.isEmpty()) {
            int len = Q.size();
            System.out.print(L + " : ");
            for (int i = 0; i < len; i++) {
                Node cur = Q.poll();
                System.out.print(cur.data+" ");
                if (cur.lt != null) Q.offer(cur.lt);
                if (cur.rt != null) Q.offer(cur.rt);
            }
            L++;
            System.out.println();
        }
    }

    public int shortestWayToLeafNode(Node root) {
        Queue<Node> Q = new LinkedList<>();
        Q.offer(root);
        int L = 0;
        while(!Q.isEmpty()) {
            int len = Q.size();
            for (int i = 0; i < len; i++) {
                Node cur = Q.poll();
                if (cur.lt == null && cur.rt == null) return L;
                if (cur.lt != null) Q.offer(cur.lt);
                if (cur.rt != null) Q.offer(cur.rt);
            }
            L++;
        }
        return -1;
    }

    static class Node {
        int data;
        BFS.Node lt, rt;
        public Node(int val) {
            data = val;
            lt=rt=null;
        }
    }

    public static void main(String[] args) {
        BFS tree = new BFS();
        tree.root = new Node(1);
        tree.root.lt = new Node(2);
        tree.root.rt = new Node(3);
        tree.root.lt.lt = new Node(4);
        tree.root.lt.rt = new Node(5);
//        tree.root.rt.lt = new Node(6);
//        tree.root.rt.rt = new Node(7);

        tree.search(tree.root);
        System.out.println(tree.shortestWayToLeafNode(tree.root));
    }
}
