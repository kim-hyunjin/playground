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

  @Override
  public Iterator<E> iterator() {
    return new StackIterator<E>(this);
  }

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
