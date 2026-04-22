package com.eomcs.lms;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
import com.eomcs.lms.domain.Board;
import com.eomcs.lms.domain.Lesson;
import com.eomcs.lms.domain.Member;
import com.eomcs.lms.handler.BoardHandler;
import com.eomcs.lms.handler.LessonHandler;
import com.eomcs.lms.handler.MemberHandler;
import com.eomcs.util.Prompt;

public class App {
  static Scanner keyboard = new Scanner(System.in);
  
  // java.util.Stack에서 제공하는 Iterator는 FIFO 방식으로 값을 꺼내준다.
  // LIFO방식으로 꺼내는 Iterator가 필요하다면. java.util.Deque 구현체를 사용하라.
  static Deque<String> commandStack = new ArrayDeque<>();
  static Queue<String> commandQueue = new LinkedList<>();

  public static void main(String[] args) {
    Prompt prompt = new Prompt(keyboard);
    LinkedList<Lesson> lessonList = new LinkedList<>();
    LessonHandler lessonHandler = new LessonHandler(prompt, lessonList);

    LinkedList<Member> memberList = new LinkedList<>();
    MemberHandler memberHandler = new MemberHandler(prompt, memberList);

    LinkedList<Board> boardList = new LinkedList<>();
    BoardHandler boardHandler = new BoardHandler(prompt, boardList);
    String command;

    do {
      System.out.print("\n명령> ");
      command = keyboard.nextLine();
      if (command.length() == 0) {
        continue;
      } else {
        commandStack.push(command);
        commandQueue.offer(command);
      }
      switch (command) {
        case "/lesson/add": lessonHandler.addLesson();
        break;
        case "/lesson/list": lessonHandler.listLesson();
        break;
        case "/lesson/detail": lessonHandler.detailLesson();
        break;
        case "/lesson/update": lessonHandler.updateLesson();
        break;
        case "/lesson/delete": lessonHandler.deleteLesson();
        break;
        case "/member/add": memberHandler.addMember();
        break;
        case "/member/list": memberHandler.listMember();
        break;
        case "/member/detail": memberHandler.detailMember();
        break;
        case "/member/update": memberHandler.updateMember();
        break;
        case "/member/delete": memberHandler.deleteMember();
        break;
        case "/board/add": boardHandler.addBoard();
        break;
        case "/board/list": boardHandler.listBoard();
        break;
        case "/board/detail": boardHandler.detailBoard();
        break;
        case "/board/update": boardHandler.updateBoard();
        break;
        case "/board/delete": boardHandler.deleteBoard();
        break;
        case "/history": printCommandHistory(commandStack.iterator());
        break;
        case "/history2": printCommandHistory(commandQueue.iterator());
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
  
  // 이전에는 Stack과 Queue에서 값을 꺼내는 방법이 달라
  // printCommandHistory(), printCommandHistory2() 메서드를 따로 정의했다.
  // 이제는 Stack과 Queue에 일관된 방식으로 값을 꺼내주는 Iterator가 있기 때문에
  // 두 메서드를 하나로 합칠 수 있다.
  private static void printCommandHistory(Iterator<String> iterator) {
    int count = 0;
    while(iterator.hasNext()) {
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
  }//end printCommandHistory()



}
