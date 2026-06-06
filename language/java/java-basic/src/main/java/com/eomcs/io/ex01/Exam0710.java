// 활용 - 지정한 폴더 및 그 하위 폴더까지 모두 검색하여 파일 및 디렉토리 이름을 출력하라.
package com.eomcs.io.ex01;

import java.io.File;

public class Exam0710 {
  Exam0710(int a, int b) {

  }


  public static void main(String[] args) throws Exception {
    // 결과 예)
    // /Users/bitcamp/git/test
    //   src/
    //     main/
    //       java/
    //         com/
    //           Hello.java
    //           Hello2.java
    //   build.gradle
    //   settings.gradle
    //   Hello.java

    File dir = new File(".");
    print(dir, 1);

  }
  static void print(File f, int level) {
    File[] files = f.listFiles();
    for(File file : files) {
      indent(level);
      if(file.isDirectory()) {
        System.out.printf("%s/\n", file.getName());
        print(file, level + 1);
      } else {
        System.out.printf("%s\n", file.getName());
      }
    }

  }//end print

  static void indent(int l) {
    for(int i = 0; i < l; i++) {
      System.out.print("  ");
    }
  }
}//end Exam0710


