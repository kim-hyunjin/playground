// Mybatis - Update SQL 실행하기
package com.eomcs.mybatis.ex02;

import java.io.InputStream;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class Exam0250 {

  public static void main(String[] args) throws Exception {
    InputStream inputStream =
        Resources.getResourceAsStream("com/eomcs/mybatis/ex02/mybatis-config08.xml");
    SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(inputStream);

    SqlSession sqlSession = factory.openSession();

    // 변경할 데이터를 객체에 담아서 넘긴다.
    Board board = new Board();
    board.setNo(5);
    board.setTitle("update aaaa");
    board.setContent("bbbb");

    int count = sqlSession.update("BoardMapper.updateBoard", board);
    System.out.println(count);
    // mybatis에서는 autocommit이 기본으로 false이다.
    // autocommit?
    // => insert/update/delete 과 같이 데이터를 변경하는 작업은
    // 위험하기 때문에 DBMS의 임시 메모리에 그 작업 결과를 보관한다.
    // => 클라이언트에서 최종적으로 변경을 허락해야만 진짜 테이블에 값을 반영한다.
    //
    // mybatis에서는 다음 메서드를 호출하여 DBMS에게 작업 결과를
    // 진짜 테이블에 반영하라고 명령해야 한다.
    sqlSession.commit();
    // commit 명령을 내리지 않으면 insert/update/delete을 테이블에 반영하지 않는다.
    // close() 할 때 취소된다.

    // 용어 정리!
    // commit : 임시 메모리에 저장된 작업 결과를 실제 테이블에 반영시키는 명령
    // rollback : 임시 메모리에 저장된 작업 결과를 취소하는 명령

    sqlSession.close();
  }

}


