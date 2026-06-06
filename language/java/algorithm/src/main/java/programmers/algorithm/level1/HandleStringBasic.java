package programmers.algorithm.level1;
// 문자열 s의 길이가 4 혹은 6이고, 숫자로만 구성돼있는지 확인해주는 함수, solution을 완성하세요.
// 예를 들어 s가 a234이면 False를 리턴하고 1234라면 True를 리턴하면 됩니다.
//
// 제한 사항
// s는 길이 1 이상, 길이 8 이하인 문자열입니다.
public class HandleStringBasic {
  public boolean solution(String s) {
    if(!(s.length() == 4 || s.length() == 6)) { // 문자열 s의 길이가 4 혹은 6이 아닌 경우 false
      return false;
    }
    for (int i = 0; i < s.length(); i++) {
      if (!Character.isDigit(s.charAt(i))) { // 문자가 숫자가 아닌 경우 false
        return false;
      }
    }
    return true;
  }

  public boolean solution2(String s) {
    return s.matches("(^[0-9]{4}|{6}$)");
  }
}
