package programmers.algorithm.level1;

import java.util.Stack;

//n개의 음이 아닌 정수가 있습니다. 이 수를 적절히 더하거나 빼서 타겟 넘버를 만들려고 합니다.
//예를 들어 [1, 1, 1, 1, 1]로 숫자 3을 만들려면 다음 다섯 방법을 쓸 수 있습니다.
//
//-1+1+1+1+1 = 3
//+1-1+1+1+1 = 3
//+1+1-1+1+1 = 3
//+1+1+1-1+1 = 3
//+1+1+1+1-1 = 3
//사용할 수 있는 숫자가 담긴 배열 numbers, 타겟 넘버 target이 매개변수로 주어질 때
//숫자를 적절히 더하고 빼서 타겟 넘버를 만드는 방법의 수를 return 하도록 solution 함수를 작성해주세요.
//
//제한사항
//주어지는 숫자의 개수는 2개 이상 20개 이하입니다.
//각 숫자는 1 이상 50 이하인 자연수입니다.
//타겟 넘버는 1 이상 1000 이하인 자연수입니다.
public class TargetNumber {

  public static void main(String[] args) {
    int[] arr = new int[] {1, 1, 1, 1, 1};
    System.out.println(solution(arr, 3));
  }

  public static int solution(int[] numbers, int target) {
    Stack<Integer> stack = new Stack<>();
    stack.push(0);

    for(int num : numbers) {
      Stack<Integer> tmp = new Stack<>();
      while(!stack.empty()) {
        int val = stack.pop();
        tmp.push(val + num);
        tmp.push(val - num);
      }
      stack.addAll(tmp);
    }
    return (int) stack.stream().filter(i -> i==target).count();
  }

  public int solution2(int[] numbers, int target) {
    int answer = 0;
    answer = dfs(numbers, 0, 0, target);
    return answer;
  }
  int dfs(int[] numbers, int n, int sum, int target) {
    if(n == numbers.length) {
      if(sum == target) {
        return 1;
      }
      return 0;
    }
    return dfs(numbers, n + 1, sum + numbers[n], target) + dfs(numbers, n + 1, sum - numbers[n], target);
  }


}
