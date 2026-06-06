package com.github.kimhyunjin.programmers.heap;

import java.util.*;

/**
 * 하드디스크는 한 번에 하나의 작업만 수행할 수 있습니다.
 * 디스크 컨트롤러를 구현하는 방법은 여러 가지가 있습니다.
 * 가장 일반적인 방법은 요청이 들어온 순서대로 처리하는 것입니다.
 * <p>
 * 각 작업에 대해 [작업이 요청되는 시점, 작업의 소요시간]을 담은 2차원 배열 jobs가 매개변수로 주어질 때,
 * 작업의 요청부터 종료까지 걸린 시간의 평균을 가장 줄이는 방법으로 처리하면 평균이 얼마가 되는지 return 하도록 solution 함수를 작성해주세요. (단, 소수점 이하의 수는 버립니다)
 * <p>
 * [제한 사항]
 * jobs의 길이는 1 이상 500 이하입니다.
 * jobs의 각 행은 하나의 작업에 대한 [작업이 요청되는 시점, 작업의 소요시간] 입니다.
 * 각 작업에 대해 작업이 요청되는 시간은 0 이상 1,000 이하입니다.
 * 각 작업에 대해 작업의 소요시간은 1 이상 1,000 이하입니다.
 * 하드디스크가 작업을 수행하고 있지 않을 때에는 먼저 요청이 들어온 작업부터 처리합니다.
 */
public class DiskController {

    public static class Job implements Comparable<Job> {
        int requestTime;
        int workingTime;
        int processedTime;

        Job(int requestTime, int workingTime) {
            this.requestTime = requestTime;
            this.workingTime = workingTime;
        }

        void setProcessedTime(int finishTime) {
            this.processedTime = finishTime - requestTime;
        }

        @Override
        public int compareTo(Job o) {
            return this.workingTime - o.workingTime;
        }
    }

    public static int solution(int[][] jobs) {
        LinkedList<Job> watingJobList = createJobList(jobs);
        assert watingJobList.peek() != null;

        PriorityQueue<Job> heap = new PriorityQueue<>();
        List<Job> endedJobList = new ArrayList<>();

        int processedJobCnt = 0;
        int present = watingJobList.peek().requestTime;
        while (processedJobCnt < jobs.length) {
            while(!watingJobList.isEmpty() && watingJobList.peek().requestTime <= present) {
                heap.offer(watingJobList.pollFirst());
            }
            if (!heap.isEmpty()) {
                Job job = heap.poll();
                present += job.workingTime;
                job.setProcessedTime(present);
                endedJobList.add(job);
                processedJobCnt++;
            } else {
                present++;
            }
        }
        return calculateAverageProcessTime(endedJobList);
    }

    /**
     * @param endJobList 완료된 작업 목록
     * @return 평균 작업 처리 완료 시간(완료 작업 목록의 처리시간의 합 / 작업 개수)
     */
    private static int calculateAverageProcessTime(List<Job> endJobList) {
        int sum = endJobList.stream().mapToInt(job -> job.processedTime).sum();
        int size = endJobList.size();
        System.out.println("sum: " + sum + " size: " + size + " avg: " + sum / size);
        return sum / size;
    }

    /**
     * @param jobs 작업 목록
     * @return 가장 일찍 요청된 작업 순으로 정렬된 리스트
     */
    private static LinkedList<Job> createJobList(int[][] jobs) {
        LinkedList<Job> list = new LinkedList<>();
        for (int[] job : jobs) {
            int requestTime = job[0];
            int needTime = job[1];
            list.add(new Job(requestTime, needTime));
        }
        list.sort(Comparator.comparingInt(o -> o.requestTime));
        return list;
    }

    public static void main(String[] args) {
        int[][] jobs = {{2, 6}, {0, 3}, {1, 9}};
        int expected = 9;
        int result = solution(jobs);

        if (result == expected) {
            System.out.println("Correct!");
        } else {
            System.out.println("Wrong...");
        }

    }
}
