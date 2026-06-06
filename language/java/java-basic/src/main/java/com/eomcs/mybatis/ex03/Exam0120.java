// dynamic sql - <if>사용
package com.eomcs.mybatis.ex03;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Scanner;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;


public class Exam0120 {

  public static void main(String[] args) throws Exception {

    InputStream mybatisConfigInputStream = new FileInputStream(//
        "./bin/main/com/eomcs/mybatis/ex03/mybatis-config.xml");

    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory factory = sqlSessionFactoryBuilder.build(mybatisConfigInputStream);
    SqlSession sqlSession = factory.openSession();
    // dynamic sql?
    // => 조건에 따라 SQL을 달리 생성하는 것
    // => mybatis는 이를 위해 조건에 따라 SQL을 변경하거나,
    // 동일한 SQL을 반복적으로 생성할 수 있는 문법을 제공한다.

    // 실행 예:
    // => 사용자로부터 게시글의 번호를 입력받아 조회
    // 오류가 있다면 전체 게시글 출력

    Scanner keyScan = new Scanner(System.in);
    System.out.print("게시글 번호? ");
    String str = keyScan.nextLine();
    keyScan.close();
    List<Board> list = null;

    try {
      list = sqlSession.selectList("BoardMapper.select3", Integer.parseInt(str));
    } catch (Exception e) {
      list = sqlSession.selectList("BoardMapper.select3");
    }
    // Mapper파일에서 조건으로 SQL을 제어
    // => 조건에 따라 여러개의 SQL을 작성할 필요 없다.


    for (Board board : list) {
      System.out.printf("%d, %s, %s, %s\n", board.getNo(), board.getTitle(), board.getContent(),
          board.getRegisteredDate());
    }

    sqlSession.close();
  }

}


