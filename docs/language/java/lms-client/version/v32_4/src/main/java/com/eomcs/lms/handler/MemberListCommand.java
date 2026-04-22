package com.eomcs.lms.handler;

import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.List;
import com.eomcs.lms.domain.Member;

public class MemberListCommand implements Command {

  ObjectOutputStream out;
  ObjectInputStream in;

  public MemberListCommand(ObjectOutputStream out, ObjectInputStream in) {
    this.out = out;
    this.in = in;
  }

  @Override
  public void execute() {
    try {
      out.writeUTF("/member/list");
      out.flush();
      String response = in.readUTF();
      if(response.equals("FAIL")) {
        System.out.println(in.readUTF());
        return;
      }
      @SuppressWarnings("unchecked")
      List<Member> members = (List<Member>) in.readObject();
      for (Member m : members) {
        System.out.printf("%d, %s, %s, %s, %s\n", m.getNo(), m.getName(), m.getEmail(), m.getTel(),
            m.getRegisteredDate());
      }
    }catch(Exception e) {
      System.out.println("명령 실행 중 에러 발생!");

    }
  }
}
