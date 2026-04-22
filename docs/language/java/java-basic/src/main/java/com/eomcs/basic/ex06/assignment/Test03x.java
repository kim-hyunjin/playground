package com.eomcs.basic.ex06.assignment;
//# 과제
//사용자로부터 정삼각형 밑변의 길이를 숫자를 입력 받아 '*' 문자로 그려라.
// 
//## 구현 조건
//반복문을 사용할 때는 while 또는 do ~ while 문만을 사용하라!
//
//## 실행 결과
//```
//밑변 길이? 5
//  *
// ***
//*****
//``` 


// 현재 과제와 가장 유사한 결과를 내는 소스를 가져와서 편집한다.
public class Test03x {
  public static void main(String[] args) {
    int width = Console.inputInt(); // 밑변 길이를 입력받음.

    //짝수를 입력하면 홀수로 바꿈
    if (width % 2 == 0)
      width--;
    
    //라인 증가
    int spaceSize = width >> 1;
    int line = 0;
    while (line++ < width ) {

      if (line % 2 == 0) {
        continue;       // 짝수번째 줄은 스킵
      }
      
      //공백 출력
      Graphic.drawLine(spaceSize, " ");
      spaceSize--;

      //문자로 라인 출력
      Graphic.drawLine(line, "$");
      System.out.println();
    }
  }  
}