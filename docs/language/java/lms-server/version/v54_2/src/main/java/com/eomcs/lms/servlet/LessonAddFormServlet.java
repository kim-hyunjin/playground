package com.eomcs.lms.servlet;

import java.io.PrintStream;
import java.util.Map;
import org.springframework.stereotype.Component;
import com.eomcs.util.RequestMapping;

@Component
public class LessonAddFormServlet {

  @RequestMapping("/lesson/addForm")
  public void service(Map<String, String> params, PrintStream out) throws Exception {
    out.println("<!DOCTYPE html>");
    out.println("<html>");
    out.println("<head>");
    out.println("<meta charset='UTF-8'>");
    out.println("<title>수업 등록</title>");
    out.println("</head>");
    out.println("<body>");
    out.println("<form action='/lesson/add'>");
    out.println("제목<br><input type='text' name='title'/><br>");
    out.println("내용<br><textarea name='description' rows='5' cols='60'></textarea><br>");
    out.println("시작일<br><input type='date' name='startDate'/><br>");
    out.println("종료일<br><input type='date' name='endDate'/><br>");
    out.println("총수업시간<br><input type='number' name='totalHours'/><br>");
    out.println("일수업시간<br><input type='number' name='dayHours'/><br>");
    out.println("<button>제출</button>");
    out.println("</form>");
    out.println("</body>");
    out.println("</html>");
  }
}
