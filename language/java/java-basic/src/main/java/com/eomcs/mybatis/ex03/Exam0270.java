// dynamic sql - <foreach> 사용법3
package com.eomcs.mybatis.ex03;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;


public class Exam0270 {

  public static void main(String[] args) throws Exception {

    InputStream mybatisConfigInputStream = new FileInputStream(//
        "./bin/main/com/eomcs/mybatis/ex03/mybatis-config.xml");

    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory factory = sqlSessionFactoryBuilder.build(mybatisConfigInputStream);
    SqlSession sqlSession = factory.openSession();

    // 실행 예:
    // 여러 키워드로 검색하기

    HashMap<String, Object> params = new HashMap<>();
    Scanner keyScan = new Scanner(System.in);

    System.out.print("검색? ");
    String[] values = keyScan.nextLine().split(" ");

    ArrayList<Object> words = new ArrayList<>();
    for (String value : values) {
      words.add(value.trim());
    }
    params.put("words", words);
    keyScan.close();

    List<Board> list = sqlSession.selectList("BoardMapper.select25", params);

    for (Board board : list) {
      System.out.printf("%d, %s, %s, %s\n", board.getNo(), board.getTitle(), board.getContent(),
          board.getRegisteredDate());
    }

    sqlSession.close();
  }

}


