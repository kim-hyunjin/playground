package com.eomcs.lms;

import java.sql.Date;
import java.util.Scanner;

public class LessonHandler {
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
  static Scanner keyboard;
  
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
}

