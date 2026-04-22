package com.eomcs.util;

import java.util.Arrays;

public class ArrayList<E> extends List<E> { // 제네릭 E(Element)
  //// 필드 ////
  private static final int DEFAULT_CAPACITY = 100;
  private Object[] list;    // 제네릭 배열은 만들 수 없기 때문에 Object배열 그대로 사용.

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
  @SuppressWarnings("unchecked")
  @Override
  public E set(int index, E obj) {
    if (index < 0 || index >= this.size)
      return null;
    E old = (E) this.list[index];
    this.list[index] = obj;
    
    return old;
  }
  
  @SuppressWarnings("unchecked")
  @Override
  public E remove(int index) {
    if (index < 0 || index >= this.size)
      return null;
    // 삭제할 항목을 따로 보관해둔다.
    E old = (E) this.list[index];
    
    for(int i = index + 1; i < this.size; i++) {
      this.list[i - 1] = this.list[i];
    }
    this.size--;
    this.list[this.size] = null;
    // 삭제한 항목을 리턴한다.
    return old;
  }

  @Override
  public void add(E obj) {
    if(this.size == this.list.length) {
      int oldCapacity = this.list.length;
      int newCapacity = oldCapacity + (oldCapacity >> 1);
      this.list = Arrays.copyOf(this.list, newCapacity);
      System.out.printf("새 배열을 %d 개로 생성하였음!\n", newCapacity);
    }
    this.list[this.size++] = obj;
  }
  
  @Override
  public void add(int index, E e) {
    if (index < 0 || index >= this.size) {
      return;
    }
    if (this.size == this.list.length) {
      int oldCapacity = this.list.length;
      int newCapacity = oldCapacity + (oldCapacity >> 1);
      this.list = Arrays.copyOf(this.list, newCapacity);
      System.out.printf("새 배열을 %d 개로 생성하였음!\n", newCapacity);
    }
    
    for (int i = this.size - 1; i >= index; i--)
      this.list[i + 1] = this.list[i];
    
    this.list[index] = e;
    this.size++;
  }

  @Override
  public Object[] toArray() {
    return Arrays.copyOf(this.list, this.size);
  }

  @SuppressWarnings({"unchecked"})
  @Override
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
  @Override
  public E get(int index) {
    if (index >= 0 && index < this.list.length) {
      return (E)this.list[index];
    } else {
      return null;
    }
  }
  
  

  /* 의도한대로 동작하는지 확인
  public static void main(String[] args) {
    ArrayList<String> list = new ArrayList<>();
    list.add("aaaa");
    list.add("bbbb");
    list.add("cccc");
    list.add("dddd");
    list.add("eeee");
    
    list.set(0, "0000");
    list.set(2, "2222");
    list.set(4, "4444");
    list.set(-1, "zzzz");
    list.set(5, "5555");
    
    list.remove(0);
    
    String[] arr = list.toArray(new String[] {});
    for (String s : arr) {
      System.out.println(s);
    }
  }
  */
}
