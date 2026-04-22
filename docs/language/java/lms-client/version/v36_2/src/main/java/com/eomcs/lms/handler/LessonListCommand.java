package com.eomcs.lms.handler;

import java.util.List;
import com.eomcs.lms.dao.LessonDao;
import com.eomcs.lms.domain.Lesson;

public class LessonListCommand implements Command {

  LessonDao lessonDao;

  public LessonListCommand(LessonDao lessonDao) {
    this.lessonDao = lessonDao;
  }

  @Override
  public void execute() {
    try {
      List<Lesson> lessons = lessonDao.findAll();

      for (Lesson le : lessons) { // 데이터를 한 개 가져왔으면 true를 리턴한다.
        System.out.printf("%d, %s, %s, %s~%s, %d, %d\n", //
            le.getNo(), //
            le.getTitle(), //
            le.getDescription(), //
            le.getStartDate(), //
            le.getEndDate(), //
            le.getTotalHours(), //
            le.getDayHours()//
        );
      }
    } catch (Exception e) {
      System.out.println("목록조회 실패!");
    }

  }
}


