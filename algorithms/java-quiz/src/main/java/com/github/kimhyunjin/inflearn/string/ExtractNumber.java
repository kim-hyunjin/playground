package com.github.kimhyunjin.inflearn.string;

import java.util.Scanner;

public class ExtractNumber {
    public int solution(String input) {
        String answer = "";
        for (char c : input.toCharArray()) {
            if (Character.isDigit(c)) {
                answer += c;
            }
        }
        return Integer.parseInt(answer);
    }
    public int solution2(String input) {
        int answer = 0;
        for (char c : input.toCharArray()) {
            if (c >= 48 && c <= 57) { // 0 ~ 9 아스키 번호
                answer = answer * 10 + (c - 48);
            }
        }
        return answer;
    }
    public static void main(String[] args){
        ExtractNumber extractNumber = new ExtractNumber();
        Scanner in=new Scanner(System.in);
        String input1 = in.nextLine();
        System.out.println(extractNumber.solution(input1));
        return ;
    }
}
