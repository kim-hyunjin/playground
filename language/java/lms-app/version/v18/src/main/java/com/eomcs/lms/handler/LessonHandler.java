package com.eomcs.lms.handler;

import java.sql.Date;
import java.util.Scanner;
import com.eomcs.lms.domain.Lesson;
import com.eomcs.util.ArrayList;

public class LessonHandler {
  
  ArrayList<Lesson> lessonList;
  public Scanner input;
  
  public LessonHandler(Scanner input) {
    this.input = input;
    this.lessonList = new ArrayList<>();
  }
  
  public LessonHandler(Scanner input, int capacity) {
    this.input = input;
    this.lessonList = new ArrayList<>(capacity);
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
    le.setStartDate(input.nextLine());
    System.out.print("종료일을 입력하세요 : ");
    le.setEndDate(input.nextLine());
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
    // 수업 객체 목록을 받을 배열을 준비하고, toArray()를 실행한다.
    // toArray()의 리턴 값은 파라미터로 넘겨준 배열의 주소이다.
    Lesson[] arr = this.lessonList.toArray(new Lesson[this.lessonList.getSize()]);
    for (Lesson l : arr) {
      System.out.printf("%d, %s, %s ~ %s\n", 
          l.getNo(), l.getTitle(), l.getStartDate(), l.getEndDate());
    }
  }
}

