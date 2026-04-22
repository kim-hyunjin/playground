package com.eomcs.lms.web;

import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;
import com.eomcs.lms.domain.Member;
import com.eomcs.lms.service.MemberService;

@Controller
@RequestMapping("/auth")
public class AuthController {

  static Logger logger = LogManager.getLogger(AuthController.class);

  public AuthController() {
    logger.info("AuthController 객체 생성!");
  }

  @Autowired
  MemberService memberService;

  @GetMapping("form")
  public void form(HttpServletRequest request, Model model) {
    String email = "";
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if (cookie.getName().equals("email")) {
          email = cookie.getValue();
          break;
        }
      }
    }
    model.addAttribute("email", email);
  }

  @PostMapping("login")
  public void login(HttpServletRequest request, //
      String email, String password, String saveEmail) throws Exception {

    Cookie cookie = new Cookie("email", email);
    if (saveEmail != null) {
      cookie.setMaxAge(60 * 60 * 24 * 30);
    } else {
      cookie.setMaxAge(0);
    }

    // 프론트 컨트롤러가 쿠키를 응답헤더에 담을 수 있도록
    // 쿠키 바구니에 저장한다.
    @SuppressWarnings("unchecked")
    ArrayList<Cookie> cookies = (ArrayList<Cookie>) request.getAttribute("cookies");
    cookies.add(cookie);

    Member member = memberService.get(email, password);
    if (member != null) {
      request.getSession().setAttribute("loginUser", member);
      request.setAttribute("refreshUrl", "2;url=../../../index.html");
      // 인클루딩 되는 서블릿은 응답 헤더를 추가할 수 없다.
      // 따라서 프론트 컨트롤러에게 추가해달라고 요청해야 한다.
    } else {
      request.getSession().invalidate();
      request.setAttribute("refreshUrl", "2;url=login");
    }
  }

  @GetMapping("logout")
  public String logout(HttpServletRequest request) {
    request.getSession().invalidate();
    return "redirect:../../index.html";
  }

  @GetMapping("facebookLogin")
  public String facebookLogin(String accessToken, HttpSession session, Model model)
      throws Exception {

    // 액세스 토큰을 가지고 페이스북 서버에 사용자 정보를 요청한다.
    // 1)Facebook Graph API 실행
    // => JSON 또는 XML을 리턴하는 HTTP 요청 방법
    // 스프링에서 제공하는 RestTemplate 클래스를 사용하라.
    // JSON 또는 XML을 자바 객체로 자동 변환해주기 때문에 편리하다.
    RestTemplate restTemplate = new RestTemplate();

    // 2) 서버에 요청하기
    // 요청 URL, 서버가 응답한 JSON으로 만들 객체의 타입을 파라미터로 지정
    @SuppressWarnings("unchecked")
    Map<String, Object> response =
        restTemplate.getForObject("https://graph.facebook.com/v7.0/me?access_token={1}&fields={2}",
            Map.class, accessToken, "id, name, email");

    String email = (String) response.get("email");

    logger.info("페이스북 로그인 사용자 이메일 : " + email);

    if (email == null) {
      logger.info("페이스북 액세스 토큰이 무효함");
      // 액세스 토큰이 무효하다면, 다시 로그인 입력 폼으로 돌려보낸다.
      session.invalidate();
      model.addAttribute("refreshUrl", "2;url=form");
      return "auth/login";
    }

    // 페이스북에 정상적으로 로그인 되었다면, 현재 서버에 등록된 사용자를 이메일로 찾는다.
    Member member = memberService.get(email);
    if (member == null) {
      member = new Member();
      member.setEmail(email);
      member.setName(response.get("name").toString());
      member.setPassword(UUID.randomUUID().toString());
      memberService.add(member);
      logger.info("페이스북 사용자를 회원으로 등록한다.");
    }

    logger.info("세션에 로그인 사용자 정보를 보관한다.");
    session.setAttribute("loginUser", member);
    model.addAttribute("refreshUrl", "2;url=../../../index.html");
    return "auth/login";

  }
}
