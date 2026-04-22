package com.eomcs.lms.handler;

import com.eomcs.util.Prompt;

// "/hello" 명령어 처리
public class HelloCommand implements Command {
  Prompt prompt;

  public HelloCommand(Prompt input) {
    this.prompt = input;
  }

  @Override
  public void execute() {
    String name = prompt.inputString("이름? ");

    System.out.printf("%s님 반갑습니다!\n", name);
  }
}
