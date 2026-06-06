package com.eomcs.lms.handler;

import java.sql.Date;
import java.util.Scanner;
import com.eomcs.lms.domain.Lesson;

public class LessonHandler {
  
  LessonList lessonList;
  public Scanner input;
  
  public LessonHandler(Scanner input) {
    this.input = input;
    this.lessonList = new LessonList();
  }
  
  public LessonHandler(Scanner input, int capacity) {
    this.input = input;
    this.lessonList = new LessonList(capacity);
  }
  
  public void addLesson() {
    Lesson le = new Lesson(); 

    System.out.print("번호를 입력하세요 : ");
    le.setNo(input.nextInt());
    input.nextLine();
    System.out.print("수업명을 입력하세요 : ");
    le.setTitle(input.nextLine());
    System.out.print("설명을 입력하세요 : ");
    le.setDescription(input.nextLine());
    System.out.print("시작일을 입력하세요 : ");
    le.setStartDate(Date.valueOf(input.next()));
    input.nextLine();
    System.out.print("종료일을 입력하세요 : ");
    le.setEndDate(Date.valueOf(input.next()));
    input.nextLine();
    System.out.print("총수업시간을 입력하세요 : ");
    le.setTotalHours(input.nextInt());
    input.nextLine();
    System.out.print("일수업시간을 입력하세요 : ");
    le.setDayHours(input.nextInt());
    input.nextLine();
    
    lessonList.add(le);
    System.out.println("저장되었습니다.");
  }

  public void listLesson() {
    Lesson[] lessons = lessonList.toArray();
    for (Lesson l : lessons) {
      System.out.printf("%d, %s, %s ~ %s\n", 
          l.getNo(), l.getTitle(), l.getStartDate(), l.getEndDate());
    }
  }
}

