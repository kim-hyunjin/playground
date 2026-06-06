package com.eomcs.lms.handler;

import com.eomcs.lms.domain.Lesson;
import com.eomcs.util.LinkedList;
import com.eomcs.util.List;
import com.eomcs.util.Prompt;

public class LessonHandler {
  /// 필드 ///
  // ArrayList나 LinkedList를 자유롭게 사용할 수 있도록
  // 게시물 목록을 관리하는 필드를 선언할 때
  // super클래스로 선언한다.
  // 대신 이 필드에 들어갈 객체는 생성자에서 파라미터로 받는다.
  // 이렇게 하면 ArrayList도 사용할 수 있고, LinkedList로도 사용할 수 있어
  // 선택의 폭이 넓어진다. 유지보수에 좋다.
  List<Lesson> lessonList;
  public Prompt prompt;
  
  /// 생성자 ///
  public LessonHandler(Prompt prompt, List<Lesson> list) {
    this.prompt = prompt;
    this.lessonList = list;
    // 이렇게 Handler가 사용할 List객체(의존객체)를 생성자에서 직접 만들지 않고
    // 생성자가 호출될 때 파라미터로 받으면,
    // 필요에 따라 List 객체를 다른 객체로 대체하기 쉬워진다.
    //   ex) ArrayList => LinkedList, LinkedList => ArrayList
    // List의 하위객체라면 모두 가능.
    // 이런식으로 의존객체를 외부로부터 받는 방식을 Dependency Injection(DI)라 부른다.
    // => 즉 의존 객체를 부품화하여 교체하기 쉽도록 만드는 방식이다.
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


