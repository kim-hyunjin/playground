package programmers.algorithm.level1;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

//문제 설명
//정수를 저장한 배열, arr 에서 가장 작은 수를 제거한 배열을 리턴하는 함수, solution을 완성해주세요.
//단, 리턴하려는 배열이 빈 배열인 경우엔 배열에 -1을 채워 리턴하세요.
//예를들어 arr이 [4,3,2,1]인 경우는 [4,3,2]를 리턴 하고, [10]면 [-1]을 리턴 합니다.
//
//제한 조건
//arr은 길이 1 이상인 배열입니다.
//인덱스 i, j에 대해 i ≠ j이면 arr[i] ≠ arr[j] 입니다.
//
//입출력 예
//arr          return
//[4,3,2,1]   [4,3,2]
//[10]         [-1]
public class RemoveMinNum {
  public int[] solution(int[] arr) {
    int[] answer = {};
    ArrayList<Integer> list = new ArrayList<>();
    int min = Integer.MAX_VALUE;
    for(int i = 0; i < arr.length; i++) {
      if(arr[i] < min) {
        min = arr[i]; // 가장 최솟값 찾기
      }
    }
    for(int i = 0; i < arr.length; i++) {
      if(arr[i] != min) {
        list.add(arr[i]); // 최솟값을 제외하고 list에 담기
      }
    }
    answer = list.stream().mapToInt(Integer::intValue).toArray(); // ArrayList => int[]
    if(answer.length == 0) {
      answer = new int[] {-1}; // 길이가 0인 경우 -1이 들어간 int[] 만듦
    }
    return answer;
  }

  public int[] solution2(int[] arr) { // stream 사용 예
    if (arr.length <= 1) {
      return new int[]{ -1 };
    }
    int min = Arrays.stream(arr).min().getAsInt();
    return Arrays.stream(arr).filter(i -> i != min).toArray();
  }

  public int[] solution3(int[] arr) {
    List<Integer> list = new LinkedList<>();
    for (int i : arr) {
      list.add(i);
    }
    Arrays.sort(arr);
    list.remove(Integer.valueOf(arr[0]));
    if (list.size() == 0) {
      return new int[] {-1};
    }
    arr = list.stream().mapToInt(i -> i).toArray();
    return arr;
  }
}
