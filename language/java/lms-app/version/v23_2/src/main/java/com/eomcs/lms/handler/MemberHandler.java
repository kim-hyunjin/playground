package com.eomcs.lms.handler;

import java.sql.Date;
import com.eomcs.lms.domain.Member;
import com.eomcs.util.LinkedList;
import com.eomcs.util.AbstractList;
import com.eomcs.util.Prompt;

public class MemberHandler {
  // ArrayList나 LinkedList를 자유롭게 사용할 수 있도록
  // 게시물 목록을 관리하는 필드를 선언할 때
  // super클래스로 선언한다.
  // 대신 이 필드에 들어갈 객체는 생성자에서 파라미터로 받는다.
  // 이렇게 하면 ArrayList도 사용할 수 있고, LinkedList로도 사용할 수 있어
  // 선택의 폭이 넓어진다. 유지보수에 좋다.
  AbstractList<Member> memberList;
  public Prompt prompt;

  public MemberHandler(Prompt input, AbstractList<Member> list) {
    this.prompt = input;
    this.memberList = list; 
    // 이렇게 Handler가 사용할 List객체(의존객체)를 생성자에서 직접 만들지 않고
    // 생성자가 호출될 때 파라미터로 받으면,
    // 필요에 따라 List 객체를 다른 객체로 대체하기 쉬워진다.
    //   ex) ArrayList => LinkedList, LinkedList => ArrayList
    // List의 하위객체라면 모두 가능.
    // 이런식으로 의존객체를 외부로부터 받는 방식을 Dependency Injection(DI)라 부른다.
    // => 즉 의존 객체를 부품화하여 교체하기 쉽도록 만드는 방식이다.
  }

  public void addMember() {
    Member member = new Member();
    member.setNo(prompt.inputInt("번호? "));
    member.setName(prompt.inputString("이름? "));
    member.setEmail(prompt.inputString("이메일? "));
    member.setPassword(prompt.inputString("암호? "));
    member.setPhoto(prompt.inputString("사진? "));
    member.setTel(prompt.inputString("전화번호? "));
    member.setDate(new Date(System.currentTimeMillis()));
    this.memberList.add(member);
    System.out.println("저장되었습니다.");
  }

  public void listMember() {
    Member[] arr = this.memberList.toArray(new Member[] {});
    for (Member m : arr) {
      System.out.printf("%d, %s, %s, %s, %s\n", 
          m.getNo(), m.getName(), m.getEmail(), m.getTel(), m.getDate());
    }
  }

  public void detailMember() {
    int index = indexOfMember(prompt.inputInt("번호? "));
    if (index == -1) {
      System.out.println("해당 번호의 회원이 없습니다.");
      return;
    }
    Member member = this.memberList.get(index);
    System.out.printf("번호: %d\n", member.getNo());
    System.out.printf("이름: %s\n", member.getName());
    System.out.printf("이메일: %s\n", member.getEmail());
    System.out.printf("암호: %s\n", member.getPassword());
    System.out.printf("사진: %s\n", member.getPhoto());
    System.out.printf("전화: %s\n", member.getTel());
  }
  
  public void updateMember() {
    int index = indexOfMember(prompt.inputInt("번호? "));
    Member oldMember = this.memberList.get(index);
    if (oldMember == null) {
      System.out.println("번호가 유효하지 않습니다.");
      return;
    }
    Member newMember = new Member();
    newMember.setNo(oldMember.getNo());
    System.out.println("--- 수정사항을 입력하세요 ---");
    newMember.setName(prompt.inputString(String.format("이름(%s)? ", oldMember.getName()),
        oldMember.getName()));
    newMember.setEmail(prompt.inputString(String.format("이메일(%s)? ", oldMember.getEmail()),
        oldMember.getEmail()));
    newMember.setPassword(prompt.inputString(String.format("암호(%s)? ", oldMember.getPassword()),
        oldMember.getPassword()));
    newMember.setPhoto(prompt.inputString(String.format("사진(%s)? ", oldMember.getPhoto()),
        oldMember.getPhoto()));
    newMember.setTel(prompt.inputString(String.format("전화번호(%s)? ", oldMember.getTel()),
        oldMember.getTel()));
    newMember.setDate(oldMember.getDate());
    this.memberList.set(index, newMember);
    if (newMember.equals(oldMember)) {
      System.out.println("회원 정보 변경을 취소했습니다.");
    } else {
      System.out.println("회원 정보를 변경했습니다.");
    }
  }

  public void deleteMember() {
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

