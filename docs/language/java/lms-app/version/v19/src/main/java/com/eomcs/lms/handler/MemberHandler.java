package com.eomcs.lms.handler;

import java.sql.Date;
import java.util.Scanner;
import com.eomcs.lms.domain.Member;
import com.eomcs.util.ArrayList;

public class MemberHandler {
  ArrayList<Member> memberList;
  public Scanner input;

  public MemberHandler(Scanner input) {
    this.input = input;
    this.memberList = new ArrayList<>(); 
  }

  public MemberHandler(Scanner input, int capacity) {
    this.input = input;
    this.memberList = new ArrayList<>(capacity); 
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

    this.memberList.add(member);
    System.out.println("저장되었습니다.");
  }

  public void listMember() {
    // Member 객체의 목록을 저장할 배열을 넘기는데 크기가 0인 배열을 넘긴다.
    // toArray()는 내부에서 새 배열을 만들고, 값을 복사한 후 리턴한다.
    Member[] arr = this.memberList.toArray(new Member[] {});
    for (Member m : arr) {
      System.out.printf("%d, %s, %s, %s, %s\n", 
          m.getNo(), m.getName(), m.getEmail(), m.getTel(), m.getDate());
    }
  }

  public void updateMember() {
    System.out.print("번호? ");
    int no = Integer.parseInt(input.nextLine());
    
    int index = indexOfMember(no);

    Member oldMember = this.memberList.get(index);

    if (oldMember == null) {
      System.out.println("인덱스 번호가 유효하지 않습니다.");
      return;
    }

    Member newMember = new Member();
    newMember.setNo(oldMember.getNo());
    System.out.print("이름을 입력하세요: ");
    String name = input.nextLine();
    if (name.length() == 0) {
      newMember.setName(oldMember.getName());
    } else {
      newMember.setName(name);
    }
    System.out.print("이메일을 입력하세요: ");
    String email = input.nextLine();
    if (email.length() == 0) {
      newMember.setEmail(oldMember.getEmail());
    } else {
      newMember.setEmail(email);
    }
    System.out.print("암호를 입력하세요: ");
    String password = input.nextLine();
    if (password.length() == 0) {
      newMember.setPassword(oldMember.getPassword());
    } else {
      newMember.setPassword(password);
    }
    System.out.print("사진을 입력하세요: ");
    String photo = input.nextLine();
    if (photo.length() == 0) {
      newMember.setPhoto(oldMember.getPhoto());
    } else {
      newMember.setPhoto(photo);
    }
    System.out.print("전화번호를 입력하세요: ");
    String tel = input.nextLine();
    if (tel.length() == 0) {
      newMember.setTel(oldMember.getTel());
    } else {
      newMember.setTel(tel);
    }
    newMember.setDate(oldMember.getDate());

    this.memberList.set(index, newMember);
    System.out.println("회원 정보를 변경했습니다.");
  }

  public void deleteMember() {
    System.out.print("번호? ");
    int no = Integer.parseInt(input.nextLine());
    
    int index = indexOfMember(no);

    Member oldMember = this.memberList.get(index);

    if (oldMember == null) {
      System.out.println("인덱스 번호가 유효하지 않습니다.");
      return;
    }

    this.memberList.remove(index);
    System.out.println("회원 정보를 삭제했습니다.");
  }
  
  private int indexOfMember(int no) {
    for (int i = 0; i < this.memberList.getSize(); i++) {
      if (this.memberList.get(i).getNo() == no) {
        return i;
      }
    }
    return -1;
  }
}

