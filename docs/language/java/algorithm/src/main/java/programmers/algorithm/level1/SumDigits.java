package programmers.algorithm.level1;

import java.util.Arrays;

public class SumDigits {
  public static int solution(int n) {
    //    자연수 N이 주어지면, N의 각 자릿수의 합을 구해서 return 하는 solution 함수를 만들어 주세요.
    //    예를들어 N = 123이면 1 + 2 + 3 = 6을 return 하면 됩니다.
    //
    //    제한사항
    //    N의 범위 : 100,000,000 이하의 자연수
    int answer = 0;
    String value = String.valueOf(n);
    for(int i = 0; i <value.length(); i++) {
      char ch = value.charAt(i);
      answer += (ch-48); // '5' :: 53-48 = 5
    }
    return answer;
  }

  public static void main(String[] args) {
    System.out.println(solution2(123));
  }

  public static int solution2(int n) {
    // 12345 / 10000 = 1, 12345 % 10000 = 2345
    int answer = 0;
    int bound = 100000000;
    while(n > 0) {
      if ((n / bound) > 0) {
        answer += (n/bound);
        n %= bound;
      }
      bound /= 10;
    }
    return answer;
  }

  public int solution3(int n) {
    int answer = 0;
    // 123
    while (n != 0) {
      answer += n % 10; // 3
      n /= 10; // 12
    }

    return answer;
  }

  public int solution4(int n) {
    int answer = 0;
    String[] array = String.valueOf(n).split("");
    for(String s : array){
      answer += Integer.parseInt(s);
    }
    return answer;
  }

  public int solution5(int n) {
    return Arrays.stream(String.valueOf(n).split("")).mapToInt(Integer::parseInt).sum();
  }

}
