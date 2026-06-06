// Mybatis - delete SQL 실행하기
package com.eomcs.mybatis.ex02;

import java.io.InputStream;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class Exam0260 {

  public static void main(String[] args) throws Exception {
    InputStream inputStream =
        Resources.getResourceAsStream("com/eomcs/mybatis/ex02/mybatis-config09.xml");
    SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(inputStream);

    SqlSession sqlSession = factory.openSession();
    int count1 = sqlSession.delete("BoardMapper.deleteBoardFile", 3);
    int count2 = sqlSession.delete("BoardMapper.deleteBoard", 3);
    System.out.println(count1);
    System.out.println(count2);

    sqlSession.commit();

    sqlSession.close();
  }

}


