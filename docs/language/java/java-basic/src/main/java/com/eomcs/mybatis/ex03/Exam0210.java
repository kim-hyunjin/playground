// dynamic sql - <choose> 사용 법
package com.eomcs.mybatis.ex03;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;


public class Exam0210 {

  public static void main(String[] args) throws Exception {

    InputStream mybatisConfigInputStream = new FileInputStream(//
        "./bin/main/com/eomcs/mybatis/ex03/mybatis-config.xml");

    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory factory = sqlSessionFactoryBuilder.build(mybatisConfigInputStream);
    SqlSession sqlSession = factory.openSession();

    // 실행 예:
    // => 사용자로부터 검색 키워드를 입력받아 조회한다.
    // 제목, 내용, 번호로 검색하기

    Scanner keyScan = new Scanner(System.in);
    System.out.print("항목(1:번호, 2:제목, 그 외:내용)? ");
    String item = keyScan.nextLine();
    System.out.print("검색어? ");
    String keyword = keyScan.nextLine();

    keyScan.close();

    // SQL mapper에 여러개의 파라미터 값을 넘길때 주로 Map을 사용한다.
    HashMap<String, Object> params = new HashMap<>();
    if (item.equals("1")) {
      params.put("no", keyword);
    } else if (item.equals("2")) {
      params.put("title", keyword);
    } else {
      params.put("keyword", keyword);
    }

    List<Board> list = null;

    list = sqlSession.selectList("BoardMapper.select21", params);


    for (Board board : list) {
      System.out.printf("%d, %s, %s, %s\n", board.getNo(), board.getTitle(), board.getContent(),
          board.getRegisteredDate());
    }

    sqlSession.close();
  }

}


