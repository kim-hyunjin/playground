package com.eomcs.lms.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.eomcs.lms.domain.Member;

@WebServlet("/header")
public class HeaderServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;

  @Override
  protected void service(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    resp.setContentType("test/html;charset=utf-8");
    PrintWriter out = resp.getWriter();

    out.println("<!DOCTYPE html>");
    out.println("<html>");
    out.println("<head>");
    out.println("<meta charset='UTF-8'>");
    out.println("<title>Bitcamp-LMS</title>");
    out.println(
        "<link rel='stylesheet' "
            + "href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' "
            + "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' "
            + "crossorigin='anonymous'>");
    out.println(
        "<script src=\"https://code.jquery.com/jquery-3.4.1.slim.min.js\" integrity=\"sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n\" crossorigin=\"anonymous\"></script>\r\n" +
            "<script src=\"https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js\" integrity=\"sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo\" crossorigin=\"anonymous\"></script>\r\n" +
        "<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js\" integrity=\"sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6\" crossorigin=\"anonymous\"></script>");
    out.println("<style>");
    out.println("body {");
    out.println("background-color: white;");
    out.println("}");
    out.println("div.container {");
    out.println("background-color: white;");
    out.println("border: 1px solid gray;");
    out.println("width: 600px;");
    out.println("}");
    out.println("</style>");
    out.println("</head>");
    out.println("<body>");
    out.println("<nav class='navbar navbar-expand-lg navbar-dark bg-dark'>");
    out.println("<a class='navbar-brand' href='../index.html'>비트캠프</a>");
    out.println("<button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>");
    out.println("<span class='navbar-toggler-icon'></span>");
    out.println("</button>");
    out.println("<div class='collapse navbar-collapse' id='navbarNav'>");
    out.println("<ul class='navbar-nav mr-auto'>");
    out.println("<li class='nav-item'>");
    out.println("<a class='nav-link' href='../board/list'>게시글</a>");
    out.println("</li>");
    out.println("<li class='nav-item'>");
    out.println("<a class='nav-link' href='../lesson/list'>수업</a>");
    out.println("</li>");
    out.println("<li class='nav-item'>");
    out.println("<a class='nav-link' href='../member/list'>회원</a>");
    out.println("</li>");
    out.println("</ul>");
    Member loginUser = (Member)req.getSession().getAttribute("loginUser");
    if(loginUser != null) {
      out.printf("<span class='navbar-brand mr-2'><a href='../member/detail?no=%s'>%s</a></span>\n",
          loginUser.getNo(), loginUser.getName());
      out.println("<a href='../auth/logout' class='btn btn-success btn-sm'>로그아웃</a>");
    } else {
      out.println("<a href='../auth/login' class='btn btn-success btn-sm'>로그인</a>");
    }
    out.println("</div>");
    out.println("</nav>");
    out.println("<div class='container'>");

  }
}
