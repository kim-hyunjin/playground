package com.eomcs.util;

// 제너럴라이제이션 2단계
// => 상속하는 용도로 사용하는 클래스는 직접 인스턴스를 생성하지 못하도록 추상클래스로 정의.
// => 보통 클래스 이름을 Abstract___형식으로 짓는다.
// 
// 서브 클래스에서 구현할 메서드를 그냥 일반 메서드로 정의하면,
// 해당 메서드를 Overriding을 안할 수도 있다.
// 서브 클래스에서 추상 클래스의 메서드를 반드시 구현하도록 강제하기 위해 '추상메서드'를 사용한다.
// 
public abstract class AbstractList<E> {
  protected int size;
  
  // super 클래스에서 구현해도 상관없는 경우 일반 메서드로 구현
  public int size() {
    return size;
  }
  
  // 서브 클래스에서 구현하게끔 추상메서드로 정의
  public abstract void add(E e);
  
  public abstract void add(int index, E e);
  
  public abstract E get(int index);
  
  public abstract E remove(int index);
  
  public abstract E set(int index, E obj);
  
  public abstract Object[] toArray();
  
  public abstract E[] toArray(E[] arr);
  
  
}//end public class
