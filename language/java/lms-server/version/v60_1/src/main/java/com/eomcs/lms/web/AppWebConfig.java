package com.eomcs.lms.web;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import org.springframework.web.servlet.view.tiles3.TilesConfigurer;
import org.springframework.web.servlet.view.tiles3.TilesView;

// AppWebApplicationInitializer가 설정하는
// DispatcherServlet(/app/* 요청처리)의 IoC 컨테이너를 위한 설정이다.
@ComponentScan(value = "com.eomcs.lms.web")
@EnableWebMvc
public class AppWebConfig {

  static Logger logger = LogManager.getLogger(AppWebConfig.class);

  public AppWebConfig() {
    logger.debug("AppWebConfig 객체 생성!");
  }

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
    InternalResourceViewResolver vr = new InternalResourceViewResolver("/WEB-INF/jsp/", // prefix
        ".jsp"); // suffix
    vr.setOrder(2);
    return vr; // => prefix + 페이지 컨트롤러 리턴 값 + suffix
  }

  @Bean
  public ViewResolver tilesViewResolver() {
    UrlBasedViewResolver vr = new UrlBasedViewResolver();

    // 타일즈 설정에 따라 템플릿을 처리할 뷰 처리기를 등록한다.
    vr.setViewClass(TilesView.class);
    // View Resolver의 우선순위를 InternalResourceViewResolver 보다 우선하게 한다.
    vr.setOrder(1);
    return vr;
  }

  @Bean
  public TilesConfigurer tilesConfigurer() {
    TilesConfigurer configurer = new TilesConfigurer();
    configurer.setDefinitions("/WEB-INF/defs/tiles.xml");
    return configurer;
  }

}


