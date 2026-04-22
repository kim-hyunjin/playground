package com.eomcs.lms.dao.mariadb;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import com.eomcs.lms.dao.MemberDao;
import com.eomcs.lms.domain.Member;

public class MemberDaoImpl implements MemberDao {

  Connection con;

  public MemberDaoImpl(Connection con) {
    this.con = con;
  }

  @Override
  public int insert(Member member) throws Exception {
    try (Statement stmt = con.createStatement()) {

      return stmt.executeUpdate("insert into lms_member(name, email, pwd, tel, photo) values('"//
          + member.getName() + "', '"//
          + member.getEmail() + "', '"//
          + member.getPassword() + "', '"//
          + member.getTel() + "', '"//
          + member.getPhoto() + "')");
    }
  }

  @Override
  public List<Member> findAll() throws Exception {
    try (Statement stmt = con.createStatement();

        ResultSet rs = stmt.executeQuery( //
            "select member_id, name, email, pwd, cdt, tel, photo from lms_member")) {

      List<Member> list = new ArrayList<>();
      // ResultSet 도구를 사용하여 데이터를 하나씩 가져온다.
      while (rs.next()) { // 데이터를 한 개 가져왔으면 true를 리턴한다.
        Member m = new Member();
        m.setNo(rs.getInt("member_id"));
        m.setName(rs.getString("name"));
        m.setPassword(rs.getString("pwd"));
        m.setEmail(rs.getString("email"));
        m.setRegisteredDate(rs.getDate("cdt"));
        m.setTel(rs.getString("tel"));
        m.setPhoto(rs.getString("photo"));
        list.add(m);
      }
      return list;
    }
  }

  @Override
  public Member findByNo(int no) throws Exception {
    try (Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(
            "select member_id, name, email, pwd, cdt, tel, photo from lms_member where member_id="
                + no)) {

      if (rs.next()) { // 데이터를 한 개 가져왔으면 true를 리턴한다.
        Member m = new Member();
        m.setNo(rs.getInt("member_id"));
        m.setName(rs.getString("name"));
        m.setPassword(rs.getString("pwd"));
        m.setEmail(rs.getString("email"));
        m.setRegisteredDate(rs.getDate("cdt"));
        m.setTel(rs.getString("tel"));
        m.setPhoto(rs.getString("photo"));
        return m;
      } else {
        return null;
      }
    }
  }

  @Override
  public int update(Member member) throws Exception {
    try (Statement stmt = con.createStatement()) {

      return stmt.executeUpdate("update lms_member set "//
          + "name='" + member.getName() + "', "//
          + "email='" + member.getEmail() + "', "//
          + "pwd='" + member.getPassword() + "', "//
          + "tel='" + member.getTel() + "', "//
          + "photo='" + member.getPhoto() + "' "//
          + "where member_id=" + member.getNo());
    }
  }

  @Override
  public int delete(int no) throws Exception {
    try (Statement stmt = con.createStatement()) {

      return stmt.executeUpdate("delete from lms_member where member_id=" + no);
    }
  }

}
