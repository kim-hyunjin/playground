package com.eomcs.lms.handler;

import java.util.List;
import com.eomcs.lms.domain.Lesson;
import com.eomcs.util.Prompt;

public class LessonUpdateCommand implements Command {
  List<Lesson> lessonList;
  public Prompt prompt;

  public LessonUpdateCommand(Prompt prompt, List<Lesson> list) {
    this.prompt = prompt;
    this.lessonList = list;
  }

  @Override
  public void execute() {
    int index = indexOfLesson(prompt.inputInt("번호? "));
    Lesson oldLesson = this.lessonList.get(index);
    if (index == -1) {
      System.out.println("번호가 유효하지 않습니다.");
      return;
    }
    Lesson newLesson = new Lesson();
    newLesson.setNo(oldLesson.getNo());
    System.out.println("--- 수정사항을 입력하세요 ---");
    newLesson.setTitle(
        prompt.inputString(String.format("수업명(%s)? ", oldLesson.getTitle()), oldLesson.getTitle()));
    newLesson.setDescription(prompt.inputString("설명? ", oldLesson.getDescription()));
    newLesson.setStartDate(prompt.inputString(String.format("시작일(%s)? ", oldLesson.getStartDate()),
        oldLesson.getStartDate()));
    newLesson.setEndDate(prompt.inputString(String.format("종료일(%s)? ", oldLesson.getEndDate()),
        oldLesson.getEndDate()));
    newLesson.setTotalHours(prompt.inputInt(String.format("총수업시간(%s)? ", oldLesson.getTotalHours()),
        oldLesson.getTotalHours()));
    newLesson.setDayHours(prompt.inputInt(String.format("일수업시간(%s)? ", oldLesson.getDayHours()),
        oldLesson.getDayHours()));
    this.lessonList.set(index, newLesson);
    if (newLesson.equals(oldLesson)) {
      System.out.println("수업 변경을 취소했습니다.");
    } else {
      System.out.println("강의 정보를 변경했습니다.");
    }
  }

  private int indexOfLesson(int no) {
    for (int i = 0; i < this.lessonList.size(); i++) {
      if (this.lessonList.get(i).getNo() == no) {
        return i;
      }
    }
    return -1;
  }
}


