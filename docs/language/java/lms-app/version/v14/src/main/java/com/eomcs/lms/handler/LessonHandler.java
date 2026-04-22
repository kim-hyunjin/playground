package com.eomcs.lms.handler;

import java.sql.Date;
import java.util.Scanner;
import com.eomcs.lms.domain.Lesson;

public class LessonHandler {
  
  Lesson[] lessons;
  int lessonCount = 0;
  static final int LESSON_SIZE = 100;
  public Scanner input;
  
  public LessonHandler(Scanner input) {
    this.input = input;
    this.lessons = new Lesson[LESSON_SIZE];
  }
  
  public void addLesson() {
    Lesson le = new Lesson(); 

    System.out.print("번호를 입력하세요 : ");
    le.no = input.nextInt();
    input.nextLine();
    System.out.print("수업명을 입력하세요 : ");
    le.title = input.nextLine();
    System.out.print("설명을 입력하세요 : ");
    le.description = input.nextLine();
    System.out.print("시작일을 입력하세요 : ");
    le.startDate = Date.valueOf(input.next());
    input.nextLine();
    System.out.print("종료일을 입력하세요 : ");
    le.endDate = Date.valueOf(input.next());
    input.nextLine();
    System.out.print("총수업시간을 입력하세요 : ");
    le.totalHours = input.nextInt();
    input.nextLine();
    System.out.print("일수업시간을 입력하세요 : ");
    le.dayHours = input.nextInt();
    input.nextLine();
    this.lessons[this.lessonCount++] = le;
    System.out.println("저장되었습니다.");
  }

  public void listLesson() {
    for (int i = 0; i < this.lessonCount; i++) {
      Lesson l = this.lessons[i];
      System.out.printf("%d, %s, %s ~ %s\n", 
          l.no, l.title, l.startDate, l.endDate);
    }
  }
}

