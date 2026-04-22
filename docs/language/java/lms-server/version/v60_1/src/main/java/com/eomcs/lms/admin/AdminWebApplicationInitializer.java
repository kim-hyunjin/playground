package com.eomcs.lms.admin;

import java.io.File;
import javax.servlet.Filter;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;
import com.eomcs.lms.AppConfig;

public class AdminWebApplicationInitializer
    extends AbstractAnnotationConfigDispatcherServletInitializer {

  String uploadTmpDir;

  public AdminWebApplicationInitializer() {
    uploadTmpDir = new File(System.getProperty("java.io.tmpdir")).getAbsolutePath();
    System.out.println("업로드 임시 폴더: " + uploadTmpDir);
  }

  @Override
  protected Class<?>[] getRootConfigClasses() {
    return new Class<?>[] {AppConfig.class};
  }

  @Override
  protected Class<?>[] getServletConfigClasses() {
    return new Class<?>[] {AdminWebConfig.class};
  }

  @Override
  protected Filter[] getServletFilters() {
    return new Filter[] {new CharacterEncodingFilter("UTF-8")};
  }

  @Override
  protected String[] getServletMappings() {
    return new String[] {"/admin/*"};
  }

  @Override
  protected String getServletName() {
    return "admin";
  }

}
