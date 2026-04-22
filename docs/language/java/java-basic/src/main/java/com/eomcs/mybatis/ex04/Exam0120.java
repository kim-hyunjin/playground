// 조인 데이터를 한개의 객체에 담아 가져오기
package com.eomcs.mybatis.ex04;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Scanner;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;


public class Exam0120 {

  public static void main(String[] args) throws Exception {

    InputStream mybatisConfigInputStream = new FileInputStream(//
        "./bin/main/com/eomcs/mybatis/ex04/mybatis-config.xml");

    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory factory = sqlSessionFactoryBuilder.build(mybatisConfigInputStream);
    SqlSession sqlSession = factory.openSession();

    Scanner keyScan = new Scanner(System.in);
    System.out.print("번호? ");
    int no = Integer.parseInt(keyScan.nextLine());

    keyScan.close();

    Board board = sqlSession.selectOne("BoardMapper2.selectBoardWithFile", no);
    System.out.println();
    if (board != null) {
      System.out.println("[게시글 조회]");
      System.out.printf("번호: %d\n", board.getNo());
      System.out.printf("제목: %s\n", board.getTitle());
      System.out.printf("내용: %s\n", board.getContent());
      System.out.printf("등록일: %s\n", board.getRegisteredDate());
      System.out.printf("조회수: %d\n", board.getViewCount());
      System.out.println();

      System.out.println("[첨부파일]");
      for (AttachFile file : board.getFiles()) {
        if (file.getFilePath() != null) {
          System.out.printf("%d, %s\n", file.getNo(), file.getFilePath());
        } else {
          System.out.println("없음");
          break;
        }
      }
    } else {
      System.out.println("해당 번호의 게시글이 없습니다.");
    }
    sqlSession.close();
  }

}


