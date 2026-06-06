package com.eomcs.lms.handler;

import java.util.Arrays;
import com.eomcs.lms.domain.Board;

public class ArrayList {
  //// 필드 ////
  private static final int DEFAULT_CAPACITY = 3;
  private Object[] list;
  private int size;

  //// 생성자 ////
  public ArrayList() {
    this.list = new Object[DEFAULT_CAPACITY];    // 기본 용량으로 레퍼런스 배열 만들기
  }

  public ArrayList(int capacity) {
    if (capacity > DEFAULT_CAPACITY && capacity < 10000) {
      this.list = new Object[capacity];            // 사용자가 입력한 용량으로 레퍼런스 배열 만들기
    } else {
      this.list = new Object[DEFAULT_CAPACITY];
    }
  }

  /// 메서드 ///
  public void add(Object obj) {
    if(this.size == this.list.length) {
      int oldCapacity = this.list.length;
      int newCapacity = oldCapacity + (oldCapacity >> 1);
      this.list = Arrays.copyOf(this.list, newCapacity);
      System.out.printf("배열크기 : %d ==> %d\n", oldCapacity, newCapacity);
    }
    this.list[this.size++] = obj;     // board 인스턴스를 레퍼런스 배열에 저장

  }

  public Object[] toArray() {
    return Arrays.copyOf(this.list, this.size);
  }

  public Object get(int idx) {
    if (idx >= 0 && idx < this.size) {
      return this.list[idx];
    } else {
      return null;
    }
  }
}
