// list() 메서드 변경
// => toArray()의 리턴값을 사용하는 대신 iterator()의 리턴값을 사용하여
//    목록 출력!

package com.eomcs.lms.handler;

import java.sql.Date;
import com.eomcs.lms.domain.Board;
import com.eomcs.util.Iterator;
import com.eomcs.util.List;
import com.eomcs.util.Prompt;

public class BoardHandler {
  /// 필드 ///
  List<Board> boardList;
  Prompt prompt;

  /// 생성자 ///
  public BoardHandler(Prompt input, List<Board> list) {
    this.prompt = input;
    this.boardList = list;
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
    Iterator<Board> iterator = boardList.iterator();
    while(iterator.hasNext()) {
      Board b = iterator.next();    
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
