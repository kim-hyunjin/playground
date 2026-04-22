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

  @SuppressWarnings("unchecked")
  @Override
  public Stack<E> clone() {
    try {
      Stack<E> destination = (Stack<E>)super.clone();
      Object[] arr = new Object[this.elementCount];
      for (int i = 0; i < this.elementCount; i++) {
        arr[i] = this.elementData[i];
      }
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

  public Iterator<E> iterator() {
    // this = 인스턴스 주소
    // local class : 특정 메서드 안에서만 사용되는 클래스라면 로컬 클래스로 정의하라.
    class StackIterator<T> implements Iterator<T> {
      Stack<T> stack;

      @SuppressWarnings("unchecked")
      public StackIterator() {
        // 스택은 값을 꺼내면 제거되기 때문에 clone()한다.
        this.stack = (Stack<T>)Stack.this.clone();
      }

      @Override
      public boolean hasNext() {
        return !stack.empty();
      }

      @Override
      public T next() {
        return stack.pop();
      }
    }
    // 로컬 클래스의 인스턴스를 생성할 때 바깥 클래스의 인스턴스 주소를 줘서는 안된다.
    // 따라서 로컬 클래스의 생성자를 호출할 때 앞쪽에 this. 를 붙여서는 안된다.
    return new StackIterator<E>();
  }
/*//참고
  static void m1() {
    // 스태틱 메서드는 클래스 이름으로 다음과 같이 호출할 수 있기 때문에
    // ex) Stack.m1();
    // this변수가 없다.
    // 스태틱 메서드에서 로컬 클래스를 정의한다면
    // 그 로컬 클래스는 바깥 클래스의 인스턴스를 직접 접근할 수가 없다.
    class A {
      A() {
        Stack s;
        s = Stack.this; // 컴파일 오류!
        // 이 로컬 클래스는 m1()에서 사용할 것이다.
        // m1()은 바깥 클래스의 인스턴스 주소를 모른다.
        // 그런데 로컬 클래스에서 위와 같이 바깥 클래스의 인스턴스를 사용하려 한다면
        // 문제가 되는 것이다.
        // 이런 상황을 방지하고자 자바는 컴파일 오류를 발생시킨다.
      }
    }
  }
  */

  /// private method ///
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



}//end public class
