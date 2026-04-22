package com.eomcs.lms.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.context.ApplicationContext;
import com.eomcs.lms.domain.Board;
import com.eomcs.lms.service.BoardService;

@WebServlet("/board/add")
public class BoardAddServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {

    resp.setContentType("text/html;charset=UTF-8");
    PrintWriter out = resp.getWriter();
    req.getRequestDispatcher("/header").include(req, resp);
    out.println("<h1>게시물 입력</h1>");
    out.println("<form action='add' method='post'>");
    out.println("내용:<br>");
    out.println("<textarea name='title' rows='5' cols='60'></textarea><br>");
    out.println("<button>등록</button>");
    out.println("</form>");
    req.getRequestDispatcher("/footer").include(req, resp);
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    try {
      req.setCharacterEncoding("UTF-8");

      ServletContext servletContext = getServletContext();
      ApplicationContext iocContainer =
          (ApplicationContext) servletContext.getAttribute("iocContainer");

      BoardService boardService = iocContainer.getBean(BoardService.class);

      Board board = new Board();
      board.setTitle(req.getParameter("title"));
      boardService.add(board);

      // 작업을 완료한 후 다른 페이지로 가라고 클라이언트에게 URL을 보낸다.
      resp.sendRedirect("list");
      // => 이 URL은 웹브라우저가 사용한다.
      // => 따라서 URL이 /로 시작하면 서버 루트를 의미한다.
      // => URL이 /로 시작하지 않으면 상대 경로를 의미한다.
      // 상대경로란?
      // 리다이렉트 메시지를 받기 전의 URL(/bitcamp-project-server/board/add)을 기준으로 계산한 경로이다.
      // => (/bitcamp-project-server/board/list)
    } catch (Exception e) {
      req.setAttribute("error", e);
      req.setAttribute("url", "list");
      req.getRequestDispatcher("/error").forward(req, resp);
    }
  }
}
