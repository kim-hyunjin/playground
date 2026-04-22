package com.eomcs.lms;

import java.sql.Date;
import java.util.Scanner;

public class App {
  static Scanner keyboard = new Scanner(System.in);

  static class Lesson {
    int no;
    String title;
    String description;
    Date startDate;
    Date endDate;
    int totalHours;
    int dayHours;
  }
  static final int LESSON_SIZE = 100;
  static Lesson[] lessons = new Lesson[LESSON_SIZE];
  static int lessonCount = 0;

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

  static class Board {
    int no;
    String title;
    Date date;
    int viewCount;
  }
  static final int BOARD_SIZE = 100;
  static Board[] boards = new Board[BOARD_SIZE];
  static int boardCount = 0;
  
  public static void main(String[] args) {
    String command;
    do {
      System.out.print("\n명령> ");
      command = keyboard.nextLine();
      switch (command) {
        case "/lesson/add":
          //분리된 코드(메서드)를 실행(호출)시킨다.
          //메서드 호출; method call
          addLesson();
          break;
        case "/lesson/list": listLesson();
          break;
        case "/member/add": addMember();
          break;
        case "/member/list": listMember();
          break;
        case "/board/add": addBoard();
          break;
        case "/board/list": listBoard();
          break;
        default:
          if(!command.equalsIgnoreCase("quit")) {
            System.out.println("잘못된 명령입니다.");
          }
      }
    } while(!command.equalsIgnoreCase("quit"));

    System.out.println("안녕!");
    keyboard.close();

  }
  static void addLesson() {
    Lesson le = new Lesson(); 

    System.out.print("번호를 입력하세요 : ");
    le.no = keyboard.nextInt();
    keyboard.nextLine();

    System.out.print("수업명을 입력하세요 : ");
    le.title = keyboard.nextLine();

    System.out.print("설명을 입력하세요 : ");
    le.description = keyboard.nextLine();

    System.out.print("시작일을 입력하세요 : ");
    le.startDate = Date.valueOf(keyboard.next());
    keyboard.nextLine();

    System.out.print("종료일을 입력하세요 : ");
    le.endDate = Date.valueOf(keyboard.next());
    keyboard.nextLine();

    System.out.print("총수업시간을 입력하세요 : ");
    le.totalHours = keyboard.nextInt();
    keyboard.nextLine();

    System.out.print("일수업시간을 입력하세요 : ");
    le.dayHours = keyboard.nextInt();
    keyboard.nextLine();

    lessons[lessonCount++] = le;
    System.out.println("저장되었습니다.");
  }

  static void listLesson() {
    for (int i = 0; i < lessonCount; i++) {
      Lesson l = lessons[i];
      System.out.printf("%d, %s, %s ~ %s\n", 
          l.no, l.title, l.startDate, l.endDate);
    }
  }

  static void addMember() {
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

  static void listMember() {
    for (int i = 0; i < memberCount; i++) {
      Member m = members[i];
      System.out.printf("%d, %s, %s, %s, %s\n", m.no, m.name, m.email, m.tel, m.date);
    }
  }

  static void addBoard() {
    Board board = new Board();

    System.out.print("번호? ");
    board.no = keyboard.nextInt();
    keyboard.nextLine();

    System.out.print("내용? ");
    board.title = keyboard.nextLine();

    board.date = new Date(System.currentTimeMillis());
    board.viewCount = 0;

    boards[boardCount++] = board;
    System.out.println("저장되었습니다.");
  }

  static void listBoard() {
    for (int i = 0; i < boardCount; i++) {
      Board b = boards[i];
      System.out.printf("%d, %s, %s, %d\n", 
          b.no, b.title, b.date, b.viewCount);
    }
  }

}
