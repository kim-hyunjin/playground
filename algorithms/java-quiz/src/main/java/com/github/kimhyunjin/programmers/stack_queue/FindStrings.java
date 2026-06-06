package com.github.kimhyunjin.programmers.stack_queue;

import java.util.*;

public class FindStrings {

    public static String[] solution(String s) {
        String targetString = String.copyValueOf(s.toCharArray());
        Queue<String> left = new LinkedList<>();
        Stack<String> right = new Stack<>();

        int leftIndex = 1;
        String foundChunk = "";
        while (targetString.length() > 0) {

            String chunk = targetString.substring(0, leftIndex);

            int rightIndex = targetString.lastIndexOf(chunk);

            // 문자열 뒤쪽에서 같은 문자 발견
            if (rightIndex >= targetString.length() / 2) {
                // 포함 문자를 늘려 계속해서 탐색
                foundChunk = chunk;
                leftIndex++;
                continue;
            }

            // 탐색 실패한 경우 이전에 찾은 값을 사용
            int rightFoundIndex = targetString.lastIndexOf(foundChunk);

            // 이전에 찾은값이 이미 사용됨(더 이상 뒷부분에서 새 문자열을 찾지 못함)
            if (rightFoundIndex == -1) {
                left.offer(targetString);
                break;
            }

            // 왼쪽 찾은 값 큐에 넣기
            left.offer(foundChunk);
            // 오른쪽 찾은 값 스택에 넣기
            right.push(targetString.substring(rightFoundIndex));
            // 목표 문자열 업데이트
            targetString = targetString.substring(leftIndex - 1, rightFoundIndex);
            leftIndex = 1;
        }

        ArrayList<String> answer = new ArrayList<>();
        while (!left.isEmpty()) {
            answer.add(left.poll());
        }
        while (!right.isEmpty()) {
            answer.add(right.pop());
        }

        return answer.toArray(String[]::new);
    }

    public static void main(String[] args) {
        String s = "abcxyqweasdfqwexyabc";
        String[] result = solution(s);
        String[] expected = {"abc","xy", "qwe", "asdf", "qwe", "xy","abc"};
        if(Arrays.equals(result, expected)) {
            System.out.println("Correct!");
        } else {
            System.out.println("Wrong!");
        }
    }
}
