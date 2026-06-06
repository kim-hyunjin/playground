// 클라이언트로 출력하기 - 한글 깨짐 현상 처리
package com.eomcs.web.ex03;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.GenericServlet;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebServlet;

@WebServlet("/ex03/s2")
public class Servlet02 extends GenericServlet {

  private static final long serialVersionUID = 1L;

  @Override
  public void service(ServletRequest req, ServletResponse res)
      throws ServletException, IOException {

    // 한글 깨짐 처리하기
    // => 출력 스트림을 꺼내기 전에 출력할 때 사용할 문자표(charset)를 지정하라.
    // => 반드시 출력 스트림을 얻기 전에 설정해야 한다.
    // res.setContentType("MIME Type;charset=문자표이름");
    // MIME Type?
    // Multipurpose Internet Mail Extensions
    // => 컨텐츠의 형식을 표현한다.
    // => 컨텐츠타입/상세타입
    // => ex) text/plain, text/css, text/html 등
    // 웹 브라우저는 MIME타입을 보고 컨텐츠를 어떤 방식으로 출력할지 결정한다.
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    //
    res.setContentType("text/plain;charset=UTF-8"); // UCS2(UTF-16) ==> UTF-8
    PrintWriter out = res.getWriter();
    out.println("Hello!");
    out.println("안녕하세요!");
    out.println("こんにちは");
    out.println("您好");
    out.println("مع السلامة؛ إلى اللقاء!");
  }
}


