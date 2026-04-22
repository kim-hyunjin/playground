// 인덱스가 아닌 번호로 객체를 찾는 코드를 관리하기 쉽게 별도의 메서드로 분리한다.
// => indexOfBoard(int) 메서드 추가
//
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
    System.out.print("번호? ");
    int no = Integer.parseInt(input.nextLine());
    
    // 게시글 번호로 객체를 찾는다.
    int index = indexOfBoard(no);
    
    if (index == -1) {
      System.out.println("게시글 번호가 유효하지 않습니다.");
      return;
    }
    
    Board b = this.boardList.get(index);
    System.out.printf("번호: %d\n", b.getNo());
    System.out.printf("제목: %s\n", b.getTitle());
    System.out.printf("등록일: %s\n", b.getDate());
    System.out.printf("조회수: %d\n", b.getViewCount());
  }
  
  public void updateBoard() {
    System.out.print("번호? ");
    int no = Integer.parseInt(input.nextLine());
    
    int index = indexOfBoard(no);
    
    if (index == -1) {
      System.out.println("게시글 번호가 유효하지 않습니다.");
      return;
    }
    
    Board old = this.boardList.get(index);
    
    System.out.printf("내용(%s)? ", old.getTitle());
    String title = input.nextLine();
    
    if (title.length() == 0) {
      System.out.println("게시글 변경을 취소하였습니다.");
      return;
    }
    
    Board newBoard = new Board();
    newBoard.setNo(old.getNo());
    newBoard.setTitle(title);
    newBoard.setViewCount(old.getViewCount());
    newBoard.setDate(new Date(System.currentTimeMillis()));
    
    this.boardList.set(index, newBoard);
    System.out.println("게시글을 변경했습니다.");
  }
  
  public void deleteBoard() {
    System.out.print("번호? ");
    int no = Integer.parseInt(input.nextLine());
    
    int index = indexOfBoard(no);
    if (index == -1) {
      System.out.println("게시글 번호가 유효하지 않습니다.");
      return;
    }
    this.boardList.remove(index);
    System.out.println("게시글을 삭제했습니다.");
  }
  
  private int indexOfBoard(int no) {
    for (int i = 0; i < this.boardList.getSize(); i++) {
      if (this.boardList.get(i).getNo() == no) {
        return i;
      }
    }
    return -1;
  }
}
