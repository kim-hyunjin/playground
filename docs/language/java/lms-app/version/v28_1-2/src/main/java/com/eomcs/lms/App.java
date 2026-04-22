package com.eomcs.lms;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
import com.eomcs.lms.domain.Board;
import com.eomcs.lms.domain.Lesson;
import com.eomcs.lms.domain.Member;
import com.eomcs.lms.handler.BoardAddCommand;
import com.eomcs.lms.handler.BoardDeleteCommand;
import com.eomcs.lms.handler.BoardDetailCommand;
import com.eomcs.lms.handler.BoardListCommand;
import com.eomcs.lms.handler.BoardUpdateCommand;
import com.eomcs.lms.handler.Command;
import com.eomcs.lms.handler.ComputePlusCommand;
import com.eomcs.lms.handler.HelloCommand;
import com.eomcs.lms.handler.LessonAddCommand;
import com.eomcs.lms.handler.LessonDeleteCommand;
import com.eomcs.lms.handler.LessonDetailCommand;
import com.eomcs.lms.handler.LessonListCommand;
import com.eomcs.lms.handler.LessonUpdateCommand;
import com.eomcs.lms.handler.MemberAddCommand;
import com.eomcs.lms.handler.MemberDeleteCommand;
import com.eomcs.lms.handler.MemberDetailCommand;
import com.eomcs.lms.handler.MemberListCommand;
import com.eomcs.lms.handler.MemberUpdateCommand;
import com.eomcs.util.Prompt;

public class App {
  static Scanner keyboard = new Scanner(System.in);
  static Deque<String> commandStack = new ArrayDeque<>();
  static Queue<String> commandQueue = new LinkedList<>();
  static ArrayList<Lesson> lessonList = new ArrayList<>();
  static LinkedList<Member> memberList = new LinkedList<>();
  static LinkedList<Board> boardList = new LinkedList<>();

  public static void main(String[] args) {
    // 파일에서 데이터 로딩하기
    loadLessonData();
    loadMemberData();
    loadBoardData();
    Prompt prompt = new Prompt(keyboard);
    HashMap<String, Command> commandMap = new HashMap<>();

    commandMap.put("/lesson/add", new LessonAddCommand(prompt, lessonList));
    commandMap.put("/lesson/list", new LessonListCommand(lessonList));
    commandMap.put("/lesson/detail", new LessonDetailCommand(prompt, lessonList));
    commandMap.put("/lesson/update", new LessonUpdateCommand(prompt, lessonList));
    commandMap.put("/lesson/delete", new LessonDeleteCommand(prompt, lessonList));

    commandMap.put("/member/add", new MemberAddCommand(prompt, memberList));
    commandMap.put("/member/list", new MemberListCommand(memberList));
    commandMap.put("/member/detail", new MemberDetailCommand(prompt, memberList));
    commandMap.put("/member/update", new MemberUpdateCommand(prompt, memberList));
    commandMap.put("/member/delete", new MemberDeleteCommand(prompt, memberList));

    commandMap.put("/board/add", new BoardAddCommand(prompt, boardList));
    commandMap.put("/board/list", new BoardListCommand(boardList));
    commandMap.put("/board/detail", new BoardDetailCommand(prompt, boardList));
    commandMap.put("/board/update", new BoardUpdateCommand(prompt, boardList));
    commandMap.put("/board/delete", new BoardDeleteCommand(prompt, boardList));

    commandMap.put("/hello", new HelloCommand(prompt));
    commandMap.put("/compute/plus", new ComputePlusCommand(prompt));
    String command;

    while (true) {
      System.out.print("\n명령> ");
      command = keyboard.nextLine();
      if (command.length() == 0) {
        continue;
      } else if (command.equals("quit")) {
        System.out.println("bye");
        break;
      } else if (command.equals("history")) {
        printCommandHistory(commandStack.iterator());
        continue;
      } else if (command.equals("history2")) {
        printCommandHistory(commandQueue.iterator());
        continue;
      }
      commandStack.push(command);
      commandQueue.offer(command);
      Command commandHandler = commandMap.get(command);
      if (commandHandler != null) {
        try {
          commandHandler.execute();
        } catch (Exception e) {
          System.out.printf("명령어 실행 중 오류 발생! : %s\n", e.getMessage());
        }
      } else {
        System.out.println("실행할 수 없는 명령입니다.");
      }
    }
    keyboard.close();
    // 데이터를 파일에 저장
    saveLessonData();
    saveMemberData();
    saveBoardData();

  } // end main

  private static void printCommandHistory(Iterator<String> iterator) {
    int count = 0;
    while (iterator.hasNext()) {
      System.out.println(iterator.next());
      count++;
      if ((count % 5) == 0) {
        System.out.print(":");
        String str = keyboard.nextLine();
        if (str.equalsIgnoreCase("q")) {
          break;
        }
      }
    }
  }// end printCommandHistory()

  private static void loadLessonData() {
    File file = new File("./lesson.csv");
    // 파일을 읽을 때 사용할 도구를 준비한다.
    // .csv 파일에서 한 줄 단위로 문자열을 읽는 도구가 필요한데
    // FileReader에는 그런 기능이 없다.
    // 그래서 FileReader를 그대로 사용할 수 없고,
    // 이 객체에 Scanner를 연결하여 사용할 것이다.

    FileReader in = null;
    Scanner dataScan = null;
    try {
      in = new FileReader(file);
      dataScan = new Scanner(in);
      int count = 0;
      while (true) {
        try {
          lessonList.add(Lesson.valueOf(dataScan.nextLine()));
          count++;
        } catch (Exception e) {
          break;
        }
      }
      System.out.printf("총 %d 개의 수업 데이터를 로딩했습니다.\n", count);
    } catch (FileNotFoundException e) {
      System.out.println("파일 읽기 중 오류 발생! - " + e.getMessage());
      // 파일에서 데이터를 읽다가 오류가 발생하더라도
      // 시스템을 멈추지 않고 계속 실행하게 한다.
      // => 예외처리하는 이유
    } finally {
      // 자원이 서로 연결된 경우에는 다른 자원을 이용하는 객체부터 닫는다.
      try {
        dataScan.close();
      } catch (Exception e) {
        // Scanner 객체 닫다가 오류가 발생하더라도 무시한다.
      }
      try {
        in.close();
      } catch (Exception e) {
        // close() 실행 중 오류가 발생한 경우 무시한다.
        // 왜? 이때 발생하는 오류는 특별히 처리할 게 없다.
      }
    }
  } // end loadLessonData

  private static void saveLessonData() {
    File file = new File("./lesson.csv");
    // 파일에 데이터를 저장할 때 사용할 도구를 준비한다.
    FileWriter out = null;
    try {
      out = new FileWriter(file);
      int count = 0;
      // 수업 목록에서 수업 데이터를 꺼내 CSV 형식의 문자열로 만든다.
      for (Lesson lesson : lessonList) {
        out.write(lesson.toCsvString() + "\n");
        count++;
      }
      System.out.printf("총 %d개의 수업 데이터를 저장하였습니다. \n", count);
    } catch (IOException e) {
      System.out.println("파일 쓰기 중 오류 발생! " + e.getMessage());
    } finally {
      try {
        out.close();
      } catch (IOException e) {
        // FileWriter를 닫을 때 발생하는 예외는 무시한다.
      }
    }
  }// end saveLessonData

  private static void loadMemberData() {
    File file = new File("./member.csv");
    try (FileReader in = new FileReader(file); Scanner dataScan = new Scanner(in);) {
      int count = 0;
      while (true) {
        try {
          memberList.add(Member.valueOf(dataScan.nextLine()));
          count++;
        } catch (Exception e) {
          break;
        }
      }
      System.out.printf("총 %d 개의 회원 데이터를 로딩했습니다.\n", count);
    } catch (Exception e) {
      System.out.println("파일 읽기 중 오류 발생! - " + e.getMessage());
    }
  } // end loadMemberData

  private static void saveMemberData() {
    File file = new File("./member.csv");
    try (FileWriter out = new FileWriter(file);) {
      int count = 0;
      for (Member m : memberList) {
        out.write(m.toCsvString() + "\n");
        count++;
      }
      System.out.printf("총 %d개의 회원 데이터를 저장하였습니다. \n", count);
    } catch (IOException e) {
      System.out.println("파일 쓰기 중 오류 발생! " + e.getMessage());
    }
  }// end saveLessonData

  private static void loadBoardData() {
    File file = new File("./board.csv");
    try (FileReader in = new FileReader(file); Scanner dataScan = new Scanner(in);) {
      int count = 0;
      while (true) {
        try {
          boardList.add(Board.valueOf(dataScan.nextLine()));
          count++;
        } catch (Exception e) {
          break;
        }
      }
      System.out.printf("총 %d 개의 게시물 데이터를 로딩했습니다.\n", count);
    } catch (Exception e) {
      System.out.println("파일 읽기 중 오류 발생! - " + e.getMessage());
    }
  } // end loadBoardData

  private static void saveBoardData() {
    File file = new File("./board.csv");
    try (FileWriter out = new FileWriter(file);) {
      int count = 0;
      for (Board b : boardList) {
        out.write(b.toCsvString() + "\n");
        count++;
      }
      System.out.printf("총 %d개의 게시물 데이터를 저장하였습니다. \n", count);
    } catch (IOException e) {
      System.out.println("파일 쓰기 중 오류 발생! " + e.getMessage());
    }
  }// end saveLessonData

}// end App
