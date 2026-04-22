package com.eomcs.lms.handler;

import java.sql.Date;
import com.eomcs.lms.domain.Board;
import com.eomcs.util.LinkedList;
import com.eomcs.util.List;
import com.eomcs.util.Prompt;

public class BoardHandler {
  /// 필드 ///
  // ArrayList나 LinkedList를 자유롭게 사용할 수 있도록
  // 게시물 목록을 관리하는 필드를 선언할 때
  // super클래스로 선언한다.
  // 대신 이 필드에 들어갈 객체는 생성자에서 파라미터로 받는다.
  // 이렇게 하면 ArrayList도 사용할 수 있고, LinkedList로도 사용할 수 있어
  // 선택의 폭이 넓어진다. 유지보수에 좋다.
  List<Board> boardList;
  Prompt prompt;

  /// 생성자 ///
  public BoardHandler(Prompt input, List<Board> list) {
    this.prompt = input;
    this.boardList = list;
    // 이렇게 Handler가 사용할 List객체(의존객체)를 생성자에서 직접 만들지 않고
    // 생성자가 호출될 때 파라미터로 받으면,
    // 필요에 따라 List 객체를 다른 객체로 대체하기 쉬워진다.
    //   ex) ArrayList => LinkedList, LinkedList => ArrayList
    // List의 하위객체라면 모두 가능.
    // 이런식으로 의존객체를 외부로부터 받는 방식을 Dependency Injection(DI)라 부른다.
    // => 즉 의존 객체를 부품화하여 교체하기 쉽도록 만드는 방식이다.
  }

  /// 메서드 ///
  public void addBoard() {
    Board board = new Board();
    board.setNo(prompt.inputInt("번호? "));
    board.setTitle(prompt.inputString("내용? "));
    board.setDate(new Date(System.currentTimeMillis()));
    board.setViewCount(0);
    this.boardList.add(board); 
    System.out.println("저장되었습니다.");
  }

  public void listBoard() {
    Board[] arr = new Board[this.boardList.size()];
    this.boardList.toArray(arr);
    for (Board b : arr) {
      System.out.printf("%d, %s, %s, %d\n", 
          b.getNo(), b.getTitle(), b.getDate(), b.getViewCount());
    }
  }

  public void detailBoard() {
    int index = indexOfBoard(prompt.inputInt("번호? "));
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
    int index = indexOfBoard(prompt.inputInt("번호? "));
    if (index == -1) {
      System.out.println("게시글 번호가 유효하지 않습니다.");
      return;
    }
    Board oldBoard = this.boardList.get(index);
    Board newBoard = new Board();
    newBoard.setNo(oldBoard.getNo());
    newBoard.setTitle(prompt.inputString("내용? ", oldBoard.getTitle()));
    newBoard.setViewCount(oldBoard.getViewCount());
    newBoard.setDate(new Date(System.currentTimeMillis()));
    this.boardList.set(index, newBoard);
    if (newBoard.equals(oldBoard)) {
      System.out.println("게시글 변경을 취소했습니다.");
    } else {
      System.out.println("게시글을 변경했습니다.");
    }
  }

  public void deleteBoard() {
    int index = indexOfBoard(prompt.inputInt("번호? "));
    if (index == -1) {
      System.out.println("게시글 번호가 유효하지 않습니다.");
      return;
    }
    this.boardList.remove(index);
    System.out.println("게시글을 삭제했습니다.");
  }

  private int indexOfBoard(int no) {
    for (int i = 0; i < this.boardList.size(); i++) {
      if (this.boardList.get(i).getNo() == no) {
        return i;
      }
    }
    return -1;
  }
}
