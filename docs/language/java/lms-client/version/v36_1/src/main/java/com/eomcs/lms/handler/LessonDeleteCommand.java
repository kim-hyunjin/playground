package com.eomcs.lms.handler;

import com.eomcs.lms.dao.LessonDao;
import com.eomcs.utils.Prompt;

public class LessonDeleteCommand implements Command {

  LessonDao lessonDao;
  Prompt prompt;

  public LessonDeleteCommand(LessonDao lessonDao, Prompt prompt) {
    this.lessonDao = lessonDao;
    this.prompt = prompt;
  }

  @Override
  public void execute() {
    try {
      int no = prompt.inputInt("번호? ");
      if (lessonDao.delete(no) > 0) {
        System.out.println("수업을 삭제했습니다.");
      } else {
        System.out.println("해당 번호의 강의가 없습니다.");
      }
    } catch (Exception e) {
      System.out.println("삭제 실패!");
    }
  }


}


