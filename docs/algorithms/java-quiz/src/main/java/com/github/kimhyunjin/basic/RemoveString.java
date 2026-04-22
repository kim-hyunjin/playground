package com.github.kimhyunjin.basic;

public class RemoveString {

    public static int solution(String target, String removeString) {
        int answer = 0;
        int foundIndex = 0;
        while (true) {
            foundIndex = target.indexOf(removeString);
            if (foundIndex == -1) {
                break;
            }
            target = target.substring(0, foundIndex) + target.substring(foundIndex + removeString.length());
            answer++;
        }
        return answer;
    }

    public static void main(String[] args) {
        String target = "qqqqqweqweqwewewewewer";
        String removeString = "qwe";
        int result = solution(target, removeString);
        int expect = 7;
        if (result == expect) {
            System.out.println("Correct!");
        } else {
            System.out.println("Wrong...");
        }
    }
}
