// AOP(Aspect-Oriented Programming) - AOP 필터 적용 위치
package com.eomcs.spring.ioc.ex13.c;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import com.eomcs.spring.ioc.SpringUtils;

public class Exam01 {

  public static void main(String[] args) {
    ClassPathXmlApplicationContext iocContainer =
        new ClassPathXmlApplicationContext("com/eomcs/spring/ioc/ex13/c/application-context.xml");

    SpringUtils.printBeanList(iocContainer);

    try {
      Caller caller = iocContainer.getBean(Caller.class);
      caller.test();
    } catch (Exception e) {
      System.err.println("오류 발생!");
    }
  }

}


