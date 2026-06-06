// 서블릿 초기화 파라미터 - 애노테이션으로 설정하기
package com.eomcs.web.ex06;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

// 서블릿이 사용할 값을 DD 설정으로 지정할 수 있다.
//
@WebServlet(
    value="/ex06/s3",
    loadOnStartup=1,
    initParams={
        @WebInitParam(name="jdbc.driver", value="org.mariadb.jdbc.Driver"),
        @WebInitParam(name="jdbc.url", value="jdbc:mariadb://localhost/studydb"),
        @WebInitParam(name="jdbc.username", value="study"),
        @WebInitParam(name="jdbc.password", value="1111")
    } )
@SuppressWarnings("serial")
public class Servlet03 extends HttpServlet {

  //  @Override
  //  public void init(ServletConfig config) throws ServletException {
  //    // 서블릿 객체가 생성될 때 뭔가 준비하는 작업을 해야한다면
  //    // 보통 이 메서드를 오버라이딩 할 것이다.
  //    // 이 메서드가 호출될 때 넘어오는 값(config)을 인스턴스 필드에 보관했다가
  //    // 나중에 getServletConfig()가 호출될 때 리턴하도록 코드를 작성해야 한다.
  //    //
  //    // 이런 작업이 번거롭기 때문에,
  //    // GenericServlet은 미리 이 메서드에 해당 코드를 작성해 두었다.
  //    // 그리고 추가적으로 파라미터 값을 받지 않는 init()를 호출하도록 구현하였다.
  //    //
  //    // 결론?
  //    // => 서블릿 객체가 생성될 때 뭔가 작업을 수행하고 싶다면,
  //    // 이 메서드를 직접 오버라이딩 하지 말고, 이 메서드가 호출하는 다른 init()를 오버라이딩하라!
  //    super.init(config);
  //  }
  @Override
  public void init() throws ServletException {
    System.out.println("/ex06/s3 ==> init()");
    // 이 객체가 생성될 때 DB에 연결한다고 가정하자!
    // DB에 연결하려면 JDBC Driver 이름과 JDBC URL, 사용자 아이디, 암호를 알아야한다.
    //
    // 그런데 다음과 같이 자바 소스 코드에 그 값을 직접 작성하면,
    // 나중에 DB연결 정보가 바뀌었을 때 이 소스를 변경하고 다시 컴파일해야 하는 번거로움이 있다.
    // => 소스에 변할 수 있는 값을 작성하는 것은 바람직하지 않다.
    //    보통 이렇게 값을 직접 작성하는 것을 '하드코딩'이라 한다.
    // 서블릿 DD 설정 값을 꺼내려면 ServletConfig 객체가 있어야 한다.
    //    String jdbcDriver = "org.mariadb.jdbc.Driver";
    //    String jdbcUrl = "jdbc:mariadb://localhost:3306/studydb";
    //    String username = "study";
    //    String password = "1111";

    // 위의 코드처럼 언제든 변경될 수 있는 값을 소스코드에 직접 작성하는 방식은 좋지 않다.
    // 해결책?
    // 이런 값들을 외부에 따로 두는 것이 관리하기 좋다.
    // => 값이 바뀌더라도 소스를 변경할 필요가 없다.
    // 보통 DD파일(web.xml)에 둔다.
    // 다만, 애노테이션으로도 설정할 수 있다.
    // @WebServlet(
    //    value="/ex06/s3",
    //    loadOnStartup=1,
    //    initParams={
    //        @WebInitParam(name="jdbc.driver", value="org.mariadb.jdbc.Driver"),
    //        @WebInitParam(name="jdbc.url", value="jdbc:mariadb://localhost/studydb"),
    //        @WebInitParam(name="jdbc.username", value="study"),
    //        @WebInitParam(name="jdbc.password", value="1111")
    //    } )
    ServletConfig config = this.getServletConfig();

    // @WebInitParam()으로 설정된 값을 "서블릿 초기화 파라미터"라 부른다.
    // getInitParameter로 꺼낼 수 있다.
    String jdbcDriver = this.getInitParameter("jdbc.driver");
    String jdbcUrl = this.getInitParameter("jdbc.url");
    String username = this.getInitParameter("jdbc.username");
    String password = this.getInitParameter("jdbc.password");

    System.out.println(jdbcDriver);
    System.out.println(jdbcUrl);
    System.out.println(username);
    System.out.println(password);
  }
}

