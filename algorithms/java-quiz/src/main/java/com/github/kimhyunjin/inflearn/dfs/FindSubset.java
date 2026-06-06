package com.github.kimhyunjin.inflearn.dfs;

public class FindSubset {
    static int n;
    static int[] check;
    public void DFS(int L) {
        if (L == n+1) {
            String tmp = "";
            for (int i = 1; i <= n; i++) {
                if(check[i]==1) tmp += (i+" ");
            }
            if (tmp.length() > 0) System.out.println(tmp);
        } else {
            // L을 부분집합으로 사용한다, 사용하지 않는다 두 가지 갈래로 뻗는다.
            check[L] = 1; // 사용
            DFS(L+1);

            check[L] = 0; // 미사용
            DFS(L+1);
        }
    }

    public static void main(String[] args) {
        FindSubset findSubset = new FindSubset();
        n = 3;
        check = new int[n + 1];
        findSubset.DFS(1);
    }
}
