package com.eomcs.lms.handler;

import java.util.Arrays;
import com.eomcs.lms.domain.Member;

public class MemberList {
  private Member[] list;
  private int size = 0;
  private static final int DEFAULT_CAPACITY = 100;

  public MemberList() {
    this.list = new Member[DEFAULT_CAPACITY]; 
  }

  public MemberList(int capacity) {
    if (capacity > DEFAULT_CAPACITY && capacity < 10000) {
      this.list = new Member[capacity];
    }
    this.list = new Member[DEFAULT_CAPACITY];
  }

  public void add(Member member) {
    if(this.size == this.list.length) {
      int oldCapacity = this.list.length;
      int newCapacity = oldCapacity + (oldCapacity >> 1);
      this.list = Arrays.copyOf(this.list, newCapacity);
    }
    this.list[this.size++] = member;
  }

  public Member[] toArray() {
    return Arrays.copyOf(this.list, this.size);
  }
}
