package com.eomcs.lms.handler;

import java.sql.Date;
import java.util.Scanner;
import com.eomcs.lms.domain.Lesson;

public class LessonHandler {
  static final int LESSON_SIZE = 100;
  static Lesson[] lessons = new Lesson[LESSON_SIZE];
  static int lessonCount = 0;
//다른 패키지에 있는 클래스에서도 이 변수를 사용하게 하려면 공개해야 한다.
  public static Scanner keyboard;
  
  public static void addLesson() {
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

  public static void listLesson() {
    for (int i = 0; i < lessonCount; i++) {
      Lesson l = lessons[i];
      System.out.printf("%d, %s, %s ~ %s\n", 
          l.no, l.title, l.startDate, l.endDate);
    }
  }
}

