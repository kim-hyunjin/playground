package programmers.algorithm.level1;

public class CenterCharacter2 {
  //  단어 s의 가운데 글자를 반환하는 함수, solution을 만들어 보세요.
  //  단어의 길이가 짝수라면 가운데 두글자를 반환하면 됩니다.
  //
  //  재한사항
  //  s는 길이가 1 이상, 100이하인 스트링입니다.

  public static String solution(String s) {
    int slen = s.length();
    if(slen%2 == 1) {
      return s.charAt(slen/2)+"";
    }
    return s.substring(slen/2-1, slen/2+1);
  }

  //  String getMiddle(String word){
  //
  //    return word.substring((word.length()-1) / 2, word.length()/2 + 1);
  //}

  public static void main(String[] args) {
    System.out.println(solution("abaaaaaaaaaaaaaaaade"));
  }
}
