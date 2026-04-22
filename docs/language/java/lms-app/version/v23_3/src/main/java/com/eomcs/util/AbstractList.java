package com.eomcs.util;

// 제너럴라이제이션 3단계
// => 추상 메서드를 선언하는 의미: 
//    - 서브 클래스에 구현을 강제할 수 있다.
//      => 해당 객체가 반드시 갖춰야할 기능을 선언하는 것이다.
//         즉, 객체의 사용법(사용 규칙)을 명시하는 효과가 있다.
//
// => 객체의 구현 방법에 영향을 받지 않는 메서드를 따로 분리하여
//    객체의 사용규칙을 정의하게 되면 코드 구조가 좀 더 유연하고, 교체하기 쉬워진다.
//
// 추상 클래스를 추출한 다음, 추상 메서드 설정.
// 추상 메서드는 인터페이스 문법을 사용하여 별도로 분리.
// 
// 분리한 인터페이스 추가
// AbstractList를 상속받는 서브 클래스는
// 반드시 AbstractList에 추가된 규칙(List<E>)에 따라 메서드를 정의해야 한다.
// 즉 List<E>에 선언된 모든 추상 메서드를 구현해야한다.(메서드의 body를 정의)
// 
public abstract class AbstractList<E> implements List<E> {
  // List 규칙에 따라 동작하는데 필요한 필드가 있다면
  // 다음과 같이 그 규칙을 따르는 클래스 쪽에 필드를 선언하면 된다.
  
  protected int size;
  
  // AbstractList는 List규칙을 포함한다.
  // List규칙에 정의된 메서드 중 size()를 다음과 같이 구현.
  public int size() {
    return size;
  }
}//end public class
