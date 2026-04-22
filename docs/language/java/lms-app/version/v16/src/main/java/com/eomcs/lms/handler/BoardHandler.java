package com.eomcs.lms.handler;

import java.sql.Date;
import java.util.Scanner;
import com.eomcs.lms.domain.Board;

public class BoardHandler {
  /// 필드 ///
  BoardList boardList;
  Scanner input;
  
  /// 생성자 ///
  public BoardHandler(Scanner input) {
    this.input = input;
    this.boardList = new BoardList(); /// BoardList에서 Board 레퍼런스배열을 만들고 주소를 넘겨준다. 
  }

  public BoardHandler(Scanner input, int capacity) {
    this.input = input;
    this.boardList = new BoardList(capacity);
  }

  /// 메서드 ///
  public void addBoard() {
    Board board = new Board(); // 값을 입력받을 객체 생성
    System.out.print("번호? ");
    board.setNo(input.nextInt());
    input.nextLine();
    System.out.print("내용? ");
    board.setTitle(input.nextLine());
    board.setDate(new Date(System.currentTimeMillis()));
    board.setViewCount(0);
    
    this.boardList.add(board); // 값을 넣은 객체를 레퍼런스배열에 저장
    System.out.println("저장되었습니다.");
  }

  public void listBoard() {
    Board[] boards = this.boardList.toArray(); // 값이 저장된 객체들을 배열로 받기
    for (Board b : boards) {
      System.out.printf("%d, %s, %s, %d\n", 
          b.getNo(), b.getTitle(), b.getDate(), b.getViewCount());
    }
  }

  public void detailBoard() {
    System.out.print("게시물 번호? ");
    int no = input.nextInt();
    input.nextLine();
    
    Board board = this.boardList.findBoard(no);
    
    if (board == null) {
      System.out.println("게시물 번호가 유효하지 않습니다.");
      return;
    }
    System.out.printf("번호: %d\n", board.getNo());
    System.out.printf("제목: %s\n", board.getTitle());
    System.out.printf("등록일: %s\n", board.getDate());
    System.out.printf("조회수: %d\n", board.getViewCount());
  }
}
