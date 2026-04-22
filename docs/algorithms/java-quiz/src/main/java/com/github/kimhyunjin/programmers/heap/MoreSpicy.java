package com.github.kimhyunjin.programmers.heap;

import java.util.PriorityQueue;

/**
 * 매운 것을 좋아하는 Leo는 모든 음식의 스코빌 지수를 K 이상으로 만들고 싶습니다.
 * 모든 음식의 스코빌 지수를 K 이상으로 만들기 위해
 * Leo는 스코빌 지수가 가장 낮은 두 개의 음식을 아래와 같이 특별한 방법으로 섞어 새로운 음식을 만듭니다.
 * <p>
 * 섞은 음식의 스코빌 지수 = 가장 맵지 않은 음식의 스코빌 지수 + (두 번째로 맵지 않은 음식의 스코빌 지수 * 2)
 * Leo는 모든 음식의 스코빌 지수가 K 이상이 될 때까지 반복하여 섞습니다.
 * <p>
 * Leo가 가진 음식의 스코빌 지수를 담은 배열 scoville과 원하는 스코빌 지수 K가 주어질 때,
 * 모든 음식의 스코빌 지수를 K 이상으로 만들기 위해 섞어야 하는
 * 최소 횟수를 return 하도록 solution 함수를 작성해주세요.
 * <p>
 * [제한사항]
 * scoville의 길이는 2 이상 1,000,000 이하입니다.
 * K는 0 이상 1,000,000,000 이하입니다.
 * scoville의 원소는 각각 0 이상 1,000,000 이하입니다.
 * 모든 음식의 스코빌 지수를 K 이상으로 만들 수 없는 경우에는 -1을 return 합니다.
 */
public class MoreSpicy {

    public static int solution(int[] scoville, int goalScoville) {
        PriorityQueue<Integer> heap = createMinHeap(scoville);
        int mixCount = 0;
        while (heap.size() > 1 && heap.peek() < goalScoville) {
            int minScoviile = heap.poll();
            int secondMinScoville = heap.poll();
            int mixedScoville = mixingScoville(minScoviile, secondMinScoville);
            mixCount++;
            heap.add(mixedScoville);
        }

        return isAchieveGoal(heap.peek(), goalScoville) ? mixCount : -1;
    }

    private static boolean isAchieveGoal(int compareScoville, int goalScoville) {
        return compareScoville >= goalScoville;
    }

    private static int mixingScoville(int minScoville, int secondMinScoville) {
        return minScoville + (secondMinScoville * 2);
    }

    private static PriorityQueue<Integer> createMinHeap(int[] list) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int i : list) {
            minHeap.add(i);
        }
        return minHeap;
    }


    public static void main(String[] args) {
        int[] scoville = {13, 14, 1, 2, 3, 9, 10, 12};
        int K = 7;
        int expected = 2;
        int answer = solution(scoville, K);

        if (answer == expected) {
            System.out.println("Correct!");
        } else {
            System.out.println("Wrong...");
        }

    }

}
