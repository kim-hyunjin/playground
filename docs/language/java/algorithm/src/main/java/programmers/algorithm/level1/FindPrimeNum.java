package programmers.algorithm.level1;

//문제 설명
//1부터 입력받은 숫자 n 사이에 있는 소수의 개수를 반환하는 함수, solution을 만들어 보세요.
//
//소수는 1과 자기 자신으로만 나누어지는 수를 의미합니다.
//(1은 소수가 아닙니다.)
//
//제한 조건
//n은 2이상 1000000이하의 자연수입니다.
//입출력 예
//n   result
//10  4
//5   3
//입출력 예 설명
//입출력 예 #1
//1부터 10 사이의 소수는 [2,3,5,7] 4개가 존재하므로 4를 반환
//
//입출력 예 #2
//1부터 5 사이의 소수는 [2,3,5] 3개가 존재하므로 3를 반환
public class FindPrimeNum {
  public int solution(int n) {
    // 에라토스테네스의 체
    boolean[] arr = new boolean[n+1];    //true 이면 해당 인덱스 소수.
    arr[0] = arr[1] = false;
    for(int i=2; i<=n; i+=1) {
      arr[i] = true; // true로 초기화
    }

    //2 부터 숫자를 키워가며 배수들을 제외(false 할당)
    for(int i=2; i*i<=n; i+=1) {
      for(int j=i*i; j<=n; j+=i) {
        arr[j] = false;        //2를 제외한 2의 배수 false (4, 6, 8, 10)제거, i가 3이 됐을 때 9제거
      }
    }
    int answer = 0;
    for(int i=0; i<=n; i+=1) {
      if(true == arr[i]) {
        answer++;
      }
    }
    return answer;
  }
}
