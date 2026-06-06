package com.eomcs.util;

public interface List<E> {
  
  int size();
  
  void add(E e);
  
  void add(int index, E e);
  
  E get(int index);
  
  E remove(int index);
  
  E set(int index, E obj);
  
  Object[] toArray();
  
  E[] toArray(E[] arr);
  
  // 내부에 보관된 값을 꺼내주는 메서드를 추가한다.
  // => 값을 저장하는 방식에 따라 구현 방법이 다르기 때문에
  //    super 클래스에서 정의하지 않고, 메서드만 선언한다.
  Iterator<E> iterator();
  
}
