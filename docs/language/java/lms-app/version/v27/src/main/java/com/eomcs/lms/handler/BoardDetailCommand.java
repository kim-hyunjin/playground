package com.eomcs.lms.handler;

import java.util.List;
import com.eomcs.lms.domain.Board;
import com.eomcs.util.Prompt;

public class BoardDetailCommand implements Command {
  List<Board> boardList;
  Prompt prompt;

  public BoardDetailCommand(Prompt input, List<Board> list) {
    this.prompt = input;
    this.boardList = list;
  }

  @Override
  public void execute() {
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

  private int indexOfBoard(int no) {
    for (int i = 0; i < this.boardList.size(); i++) {
      if (this.boardList.get(i).getNo() == no) {
        return i;
      }
    }
    return -1;
  }
}
