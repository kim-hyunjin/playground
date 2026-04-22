package com.eomcs.lms.handler;

import com.eomcs.lms.domain.Lesson;
import com.eomcs.util.LinkedList;
import com.eomcs.util.Prompt;

public class LessonHandler {
  /// 필드 ///
  LinkedList<Lesson> lessonList;
  public Prompt prompt;
  
  /// 생성자 ///
  public LessonHandler(Prompt prompt) {
    this.prompt = prompt;
    this.lessonList = new LinkedList<>();
  }

  /// 메서드 ///
  public void addLesson() {
    Lesson le = new Lesson(); 
    le.setNo(prompt.inputInt("번호? "));
    le.setTitle(prompt.inputString("수업명? "));
    le.setDescription(prompt.inputString("설명? "));
    le.setStartDate(prompt.inputString("시작일? "));
    le.setEndDate(prompt.inputString("종료일? "));
    le.setTotalHours(prompt.inputInt("총수업시간? "));
    le.setDayHours(prompt.inputInt("일수업시간? "));
    lessonList.add(le);
    System.out.println("저장되었습니다.");
  }

  public void listLesson() {
    Lesson[] arr = this.lessonList.toArray(new Lesson[this.lessonList.size()]);
    for (Lesson l : arr) {
      System.out.printf("%d, %s, %s ~ %s\n", 
          l.getNo(), l.getTitle(), l.getStartDate(), l.getEndDate());
    }
  }
  
  public void detailLesson() {
    int index = indexOfLesson(prompt.inputInt("번호? "));
    if (index == -1) {
      System.out.println("번호가 유효하지 않습니다.");
      return;
    }
    Lesson lesson = this.lessonList.get(index);
    System.out.printf("번호: %d\n", lesson.getNo());
    System.out.printf("수업명: %s\n", lesson.getTitle());
    System.out.printf("설명: %s\n", lesson.getDescription());
    System.out.printf("시작일: %s\n", lesson.getStartDate());
    System.out.printf("종료일: %s\n", lesson.getEndDate());
    System.out.printf("총수업시간: %d\n", lesson.getTotalHours());
    System.out.printf("일수업시간: %d\n", lesson.getDayHours());
  }

  public void updateLesson() {
    int index = indexOfLesson(prompt.inputInt("번호? "));
    Lesson oldLesson = this.lessonList.get(index);
    if (index == -1) {
      System.out.println("번호가 유효하지 않습니다.");
      return;
    }
    Lesson newLesson = new Lesson();
    newLesson.setNo(oldLesson.getNo());
    System.out.println("--- 수정사항을 입력하세요 ---");
    newLesson.setTitle(prompt.inputString(
        String.format("수업명(%s)? ", oldLesson.getTitle()), oldLesson.getTitle()));
    newLesson.setDescription(prompt.inputString("설명? ", oldLesson.getDescription()));
    newLesson.setStartDate(prompt.inputString(
        String.format("시작일(%s)? ", oldLesson.getStartDate()), oldLesson.getStartDate()));
    newLesson.setEndDate(prompt.inputString(
        String.format("종료일(%s)? ", oldLesson.getEndDate()), oldLesson.getEndDate()));
    newLesson.setTotalHours(prompt.inputInt(
        String.format("총수업시간(%s)? ", oldLesson.getTotalHours()), oldLesson.getTotalHours()));
    newLesson.setDayHours(prompt.inputInt(
        String.format("일수업시간(%s)? ", oldLesson.getDayHours()), oldLesson.getDayHours()));
    this.lessonList.set(index, newLesson);
    if (newLesson.equals(oldLesson)) {
      System.out.println("수업 변경을 취소했습니다.");
    } else {
      System.out.println("강의 정보를 변경했습니다.");
    }
  }

  public void deleteLesson() {
    int index = indexOfLesson(prompt.inputInt("번호? "));
    Lesson oldLesson = this.lessonList.get(index);
    if (oldLesson == null) {
      System.out.println("번호가 유효하지 않습니다.");
      return;
    }
    this.lessonList.remove(index);
    System.out.println("강의 정보를 삭제했습니다.");
  }

  /// 리팩토링을 위해 만든 메서드 ///
  private int indexOfLesson(int no) {
    for (int i = 0; i < this.lessonList.size(); i++) {
      if (this.lessonList.get(i).getNo() == no) {
        return i;
      }
    }
    return -1;
  }
}


