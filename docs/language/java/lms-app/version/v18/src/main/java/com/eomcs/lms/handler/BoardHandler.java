package com.eomcs.lms.handler;

import java.sql.Date;
import java.util.Scanner;
import com.eomcs.lms.domain.Board;
import com.eomcs.util.ArrayList;

public class BoardHandler {
  /// 필드 ///
  ArrayList<Board> boardList;
  Scanner input;
  
  /// 생성자 ///
  public BoardHandler(Scanner input) {
    this.input = input;
    this.boardList = new ArrayList<>(); ///
  }

  public BoardHandler(Scanner input, int capacity) {
    this.input = input;
    this.boardList = new ArrayList<>(capacity);
  }

  /// 메서드 ///
  public void addBoard() {
    Board board = new Board();
    System.out.print("번호? ");
    board.setNo(input.nextInt());
    input.nextLine();
    System.out.print("내용? ");
    board.setTitle(input.nextLine());
    board.setDate(new Date(System.currentTimeMillis()));
    board.setViewCount(0);
    
    this.boardList.add(board); 
    System.out.println("저장되었습니다.");
  }

  public void listBoard() {
    // BoardList에 보관된 값을 받을 배열을 준비한다. 
    Board[] arr = new Board[this.boardList.getSize()];
    // toArray()에게 빈 배열을 넘겨서 복사한다.
    this.boardList.toArray(arr);
    for (Board b : arr) {
      System.out.printf("%d, %s, %s, %d\n", 
          b.getNo(), b.getTitle(), b.getDate(), b.getViewCount());
    }
  }

  public void detailBoard() {
    System.out.print("게시물 인덱스? ");
    int index = input.nextInt();
    input.nextLine();
    
    Board board = this.boardList.get(index);
    
    if (board == null) {
      System.out.println("인덱스 번호가 유효하지 않습니다.");
      return;
    }
    System.out.printf("번호: %d\n", board.getNo());
    System.out.printf("제목: %s\n", board.getTitle());
    System.out.printf("등록일: %s\n", board.getDate());
    System.out.printf("조회수: %d\n", board.getViewCount());
  }
}
