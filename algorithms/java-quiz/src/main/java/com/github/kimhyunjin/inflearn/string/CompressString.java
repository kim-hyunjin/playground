package com.github.kimhyunjin.inflearn.string;

import java.util.Scanner;

public class CompressString {
    public String solution(String input) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < input.length(); i++) {
            int repeated = 1;
            for (int j = i + 1; j < input.length(); j++) {
                if (input.charAt(i) == input.charAt(j)) {
                    repeated++;
                } else {
                    break;
                }
            }
            sb.append(input.charAt(i));
            if (repeated != 1) {
                sb.append(repeated);
            }
            i = i + repeated - 1;
        }
        return sb.toString();
    }
    public String solution2(String input) {
        String answer = "";
        input += " "; // index out of bound 방지
        int repeatCnt = 1;
        for (int i = 0; i < input.length() - 1; i++) { // 뒤에 임의로 빈문자 추가했으므로 length - 1까지만 순회
            if (input.charAt(i) == input.charAt(i + 1)) {
                repeatCnt++;
            } else {
                answer += input.charAt(i);
                if (repeatCnt > 1) answer += String.valueOf(repeatCnt);
                repeatCnt = 1;
            }
        }
        return answer;
    }
    public static void main(String[] args){
        CompressString compressString = new CompressString();
        Scanner in=new Scanner(System.in);
        String input = in.nextLine();
        System.out.println(compressString.solution2(input));
        return ;
    }
}
