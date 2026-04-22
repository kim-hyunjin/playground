package com.eomcs.lms.handler;

import java.sql.Date;
import java.util.Scanner;
import com.eomcs.lms.domain.Member;

public class MemberHandler {
  Member[] members;
  int memberCount = 0;
  static final int MEMBER_SIZE = 100;
  public Scanner input;
  
  public MemberHandler(Scanner input) {
    this.input = input;
    this.members = new Member[MEMBER_SIZE];
  }
  
  public void addMember() {
    Member member = new Member();
    System.out.print("번호를 입력하세요: ");
    member.setNo(input.nextInt());
    input.nextLine();
    System.out.print("이름을 입력하세요: ");
    member.setName(input.nextLine());
    System.out.print("이메일을 입력하세요: ");
    member.setEmail(input.nextLine());
    System.out.print("암호를 입력하세요: ");
    member.setPassword(input.nextLine());
    System.out.print("사진을 입력하세요: ");
    member.setPhoto(input.nextLine());
    System.out.print("전화번호를 입력하세요: ");
    member.setTel(input.nextLine());
    Date today = new Date(System.currentTimeMillis());
    member.setDate(today);
    this.members[this.memberCount++] = member;
    System.out.println("저장되었습니다.");
  }

  public void listMember() {
    for (int i = 0; i < this.memberCount; i++) {
      Member m = this.members[i];
      System.out.printf("%d, %s, %s, %s, %s\n", 
          m.getNo(), m.getName(), m.getEmail(), m.getTel(), m.getDate());
    }
  }
}
