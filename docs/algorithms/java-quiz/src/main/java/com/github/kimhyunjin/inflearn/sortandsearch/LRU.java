package com.github.kimhyunjin.inflearn.sortandsearch;

import java.util.*;
import java.util.stream.Collectors;

public class LRU {

    public List<Integer> solution(int cacheSize, int[] jobs) {
        Map<Integer, Integer> map = new HashMap<>();
        // 최근 작업일 수록 높은 recentJobNumber를 가짐.
        int recentJobNumber = 1;
        for (int job : jobs) {
            map.put(job, recentJobNumber++);
        }

        // recentJobNumber 순으로 정렬
        List<Map.Entry<Integer, Integer>> sortedByRecentlyUsed = map.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue() - e1.getValue())
                .collect(Collectors.toList());

        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < cacheSize; i++) {
            result.add(sortedByRecentlyUsed.get(i).getKey());
        }
        return result;
    }

    public int[] solution2(int cacheSize, int[] jobs) {
        int[] cache = new int[cacheSize];

        for (int job : jobs) {
            int pos = getPosIfAlreadyInCache(job, cache);

            if (pos == -1) {
                for (int i = cacheSize - 1; i >= 1; i--) {
                    cache[i] = cache[i - 1];
                }
//                위 for 문과 같은 일을 하는 코드
//                if (cacheSize - 1 >= 0) System.arraycopy(cache, 0, cache, 1, cacheSize - 1);
            } else {
                for (int i = pos; i >= 1; i--) {
                    cache[i] = cache[i - 1];
                }
//                System.arraycopy(cache, 0, cache, 1, pos);
            }
            cache[0] = job;
        }
        return cache;
    }

    private int getPosIfAlreadyInCache(int job, int[] cache) {
        int pos = -1;
        for (int i = 0; i < cache.length; i++) {
            if (job == cache[i]) pos = i;
        }
        return pos;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int cacheSize = in.nextInt();
        int numOfJobs = in.nextInt();
        int[] jobs = new int[numOfJobs];
        for (int i = 0; i < numOfJobs; i++) {
            jobs[i] = in.nextInt();
        }

        LRU lru = new LRU();
        for (int job : lru.solution(cacheSize, jobs)) {
            System.out.print(job + " ");
        }

        return ;
    }

}
