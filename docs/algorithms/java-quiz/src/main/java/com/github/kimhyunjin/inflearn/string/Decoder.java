package com.github.kimhyunjin.inflearn.string;

import java.util.Scanner;

public class Decoder {
    final int WORD_SIZE = 7;

    public char decode(String secret) {
        StringBuilder sb = new StringBuilder();
        for (char c : secret.toCharArray()) {
            if (c == '#') {
                sb.append(1);
            } else if (c == '*') {
                sb.append(0);
            }
        }
        return (char)Integer.parseInt(sb.toString(), 2);
    }
    public String solution(int count, String secret) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < count; i++) {
            sb.append(decode(secret.substring(i*WORD_SIZE, i*WORD_SIZE + WORD_SIZE)));
        }
        return sb.toString();
    }
    /** replace 사용 */
    public String solution2(int count, String secret) {
        String answer = "";
        for (int i = 0 ; i < count; i++) {
            String tmp = secret.substring(0, WORD_SIZE).replace('#', '1').replace('*', '0');
            answer += (char) Integer.parseInt(tmp, 2);
            secret = secret.substring(WORD_SIZE);
        }
        return answer;
    }
    public static void main(String[] args){
        Decoder decoder = new Decoder();
        Scanner in=new Scanner(System.in);
        int count = Integer.parseInt(in.nextLine());
        String secret = in.nextLine();
        System.out.println(decoder.solution2(count, secret));
        return ;
    }
}
