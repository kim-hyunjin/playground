// <sql> 태그 사용법
package com.eomcs.mybatis.ex03;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;


public class Exam0310 {

  public static void main(String[] args) throws Exception {

    InputStream mybatisConfigInputStream = new FileInputStream(//
        "./bin/main/com/eomcs/mybatis/ex03/mybatis-config.xml");

    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory factory = sqlSessionFactoryBuilder.build(mybatisConfigInputStream);
    SqlSession sqlSession = factory.openSession();

    // 실행 예:
    // 검색하기

    HashMap<String, Object> params = new HashMap<>();
    Scanner keyScan = new Scanner(System.in);

    System.out.print("제목? ");
    String value = keyScan.nextLine();
    params.put("title", value);
    keyScan.close();

    List<Board> list = sqlSession.selectList("BoardMapper2.select26", params);
    // <sql>태그를 사용하면
    // 여러 SQL 문에서 중복적으로 사용하는 SQL 일부를 별도로 관리할 수 있다.
    // 중복 SQL을 메서드처럼 사용하여 SQL을 관리하기가 쉬워진다.

    for (Board board : list) {
      System.out.printf("%d, %s, %s, %s\n", board.getNo(), board.getTitle(), board.getContent(),
          board.getRegisteredDate());
    }

    sqlSession.close();
  }

}


