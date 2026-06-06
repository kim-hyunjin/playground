package com.eomcs.lms.handler;

import java.sql.Date;
import java.util.Scanner;

public class MemberHandler {
  static class Member {
    int no;
    String name;
    String email;
    String password;
    String photo;
    String tel;
    Date date;
  }
  static final int MEMBER_SIZE = 100;
  static Member[] members = new Member[MEMBER_SIZE];
  static int memberCount = 0;
  public static Scanner keyboard;
  
  public static void addMember() {
    Member member = new Member();
    System.out.print("번호를 입력하세요: ");
    member.no = keyboard.nextInt();
    keyboard.nextLine();
    System.out.print("이름을 입력하세요: ");
    member.name = keyboard.nextLine();
    System.out.print("이메일을 입력하세요: ");
    member.email = keyboard.nextLine();
    System.out.print("암호를 입력하세요: ");
    member.password = keyboard.nextLine();
    System.out.print("사진을 입력하세요: ");
    member.photo = keyboard.nextLine();
    System.out.print("전화번호를 입력하세요: ");
    member.tel = keyboard.nextLine();
    Date today = new Date(System.currentTimeMillis());
    member.date = today;
    members[memberCount++] = member;
    System.out.println("저장되었습니다.");
  }

  public static void listMember() {
    for (int i = 0; i < memberCount; i++) {
      Member m = members[i];
      System.out.printf("%d, %s, %s, %s, %s\n", m.no, m.name, m.email, m.tel, m.date);
    }
  }
}
