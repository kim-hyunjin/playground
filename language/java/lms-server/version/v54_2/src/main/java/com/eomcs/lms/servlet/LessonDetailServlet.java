package com.eomcs.lms.servlet;

import java.io.PrintStream;
import java.util.Map;
import org.springframework.stereotype.Component;
import com.eomcs.lms.domain.Lesson;
import com.eomcs.lms.service.LessonService;
import com.eomcs.util.RequestMapping;

@Component
public class LessonDetailServlet {

  LessonService lessonService;

  public LessonDetailServlet(LessonService lessonService) {
    this.lessonService = lessonService;
  }

  @RequestMapping("/lesson/detail")
  public void service(Map<String, String> params, PrintStream out) throws Exception {
    int no = Integer.parseInt(params.get("no"));
    Lesson lesson = lessonService.get(no);
    out.println("<!DOCTYPE html>");
    out.println("<html>");
    out.println("<head>");
    out.println("<meta charset='UTF-8'>");
    out.println("<title>수업 상세정보</title>");
    out.println("</head>");
    out.println("<body>");
    out.println("<h1>수업 상세정보</h1>");
    if (lesson != null) {
      out.printf("<p>번호: %d</p>\n", lesson.getNo());
      out.printf("<p>수업명: %s</p>\n", lesson.getTitle());
      out.printf("<p>설명: %s</p>\n", lesson.getDescription());
      out.printf("<p>시작일: %s</p>\n", lesson.getStartDate());
      out.printf("<p>종료일: %s</p>\n", lesson.getEndDate());
      out.printf("<p>총수업시간: %d</p>\n", lesson.getTotalHours());
      out.printf("<p>일수업시간: %d</p>\n", lesson.getDayHours());
      out.printf("<p><a href='/lesson/delete?no=%d'>삭제</a></p>", lesson.getNo());
      out.printf("<p><a href='/lesson/updateForm?no=%d'>수정</a></p>", lesson.getNo());
      out.printf("<p><a href='/photoBoard/list?lessonNo=%d'>사진</a></p>", lesson.getNo());
    } else {
      out.println("해당 번호의 강의가 없습니다.");
    }
    out.println("</body>");
    out.println("</html>");
  }
}
