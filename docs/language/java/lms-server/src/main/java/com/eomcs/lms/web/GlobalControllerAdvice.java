package com.eomcs.lms.web;

import java.beans.PropertyEditorSupport;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.InitBinder;

// @ControllerAdvice
// => 이름에 이미 역할에 대한 정보가 담겨있다.
// => 페이지 컨트롤러를 실행할 때 충고하는 역할을 수행한다.
// 즉 프론트 컨트롤러가 페이지 컨트롤러의 request handler를 호출하기 전에
// 이 애노테이션이 붙은 클래스를 참고하여 적절한 메서드를 호출한다.
@ControllerAdvice
public class GlobalControllerAdvice {

  // 이 클래스에 프로퍼티 에디터를 등록하는 @InitBinder 메서드를 정의한다.
  @InitBinder
  public void initBinder(WebDataBinder binder) {

    DatePropertyEditor propEditor = new DatePropertyEditor();
    binder.registerCustomEditor(java.util.Date.class, propEditor);

  }

  class DatePropertyEditor extends PropertyEditorSupport {
    @Override
    public void setAsText(String text) throws IllegalArgumentException {
      try {
        setValue(java.sql.Date.valueOf(text));
      } catch (Exception e) {
        throw new IllegalArgumentException(e);
      }
    }
  }


}


