package com.eomcs.lms.handler;

import java.util.List;
import com.eomcs.lms.domain.Member;
import com.eomcs.util.Prompt;

public class MemberUpdateCommand implements Command {
  List<Member> memberList;
  public Prompt prompt;

  public MemberUpdateCommand(Prompt input, List<Member> list) {
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
    Member newMember = new Member();
    newMember.setNo(oldMember.getNo());
    System.out.println("--- 수정사항을 입력하세요 ---");
    newMember.setName(
        prompt.inputString(String.format("이름(%s)? ", oldMember.getName()), oldMember.getName()));
    newMember.setEmail(
        prompt.inputString(String.format("이메일(%s)? ", oldMember.getEmail()), oldMember.getEmail()));
    newMember.setPassword(prompt.inputString(String.format("암호(%s)? ", oldMember.getPassword()),
        oldMember.getPassword()));
    newMember.setPhoto(
        prompt.inputString(String.format("사진(%s)? ", oldMember.getPhoto()), oldMember.getPhoto()));
    newMember.setTel(
        prompt.inputString(String.format("전화번호(%s)? ", oldMember.getTel()), oldMember.getTel()));
    newMember.setDate(oldMember.getDate());
    this.memberList.set(index, newMember);
    if (newMember.equals(oldMember)) {
      System.out.println("회원 정보 변경을 취소했습니다.");
    } else {
      System.out.println("회원 정보를 변경했습니다.");
    }
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

