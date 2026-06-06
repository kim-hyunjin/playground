package com.github.kimhyunjin.programmers.hash;

import java.util.Arrays;

/**
 * - 문
 * 전화번호부에 적힌 전화번호를 담은 배열 phone_book 이 solution 함수의 매개변수로 주어질 때,
 * 어떤 번호가 다른 번호의 접두어인 경우가 있으면 false를
 * 그렇지 않으면 true를 return.
 */
public class HashQuiz2 {

    /**
     * 문자열 정렬 후 비교..
     * @param phone_book
     * @return
     */
    public static boolean solution1(String[] phone_book) {
        Arrays.sort(phone_book);
        for (int i = 0; i < phone_book.length-1; i++) {
            if(phone_book[i+1].startsWith(phone_book[i])) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) throws Exception {

        String[] temp = {"119", "97674223", "1195524421"};
        boolean result = solution1(temp);
        System.out.println(result);
    }
}
