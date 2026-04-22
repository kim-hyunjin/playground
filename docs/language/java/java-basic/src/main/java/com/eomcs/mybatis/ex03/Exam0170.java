// dynamic sql - <where> 사용 후
package com.eomcs.mybatis.ex03;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;


public class Exam0170 {

  public static void main(String[] args) throws Exception {

    InputStream mybatisConfigInputStream = new FileInputStream(//
        "./bin/main/com/eomcs/mybatis/ex03/mybatis-config.xml");

    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory factory = sqlSessionFactoryBuilder.build(mybatisConfigInputStream);
    SqlSession sqlSession = factory.openSession();

    // 실행 예:
    // => 사용자로부터 검색 키워드를 입력받아 조회한다.
    // 번호, 제목, 내용을 입력받아 동시에 검색

    HashMap<String, Object> params = new HashMap<>();
    Scanner keyScan = new Scanner(System.in);

    System.out.print("번호? ");
    String value = keyScan.nextLine();
    if (value.length() > 0) {
      params.put("no", value);
    }

    System.out.print("제목? ");
    value = keyScan.nextLine();
    if (value.length() > 0) {
      params.put("title", value);
    }

    System.out.print("내용? ");
    value = keyScan.nextLine();
    if (value.length() > 0) {
      params.put("content", value);
    }

    keyScan.close();


    List<Board> list = null;

    list = sqlSession.selectList("BoardMapper.select8", params);
    // <where>대신 <trim>사용


    for (Board board : list) {
      System.out.printf("%d, %s, %s, %s\n", board.getNo(), board.getTitle(), board.getContent(),
          board.getRegisteredDate());
    }

    sqlSession.close();
  }

}


