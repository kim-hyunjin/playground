package com.eomcs.lms.handler;

import java.util.Arrays;
import com.eomcs.lms.domain.Lesson;

public class LessonList {
  private Lesson[] list;
  private int size = 0;
  private static final int DEFAULT_CAPACITY = 100;
  
  public LessonList() {
    this.list = new Lesson[DEFAULT_CAPACITY];
  }
  
  public LessonList(int capacity) {
    if (capacity > DEFAULT_CAPACITY && capacity < 10000) {
      this.list = new Lesson[capacity];
    } else {
    this.list = new Lesson[DEFAULT_CAPACITY];
    }
  }
  
  public void add(Lesson lesson) {
    if(this.size == this.list.length) {
      int oldCapacity = this.list.length;
      int newCapacity = oldCapacity + (oldCapacity >> 1);
      this.list = Arrays.copyOf(this.list, newCapacity);
    }
    this.list[this.size++] = lesson;
  }
  
  public Lesson[] toArray() {
    return Arrays.copyOf(this.list, this.size);
  }
  
}
