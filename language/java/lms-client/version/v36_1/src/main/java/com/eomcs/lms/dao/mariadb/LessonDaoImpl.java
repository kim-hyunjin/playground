package com.eomcs.lms.dao.mariadb;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import com.eomcs.lms.dao.LessonDao;
import com.eomcs.lms.domain.Lesson;

public class LessonDaoImpl implements LessonDao {

  @Override
  public int insert(Lesson lesson) throws Exception {
    Class.forName("org.mariadb.jdbc.Driver");
    try (
        // JDBC Driver를 이용하여 MariaDB 에 접속한다.
        Connection con = DriverManager.getConnection( //
            "jdbc:mariadb://localhost:3306/studydb", "study", "1111");

        // MariaDB에 명령을 전달할 객체 준비
        Statement stmt = con.createStatement()) {

      return stmt.executeUpdate("insert into lms_lesson(titl, conts, sdt, edt, tot_hr, day_hr)"
          + " values('" + lesson.getTitle() + "', '"//
          + lesson.getDescription() + "', '"//
          + lesson.getStartDate() + "', '"//
          + lesson.getEndDate() + "', '"//
          + lesson.getTotalHours() + "', '"//
          + lesson.getDayHours() + "')");
    }
  }

  @Override
  public List<Lesson> findAll() throws Exception {
    Class.forName("org.mariadb.jdbc.Driver");
    try (
        // JDBC Driver를 이용하여 MariaDB 에 접속한다.
        Connection con = DriverManager.getConnection( //
            "jdbc:mariadb://localhost:3306/studydb", "study", "1111");

        // MariaDB에 명령을 전달할 객체 준비
        Statement stmt = con.createStatement();

        // MariaDB의 lms_lesson 테이블에 있는 데이터를 가져올 도구를 준비
        ResultSet rs = stmt.executeQuery( //
            "select lesson_id, titl, conts, sdt, edt, tot_hr, day_hr from lms_lesson")) {

      List<Lesson> list = new ArrayList<>();
      // ResultSet 도구를 사용하여 데이터를 하나씩 가져온다.
      while (rs.next()) { // 데이터를 한 개 가져왔으면 true를 리턴한다.
        Lesson le = new Lesson();
        le.setNo(rs.getInt("lesson_id"));
        le.setTitle(rs.getString("titl"));
        le.setDescription(rs.getString("conts"));
        le.setStartDate(rs.getDate("sdt"));
        le.setEndDate(rs.getDate("edt"));
        le.setTotalHours(rs.getInt("tot_hr"));
        le.setDayHours(rs.getInt("day_hr"));
        list.add(le);
      }
      return list;
    }
  }

  @Override
  public Lesson findByNo(int no) throws Exception {
    Class.forName("org.mariadb.jdbc.Driver");
    try (
        // JDBC Driver를 이용하여 MariaDB 에 접속한다.
        Connection con = DriverManager.getConnection( //
            "jdbc:mariadb://localhost:3306/studydb", "study", "1111");

        // MariaDB에 명령을 전달할 객체 준비
        Statement stmt = con.createStatement();

        // MariaDB의 lms_lesson 테이블에 있는 데이터를 가져올 도구를 준비
        ResultSet rs = stmt.executeQuery( //
            "select lesson_id, titl, conts, sdt, edt, tot_hr, day_hr from lms_lesson where lesson_id="
                + no)) {

      // ResultSet 도구를 사용하여 데이터를 하나씩 가져온다.
      if (rs.next()) { // 데이터를 한 개 가져왔으면 true를 리턴한다.
        Lesson le = new Lesson();
        le.setNo(rs.getInt("lesson_id"));
        le.setTitle(rs.getString("titl"));
        le.setDescription(rs.getString("conts"));
        le.setStartDate(rs.getDate("sdt"));
        le.setEndDate(rs.getDate("edt"));
        le.setTotalHours(rs.getInt("tot_hr"));
        le.setDayHours(rs.getInt("day_hr"));
        return le;
      } else {
        return null;
      }
    }
  }

  @Override
  public int update(Lesson lesson) throws Exception {
    Class.forName("org.mariadb.jdbc.Driver");
    try (
        // JDBC Driver를 이용하여 MariaDB 에 접속한다.
        Connection con = DriverManager.getConnection( //
            "jdbc:mariadb://localhost:3306/studydb", "study", "1111");

        // MariaDB에 명령을 전달할 객체 준비
        Statement stmt = con.createStatement()) {

      return stmt.executeUpdate("update lms_lesson set "//
          + "titl='" + lesson.getTitle() + "', "//
          + "conts='" + lesson.getDescription() + "', "//
          + "sdt='" + lesson.getStartDate() + "', "//
          + "edt='" + lesson.getEndDate() + "', "//
          + "tot_hr='" + lesson.getTotalHours() + "', "//
          + "day_hr='" + lesson.getDayHours() + "' "//
          + "where lesson_id=" + lesson.getNo());
    }
  }

  @Override
  public int delete(int no) throws Exception {
    Class.forName("org.mariadb.jdbc.Driver");
    try (
        // JDBC Driver를 이용하여 MariaDB 에 접속한다.
        Connection con = DriverManager.getConnection( //
            "jdbc:mariadb://localhost:3306/studydb", "study", "1111");

        // MariaDB에 명령을 전달할 객체 준비
        Statement stmt = con.createStatement()) {

      return stmt.executeUpdate("delete from lms_lesson where lesson_id=" + no);
    }
  }

}
