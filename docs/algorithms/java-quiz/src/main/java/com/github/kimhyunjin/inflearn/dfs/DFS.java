package com.github.kimhyunjin.inflearn.dfs;

public class DFS {
    Node root;

    public void search(Node root) {
        if (root == null) return;
        else {
//            System.out.print(root.data); // 전위 순회
            search(root.lt);
//            System.out.print(root.data); // 중위 순회
            search(root.rt);
//            System.out.print(root.data); // 후위 순회
        }
    }

    // 말단노드까지의 가장 짧은 경로 구하기 문제는 BFS가 더 적합하다.
    // DFS는 완전이진트리인 경우만 가능하다
    public int shortestWayToLeafNode(int L, Node root) {
        if (root.lt == null && root.rt == null) {
            return L;
        } else {
            return Math.min(shortestWayToLeafNode(L+1, root.lt), shortestWayToLeafNode(L+1, root.rt));
        }
    }

    static class Node {
        int data;
        Node lt, rt;
        public Node(int val) {
            data = val;
            lt=rt=null;
        }
    }

    public static void main(String[] args) {
        DFS tree = new DFS();
        tree.root = new Node(1);
        tree.root.lt = new Node(2);
        tree.root.rt = new Node(3);
        tree.root.lt.lt = new Node(4);
        tree.root.lt.rt = new Node(5);
//        tree.root.rt.lt = new Node(6);
//        tree.root.rt.rt = new Node(7);

        tree.search(tree.root);
        System.out.println(tree.shortestWayToLeafNode(0, tree.root));
    }


}
