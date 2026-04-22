package programmers.algorithm.level1;

public class CenterCharacter {
  //  단어 s의 가운데 글자를 반환하는 함수, solution을 만들어 보세요.
  //  단어의 길이가 짝수라면 가운데 두글자를 반환하면 됩니다.
  //
  //  재한사항
  //  s는 길이가 1 이상, 100이하인 스트링입니다.

  public static String solution(String s) {
    String answer = "";
    char[] data = s.toCharArray();
    int i = s.length()/2;
    if(s.length()%2 == 1) {
      answer = String.valueOf(s.charAt(i));
    } else {
      answer = String.copyValueOf(data, i-1, 2);
    }

    return answer;
  }

  public static void main(String[] args) {
    System.out.println(solution("abaaaaaaaaaaaaaaaade"));
  }
}
