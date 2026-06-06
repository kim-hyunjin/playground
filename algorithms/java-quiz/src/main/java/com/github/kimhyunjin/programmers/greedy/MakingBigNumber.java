package com.github.kimhyunjin.programmers.greedy;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

/**
 * 어떤 숫자에서 k개의 수를 제거했을 때 얻을 수 있는 가장 큰 숫자를 구하려 합니다.
 *
 * 예를 들어, 숫자 1924에서 수 두 개를 제거하면 [19, 12, 14, 92, 94, 24] 를 만들 수 있습니다. 이 중 가장 큰 숫자는 94 입니다.
 *
 * 문자열 형식으로 숫자 number와 제거할 수의 개수 k가 solution 함수의 매개변수로 주어집니다.
 * number에서 k 개의 수를 제거했을 때 만들 수 있는 수 중 가장 큰 숫자를 문자열 형태로 return 하도록 solution 함수를 완성하세요.
 *
 * 제한 조건
 * number는 1자리 이상, 1,000,000자리 이하인 숫자입니다.
 * k는 1 이상 number의 자릿수 미만인 자연수입니다.
 * 입출력 예
 * number	k	return
 * "1924"	2	"94"
 * "1231234"	3	"3234"
 * "4177252841"	4	"775841"
 */
public class MakingBigNumber {
    public String solution(String number, int k) {
        StringBuilder sb = new StringBuilder();

        // 필요한 글자 수 : 전체 글자수 - k
        for (int i = 0, index = -1; i < number.length() - k; i++) {
            // 순서를 바꿀 수 없기 때문에 앞쪽에서부터 큰수를 남기고 작은 수를 제거해야 전체적으로 큰 수를 만들 수 있다.

            char max = 0;
            for (int j = index + 1; j <= k + i; j++) {
                if (number.charAt(j) > max) {
                    index = j;
                    max = number.charAt(j);
                }
            }
            sb.append(max);
        }

        return sb.toString();
    }

    public String solution2(String number, int k) {
        List<Character> list = new ArrayList<>();
        for (int i = 0; i < number.length(); i++) {
            // 전에 선택한 숫자가 현재 들어오는 숫자보다 작으면 제거 (앞쪽에서 큰수를 남기고 작은 수를 제거해야 최종적으로 큰 수를 만들 수 있음)
            while (!list.isEmpty() && list.get(list.size() - 1) < number.charAt(i) && k > 0) {
                list.remove(list.size() - 1);
                k--;
            }
            list.add(number.charAt(i));
        }

        while (k > 0) {
            list.remove(list.size() - 1);
            k--;
        }

        StringBuilder sb = new StringBuilder();
        for (Character c : list) {
            sb.append(c);
        }

        return sb.toString();
    }

    public String solution3(String number, int k) {
        char[] result = new char[number.length() - k];
        Stack<Character> stack = new Stack<>();

        for (int i=0; i<number.length(); i++) {
            char c = number.charAt(i);
            while (!stack.isEmpty() && stack.peek() < c && k-- > 0) {
                stack.pop();
            }
            stack.push(c);
        }
        for (int i=0; i<result.length; i++) {
            result[i] = stack.get(i);
        }
        return new String(result);
    }

    public static void main(String[] args) {
        MakingBigNumber makingBigNumber = new MakingBigNumber();
        String[] numbers = {"1924", "1231234", "4177252841"};
        int[] k = {2, 3, 4};
        String[] expect = {"94", "3234", "775841"};
        for (int i = 0; i < numbers.length; i++) {
            if (expect[i].equals(makingBigNumber.solution2(numbers[i], k[i]))) {
                System.out.println("OK");
            } else {
                System.out.println("FAIL");
            }
        }
    }
}
