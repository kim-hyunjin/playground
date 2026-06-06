package com.eomcs.lms.handler;

import java.util.Arrays;
import com.eomcs.lms.domain.Board;

public class BoardList {
  //// 필드 ////
  private static final int DEFAULT_CAPACITY = 3;
  private Board[] list;
  private int size;

  //// 생성자 ////
  public BoardList() {
    this.list = new Board[DEFAULT_CAPACITY];    // 기본 용량으로 레퍼런스 배열 만들기
  }

  public BoardList(int capacity) {
    if (capacity > DEFAULT_CAPACITY && capacity < 10000) {
      this.list = new Board[capacity];            // 사용자가 입력한 용량으로 레퍼런스 배열 만들기
    } else {
      this.list = new Board[DEFAULT_CAPACITY];
    }
  }

  /// 메서드 ///
  public void add(Board board) {
    if(this.size == this.list.length) {
      int oldCapacity = this.list.length;
      int newCapacity = oldCapacity + (oldCapacity >> 1);
//      Board[] arr = new Board[newCapacity];
//      for (int i = 0; i < this.list.length; i++) {
//        arr[i] = this.list[i];
//      }
//      this.list = arr;
      this.list = Arrays.copyOf(this.list, newCapacity);
      System.out.printf("새 배열을 %d 개로 생성하였음!\n", newCapacity);
    }
    this.list[this.size++] = board;     // board 인스턴스를 레퍼런스 배열에 저장
    
  }
  
  public Board[] toArray() {
//    Board[] arr = new Board[this.size]; // 저장된 객체 수만큼 레퍼런스 배열 생성   
//    for (int i = 0; i < this.size; i++) { // 새로 만든 레퍼런스 배열에 주소 복사
//      arr[i] = list[i];
//    }
//    return arr;
    return Arrays.copyOf(this.list, this.size);
  }

  public Board findBoard(int no) {
    for (int i = 0; i < this.size; i++) {  // 저장된 객체 수만큼 반복하며 번호가 같은 게시물 찾기
      if (this.list[i].getNo() == no) {
        return this.list[i];
      }
    }
    return null;
  }
}
