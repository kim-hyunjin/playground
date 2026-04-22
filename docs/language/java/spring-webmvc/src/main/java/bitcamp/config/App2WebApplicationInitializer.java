package bitcamp.config;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class App2WebApplicationInitializer
    extends AbstractAnnotationConfigDispatcherServletInitializer {
  // AnnotationConfigWebApplicationContext(ioc container)
  // 와 dispatcher servlet을 생성해준다.
  @Override
  protected Class<?>[] getRootConfigClasses() {
    return null;
  }

  @Override
  protected Class<?>[] getServletConfigClasses() {
    return new Class<?>[] {App2Config.class};
  }

  @Override
  protected String[] getServletMappings() {
    return new String[] {"/app2/*"};
  }

  @Override
  protected String getServletName() {
    return "app2";
  }
}


