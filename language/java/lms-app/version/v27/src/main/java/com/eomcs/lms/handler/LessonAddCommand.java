package com.eomcs.lms.handler;

import java.util.List;
import com.eomcs.lms.domain.Lesson;
import com.eomcs.util.Prompt;

public class LessonAddCommand implements Command {
  List<Lesson> lessonList;
  public Prompt prompt;

  public LessonAddCommand(Prompt prompt, List<Lesson> list) {
    this.prompt = prompt;
    this.lessonList = list;
  }

  @Override
  public void execute() {
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

}


