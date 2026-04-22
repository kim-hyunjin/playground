package com.eomcs.util;

import java.util.Arrays;

public class ArrayList<E> { // 제네릭 E(Element)
  //// 필드 ////
  private static final int DEFAULT_CAPACITY = 100;
  private Object[] list;    // 제네릭 배열은 만들 수 없기 때문에 Object배열 그대로 사용.
  private int size;

  //// 생성자 ////
  public ArrayList() {
    this.list = new Object[DEFAULT_CAPACITY];
  }

  public ArrayList(int capacity) {
    if (capacity > DEFAULT_CAPACITY && capacity < 10000) {
      this.list = new Object[capacity];
    } else {
      this.list = new Object[DEFAULT_CAPACITY];
    }
  }

  /// 메서드 ///
  public int getSize() {
    return this.size;
  }
  
  public void add(E obj) {
    if(this.size == this.list.length) {
      int oldCapacity = this.list.length;
      int newCapacity = oldCapacity + (oldCapacity >> 1);
      this.list = Arrays.copyOf(this.list, newCapacity);
      System.out.printf("새 배열을 %d 개로 생성하였음!\n", newCapacity);
    }
    this.list[this.size++] = obj;

  }

  public Object[] toArray() {
    return Arrays.copyOf(this.list, this.size);
  }
  
  @SuppressWarnings({"unchecked"})
  public E[] toArray(E[] arr) {   // 제네릭을 활용하여 지정받은 타입으로 배열 만들기
    if (arr.length < this.size) {
      return (E[]) Arrays.copyOf(this.list, this.size, arr.getClass());
    }
    System.arraycopy(this.list, 0, arr, 0, this.size);
    /* 위의 arraycopy()는 다음 코드와 같다.
    for (int i = 0; i < this.size; i++) {
      arr[i] = (E) this.list[i];
    }
    return null;
     */
    return arr;
  }

  @SuppressWarnings("unchecked")
  public E get(int idx) {
    if (idx >= 0 && idx < this.list.length) {
      return (E)this.list[idx];
    } else {
      return null;
    }
  }
}
