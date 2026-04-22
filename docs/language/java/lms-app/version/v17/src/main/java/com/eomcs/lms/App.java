package com.eomcs.lms;

import java.util.Scanner;
import com.eomcs.lms.handler.BoardHandler;
import com.eomcs.lms.handler.LessonHandler;
import com.eomcs.lms.handler.MemberHandler;

public class App {
  static Scanner keyboard = new Scanner(System.in);

  public static void main(String[] args) {
    
    LessonHandler 정규수업 = new LessonHandler(keyboard);
    MemberHandler 일반회원 = new MemberHandler(keyboard);
    BoardHandler 게시판1 = new BoardHandler(keyboard);
    
    String command;
    do {
      System.out.print("\n명령> ");
      command = keyboard.nextLine();
      switch (command) {
        case "/lesson/add": 정규수업.addLesson();
        break;
        case "/lesson/list": 정규수업.listLesson();
        break;
        case "/member/add": 일반회원.addMember();
        break;
        case "/member/list": 일반회원.listMember();
        break;
        case "/board/add": 게시판1.addBoard();
        break;
        case "/board/list": 게시판1.listBoard();
        break;
        case "/board/detail": 게시판1.detailBoard();
        break;
        default:
          if(!command.equalsIgnoreCase("quit")) {
            System.out.println("잘못된 명령입니다.");
          }
      }
    } while(!command.equalsIgnoreCase("quit"));

    System.out.println("bye!");
    keyboard.close();

  }
}
