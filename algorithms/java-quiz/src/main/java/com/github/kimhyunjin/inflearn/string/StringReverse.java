package com.github.kimhyunjin.inflearn.string;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class StringReverse {
    public List<String> solution(String[] arr) {
        List<String> answer = new ArrayList<>();
        for (String str : arr) {
            answer.add(new StringBuilder(str).reverse().toString());
        }
        return answer;
    }
    public List<String> solution2(String[] arr) {
        List<String> answer = new ArrayList<>();
        for (String str : arr) {
            char[] chars = str.toCharArray();
            int lt = 0, rt = chars.length -1;
            while (lt < rt) {
                char tmp = chars[lt];
                chars[lt] = chars[rt];
                chars[rt] = tmp;
                lt++;
                rt--;
            }
            answer.add(String.valueOf(chars));
        }
        return answer;
    }
    public static void main(String[] args){
        StringReverse stringReverse = new StringReverse();
        Scanner in=new Scanner(System.in);
        int count = in.nextInt();
        String[] arr = new String[count];
        for (int i = 0; i < count; i++) {
            arr[i] = in.next();
        }
        for (String s : stringReverse.solution(arr)) {
            System.out.println(s);
        }
        return ;
    }
}
