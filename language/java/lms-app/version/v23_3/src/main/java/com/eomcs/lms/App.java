package com.eomcs.lms;

import java.util.Scanner;
import com.eomcs.lms.domain.Board;
import com.eomcs.lms.domain.Lesson;
import com.eomcs.lms.domain.Member;
import com.eomcs.lms.handler.BoardHandler;
import com.eomcs.lms.handler.LessonHandler;
import com.eomcs.lms.handler.MemberHandler;
import com.eomcs.util.AbstractList;
import com.eomcs.util.LinkedList;
import com.eomcs.util.Prompt;
import com.eomcs.util.Queue;
import com.eomcs.util.Stack;

public class App {
  static Scanner keyboard = new Scanner(System.in);
  static Stack<String> commandStack = new Stack<String>();
  static Queue<String> commandQueue = new Queue<>();

  public static void main(String[] args) {
    Prompt prompt = new Prompt(keyboard);
    
    // 단지 유지보수를 좋게 하기 위해 만든 클래스가 List이다.
    // 실제 작업을 하는 클래스가 아니다.
    // 그럼에도 List객체를 사용하려 한다면 막을 수 없다.
    // List<Board> boardList = new List<>();
    // 해결책?
    // generalization을 통해 만든 클래스는 대부분 상속하기 위한 용도로 사용된다.
    // 이런 종류의 클래스는 직접 인스턴스를 생성하지 못하도록 막아야 한다.
    // => 추상클래스(Abstract class).
    //
    // 추상클래스로 만들면, 다음과 같이 인스턴스를 생성할 수 없다.
    //AbstractList<Board> list = new AbstractList<>();
    
    // 반드시 추상 클래스를 상속받는 하위 객체를 정의해 사용해야 한다.
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
        case "/history": printCommandHistory();
        break;
        case "/history2": printCommandHistory2();
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

  private static void printCommandHistory() {
    Stack<String> historyStack = commandStack.clone();
    int count = 0;
    while (!historyStack.empty()) {
      System.out.println(historyStack.pop());
      count++;
      if ((count % 5) == 0) {
        System.out.print(":");
        String str = keyboard.nextLine();
        if (str.equalsIgnoreCase("q")) {
          break;
        }
      }
    }
  }
  
  private static void printCommandHistory2(){
    Queue<String> historyQueue = commandQueue.clone();
    int count = 0;
    while(historyQueue.size() > 0) {
      System.out.println(historyQueue.poll());
      count++;
      if ((count % 5) == 0) {
        System.out.print(":");
        String str = keyboard.nextLine();
        if (str.equalsIgnoreCase("q")) {
          break;
        }
      }
    }
  }


}
