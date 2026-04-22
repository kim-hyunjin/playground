package com.github.kimhyunjin.inflearn.hash;

import java.util.*;

public class SalesKinds {

    private static List<Integer> solution(int[] sales, int k) {
        List<Integer> answer = new ArrayList<>();
        Map<Integer, Integer> map = new HashMap<>();
        int lt = 0, rt = 0;

        // 윈도우 만들기
        for (; rt < k; rt++) {
            map.put(sales[rt], map.getOrDefault(sales[rt], 0) + 1);
        }
        answer.add(map.size()); // map.size() == map.keySet().size()

        // 윈도우 밀기
        while (rt < sales.length) {
            if (map.get(sales[lt]) > 1) {
                map.put(sales[lt], map.get(sales[lt]) - 1);
            } else {
                map.remove(sales[lt]);
            }
            map.put(sales[rt], map.getOrDefault(sales[rt], 0) + 1);
            answer.add(map.size());
            lt++;
            rt++;
        }

        return answer;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int salesLength = in.nextInt();
        int k = in.nextInt();
        int[] sales = new int[salesLength];
        for (int i = 0; i < salesLength; i++) {
            sales[i] = in.nextInt();
        }
        for (int i : solution(sales, k)) {
            System.out.print(i + " ");
        }
        return ;
    }

}
/**
 * 회고
 *
 * 처음에는 배열을 순회하며 윈도우를 만들고
 * 슬라이딩하면서 new HashSet(list) 를 수행.
 * ==> 생성자에 리스트를 넣으면 내부에서 for 반복문이 돈다 ==> 타임오버
 *
 * 타임오버를 해결하고자 고민
 * ==> set을 내가 직접 만드는 방식으론 불가.
 * ==> 슬라이딩할 때 map에 넣고 갯수를 카운팅 하는 방법으로 변경.
 * ==> map의 ketSet() 메소드를 사용해 set을 얻을 수 있었다.
 * ==> 그런데 map의 ketSet()는 직접 얻을 필요 없었다. map.size() == map.ketSet().size() 이므로...
 */
