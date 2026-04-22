//
package bitcamp.app2;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/c06_2")
public class Controller06_2 {

  @GetMapping("error1")
  public void error1() throws Exception {
    throw new Exception("request handler 오류 발생!");
    // Request Handler에서 예외를 던졌을 때 처리 절차
    // 1) 페이지 컨트롤러 안 예외 처리기가 있다면
    // => 해당 메서드를 호출
    // 2) @ControllerAdvice 객체에 예외 처리기가 있다면,
    // => 해당 메서드를 호출
    // 3) web.xml에 지정된 오류 처리 기본 페이지가 설정되어 있다면,
    // => 해당 페이지를 실행
    // 4) 서블릿 컨테이너의 기본 오류 처리 페이지를 실행.
  }


}


