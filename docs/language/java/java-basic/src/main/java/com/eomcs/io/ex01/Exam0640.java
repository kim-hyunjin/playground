// 익명 클래스로 파일 필터 만들기
package com.eomcs.io.ex01;

import java.io.File;
import java.io.FileFilter;

public class Exam0640 {


  public static void main(String[] args) throws Exception {
    File dir = new File(".");

    // 익명 클래스를 정의할 때
    // 객체를 사용할 위치에 익명클래스를 정의하는 것이 코드를 읽기 쉽게 한다.
    File[] files = dir.listFiles(new FileFilter() {
      @Override
      public boolean accept(File file) {
        if (file.isFile() && file.getName().endsWith(".java"))
          return true; // 조회 결과에 포함시켜라!
        return false; // 조회 결과에서 제외하라!
      }
    });

    for (File file : files) {
      System.out.printf("%s %12d %s\n", file.isDirectory() ? "d" : "-", file.length(),
          file.getName());
    }

  }

}


