package com.eomcs.util;

import java.util.Arrays;
import java.util.EmptyStackException;

public class Stack<E> implements Cloneable {
  /// 필드 ///
  Object[] elementData;
  int elementCount;
  private static final int DEFAULT_CAPACITY = 100;

  /// 생성자 ///
  public Stack() {
    this.elementData = new Object[DEFAULT_CAPACITY];
    this.elementCount = 0;
  }

  public Stack(int capacity) {
    if (capacity < 10000) {
      this.elementData = new Object[capacity];
    } else {
      this.elementData = new Object[DEFAULT_CAPACITY];
    }
    this.elementCount = 0;
  }
  
  public Stack(Stack<E> s) {
    this.elementData = s.elementData;
    this.elementCount = s.elementCount;
  }
  

  /// 메서드 ///
  public void push(E value) {
    if (this.elementCount == elementData.length) {
      grow();
    }
    this.elementData[elementCount++] = value;
  }

  @SuppressWarnings("unchecked")
  public E pop() {
    E obj;
    if(empty()) {
      return null;
    } else {
      this.elementCount--;
      obj = (E)this.elementData[this.elementCount];
      this.elementData[this.elementCount] = null;
      return obj;
    }
  }
  /*Object.clone()의 shallow copy 이용하여 스택 객체 복사하기
   * => 객체의 인스턴스 필드를 그대로 복제.
   * => 인스턴스 변수가 가리키는 객체는 복제하지 않는다.
   *    
   * 문제점?
   * => 따라서 인스턴스 필드인 elementData가 가리키는 배열은 복제하지 않는다.
   *    그래서 배열의 값을 바꾸면 원본 값도 바뀐다.
   * 
   * 
  @SuppressWarnings("rawtypes")
  @Override
  public Stack clone(Stack s) {
    try {
        return (Stack)super.clone();
      }
    } catch (CloneNotSupportedException ex) {
      // Object의 clone메서드는 복제가 허용된 객체에 대해서만 해당 인스턴스 변수를 복제한다.
      // 복제가 허용되지 않은 객체에 대해서 clone()을 호출하면
      // java.lang.CloneNotSupportedException 오류 발생
      // => 해결책? Clone()을 재정의하는 메서드는 반드시 Cloneable 인터페이스를 지정해야한다.
      //    즉, 해당 객체가 복제할 수 있음을 표현하는 문법.
      System.out.println(ex);
      return null;
    }
  }
  */
  
  @SuppressWarnings("unchecked")
  /* deep copy를 이용하여 객체 복제하기 
   * => 데이터가 들어있는 배열까지 복사
   *    따라서 배열의 값을 바꾸더라도 원본객체에 영향을 끼치지 않는다.
   *    
   * */
  @Override
  public Stack<E> clone() {
    try {
    // shallow copy를 통해 이 객체의 인스턴스 필드 복제
    Stack<E> destination = (Stack<E>)super.clone();
    
    // elementData 배열 복제
    // => 배열에 저장된 객체(ex) 문자열)까지는 복제를 수행하지 않음.
    // => 어디까지 복제(deep copy의 수준)할 것인지는 상황에 따라 복제한다.
    Object[] arr = new Object[this.elementCount];
    for (int i = 0; i < this.elementCount; i++) {
      arr[i] = this.elementData[i];
    }
    // 복제한 배열을 destinationStack
    destination.elementData = arr;
    return destination;
    } catch(CloneNotSupportedException ex) {
      System.out.println(ex);
      return null;
    }
  }
  
  @SuppressWarnings("unchecked")
  public synchronized E peek() {
    int len = this.elementCount;

    if (len == 0)
        throw new EmptyStackException();
    return (E)this.elementData[len - 1];
}
  
  private void grow() {
    this.elementData = Arrays.copyOf(this.elementData, newCapacity());
  }
  
  private int newCapacity() {
    int oldCapacity = elementData.length;
    return oldCapacity + (oldCapacity >> 1);
  }
  
  public boolean empty() {
    return this.elementCount == 0;
}
  
  
}
