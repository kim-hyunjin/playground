package com.eomcs.util;

// 제너럴라이제이션 1단계
// => ArrayList와 LinkedList 사이의 공통 분모를 추출하여 super 클래스 정의.
// => ArrayList와 LinkedList는 정의된 super 클래스를 상속 받는다.
public class List<E> {
  protected int size;
  
  public int size() {
    return size;
  }
  
  public void add(E e) {
    // ArrayList나 LinkedList는 동작 방법이 다르기 때문에
    // 여기서 구현할 필요가 없다.
    
  }
  
  public void add(int index, E e) {
    
  }
  
  public E get(int index) {
    return null;
  }
  
  public E remove(int index) {
    return null;
  }
  
  public E set(int index, E obj) {
    return null;
  }
  
  public Object[] toArray() {
    return null;
  }
  
  public E[] toArray(E[] arr) {
    return null;
  }
  
  
}//end public class
