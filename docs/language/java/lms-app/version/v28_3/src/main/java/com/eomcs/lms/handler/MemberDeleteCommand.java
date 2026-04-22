package com.eomcs.lms.handler;

import java.util.List;
import com.eomcs.lms.domain.Member;
import com.eomcs.util.Prompt;

public class MemberDeleteCommand implements Command {
  List<Member> memberList;
  public Prompt prompt;

  public MemberDeleteCommand(Prompt input, List<Member> list) {
    this.prompt = input;
    this.memberList = list;
  }

  @Override
  public void execute() {
    int index = indexOfMember(prompt.inputInt("번호? "));
    Member oldMember = this.memberList.get(index);
    if (oldMember == null) {
      System.out.println("번호가 유효하지 않습니다.");
      return;
    }
    this.memberList.remove(index);
    System.out.println("회원 정보를 삭제했습니다.");
  }

  private int indexOfMember(int no) {
    for (int i = 0; i < this.memberList.size(); i++) {
      if (this.memberList.get(i).getNo() == no) {
        return i;
      }
    }
    return -1;
  }
}

