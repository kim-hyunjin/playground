package com.eomcs.util;

// 목록 객체의 사용 규칙을 따로 정리
// => 문법
//    interface 규칙명 {...}

public interface List<E> {
  
  // 사용규칙(호출할 메서드 시그니처)이기 때문에 모든 메서드는 abstract이다.
  // 또한 규칙은 공개되어야 하기 때문에 모든 메서드는 public이다.
  // => public abstract 리턴타입 메서드명(파라미터);
  //    public과 abstract를 생략할 수 있다.
  int size();
  
  void add(E e);
  
  void add(int index, E e);
  
  E get(int index);
  
  E remove(int index);
  
  E set(int index, E obj);
  
  Object[] toArray();
  
  E[] toArray(E[] arr);
  
}
