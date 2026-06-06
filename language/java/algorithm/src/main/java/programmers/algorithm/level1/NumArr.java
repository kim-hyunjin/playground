package programmers.algorithm.level1;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

public class NumArr {
  //  문제 설명
  //  array의 각 element 중 divisor로 나누어 떨어지는 값을 오름차순으로 정렬한 배열을 반환하는 함수,
  //  solution을 작성해주세요.
  //  divisor로 나누어 떨어지는 element가 하나도 없다면 배열에 -1을 담아 반환하세요.
  //
  //  제한사항
  //  arr은 자연수를 담은 배열입니다.
  //  정수 i, j에 대해 i ≠ j 이면 arr[i] ≠ arr[j] 입니다.
  //  divisor는 자연수입니다.
  //  array는 길이 1 이상인 배열입니다.

  public int[] solution(int[] arr, int divisor) {
    int[] answer = {};
    ArrayList<Integer> al = new ArrayList<>();
    for(int i : arr) {
      if(i%divisor == 0) {
        al.add(i);
      }
    }
    if(al.size() == 0) {
      al.add(-1);
    }
    Collections.sort(al);
    answer = al.stream().mapToInt(Integer::intValue).toArray();

    return answer;
  }

  public int[] solution2(int[] arr, int divisor) {
    Arrays.sort(arr);
    int size = 0;
    for (int num : arr) {
      if(num%divisor == 0) {
        size++;
      }
    }
    if (size == 0) {
      return new int[] {-1};
    }
    int count = 0;
    int[] newArr = new int[size];
    for(int num : arr) {
      if (num % divisor == 0) {
        newArr[count++] = num;
      }
    }
    return newArr;
  }

  public int[] solution3(int[] arr, int divisor) {
    int[] result = Arrays.stream(arr).filter(i -> i%divisor == 0).sorted().toArray();
    return result.length == 0 ? new int[] {-1} : result;
  }


  public static  int[] divisible(int[] array, int divisor) {
    //ret에 array에 포함된 정수중, divisor로 나누어 떨어지는 숫자를 순서대로 넣으세요.
    int count=0,two=0;
    for(int i=0; i< array.length; i++){
      if(array[i]%divisor==0) {
        count++;
      }
    }
    int[] ret = new int[count];
    for(int i=0; i< array.length; i++){
      if(array[i]%divisor==0) {
        ret[two++]=array[i];
      }
    }
    ret = Arrays.copyOf(ret, 1);
    ret[0] = -1;
    return ret;
  }
  // 아래는 테스트로 출력해 보기 위한 코드입니다.
  public static void main(String[] args) {
    int[] array = {3, 2, 6};
    System.out.println(NumArr.divisible(array, 10)[0]);
  }

}
