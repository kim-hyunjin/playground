// dynamic sql - <set> 사용법
package com.eomcs.mybatis.ex03;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Scanner;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;


public class Exam0230 {

  public static void main(String[] args) throws Exception {

    InputStream mybatisConfigInputStream = new FileInputStream(//
        "./bin/main/com/eomcs/mybatis/ex03/mybatis-config.xml");

    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory factory = sqlSessionFactoryBuilder.build(mybatisConfigInputStream);
    SqlSession sqlSession = factory.openSession();

    // 실행 예:
    // 제목만 바꿀경우, 내용만 바꿀경우, 둘다바꿀 경우에 대해
    // 한 개의 SQL을 이용하여 처리하기
    // => <set>과 <if>사용
    // <if> : 사용자가 입력한 항목만 변경
    // <set> : SQL문에 콤마(,)를 자동으로 제거한다.

    HashMap<String, Object> params = new HashMap<>();
    Scanner keyScan = new Scanner(System.in);

    System.out.print("번호? ");
    String no = keyScan.nextLine();
    if (no.length() > 0) {
      params.put("no", no);
    }

    System.out.print("제목? ");
    String value = keyScan.nextLine();
    if (value.length() > 0) {
      params.put("title", value);
    }

    System.out.print("내용? ");
    value = keyScan.nextLine();
    if (value.length() > 0) {
      params.put("content", value);
    }

    keyScan.close();

    int count = sqlSession.update("BoardMapper.update4", params);
    System.out.println(count);

    // dynamic sql을 사용하지 않으면,
    // 원하는 데이터만 변경하기가 번거롭다.


    sqlSession.commit();

    sqlSession.close();
  }

}


