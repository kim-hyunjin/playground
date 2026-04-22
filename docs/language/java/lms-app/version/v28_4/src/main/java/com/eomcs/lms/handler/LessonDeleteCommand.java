package com.eomcs.lms.handler;

import java.util.List;
import com.eomcs.lms.domain.Lesson;
import com.eomcs.util.Prompt;

public class LessonDeleteCommand implements Command {
  List<Lesson> lessonList;
  public Prompt prompt;

  public LessonDeleteCommand(Prompt prompt, List<Lesson> list) {
    this.prompt = prompt;
    this.lessonList = list;
  }


  @Override
  public void execute() {
    int index = indexOfLesson(prompt.inputInt("번호? "));
    Lesson oldLesson = this.lessonList.get(index);
    if (oldLesson == null) {
      System.out.println("번호가 유효하지 않습니다.");
      return;
    }
    this.lessonList.remove(index);
    System.out.println("강의 정보를 삭제했습니다.");
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


