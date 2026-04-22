package com.eomcs.lms.servlet;

import java.io.PrintStream;
import java.util.Map;
import org.springframework.stereotype.Component;
import com.eomcs.lms.domain.Lesson;
import com.eomcs.lms.service.LessonService;
import com.eomcs.util.RequestMapping;

@Component
public class LessonUpdateFormServlet {

  LessonService lessonService;

  public LessonUpdateFormServlet(LessonService lessonService) {
    this.lessonService = lessonService;
  }

  @RequestMapping("/lesson/updateForm")
  public void service(Map<String, String> params, PrintStream out) throws Exception {
    int no = Integer.parseInt(params.get("no"));
    Lesson lesson = lessonService.get(no);

    out.println("<!DOCTYPE html>");
    out.println("<html>");
    out.println("<head>");
    out.println("<meta charset='UTF-8'>");
    out.println("<title>수업 수정</title>");
    out.println("</head>");
    out.println("<body>");
    out.println("<h1>수업 수정 결과</h1>");
    out.println("<form action='/lesson/update'>");
    out.printf("번호 : <input readonly type='text' name='no' value='%d'><br>", lesson.getNo());
    out.printf("제목<br><input type='text' name='title' value='%s'/><br>", lesson.getTitle());
    out.printf("내용<br><textarea name='description' value='%s' rows='5' cols='60'></textarea><br>",
        lesson.getDescription());
    out.printf("시작일<br><input type='date' name='startDate' value='%s'/><br>",
        lesson.getStartDate());
    out.printf("종료일<br><input type='date' name='endDate' value='%s'/><br>", lesson.getEndDate());
    out.printf("총수업시간<br><input type='number' name='totalHours' value='%d'/><br>",
        lesson.getTotalHours());
    out.printf("일수업시간<br><input type='number' name='dayHours' value='%d'/><br>",
        lesson.getDayHours());
    out.println("<button>제출</button>");
    out.println("</form>");
    out.println("</body>");
    out.println("</html>");
  }
}
