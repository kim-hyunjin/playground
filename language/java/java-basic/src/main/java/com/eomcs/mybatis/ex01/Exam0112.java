// Data Persistence Framework 도입 - 간결하게 표현하기
package com.eomcs.mybatis.ex01;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class Exam0112 {

  public static void main(String[] args) throws Exception {

    SqlSession sqlSession = new SqlSessionFactoryBuilder()
        .build(Resources.getResourceAsStream("com/eomcs/mybatis/ex01/mybatis-config.xml"))
        .openSession();

    System.out.println("mybatis 준비 완료!");

    sqlSession.close();
  }

}


