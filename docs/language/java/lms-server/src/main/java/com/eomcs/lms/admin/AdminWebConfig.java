package com.eomcs.lms.admin;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

// AppWebApplicationInitializer가 설정하는
// DispatcherServlet(/admin/* 요청처리)의 IoC 컨테이너를 위한 설정이다.
@ComponentScan(value = "com.eomcs.lms.admin")
@EnableWebMvc
public class AdminWebConfig {

  static Logger logger = LogManager.getLogger(AdminWebConfig.class);

  public AdminWebConfig() {
    logger.debug("AdminWebConfig 객체 생성!");
  }

  // Spring IoC 컨테이너에 수동으로 객체를 등록하고 싶다면,
  // 그 객체를 만들어 주는 팩토리 메서드를 정의해야 한다.
  // => 단 메서드 선언부에 @Bean 애노테이션을 붙여야 한다.
  // => 그래야만 Spring IoC 컨테이너는
  // 이 메서드를 호출하고 그 리턴 값을 보관한다.
  @Bean
  public MultipartResolver multipartResolver() {
    // 스프링 방식으로 파일 업로드를 처리하고 싶다면,
    // 이 메서드를 통해 MultipartResolver 구현체를 등록해야 한다.
    // 그래야 request handler가 MultipartFile 객체를 받을 수 있다.
    CommonsMultipartResolver mr = new CommonsMultipartResolver();
    mr.setMaxUploadSize(10000000);
    mr.setMaxInMemorySize(2000000);
    mr.setMaxUploadSizePerFile(5000000);
    return mr;
  }

  @Bean
  public ViewResolver viewResolver() {
    InternalResourceViewResolver vr = new InternalResourceViewResolver("/WEB-INF/admin/", // prefix
        ".jsp"); // suffix
    return vr; // => prefix + 페이지 컨트롤러 리턴 값 + suffix
  }

}


