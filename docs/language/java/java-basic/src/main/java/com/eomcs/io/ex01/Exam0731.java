// 활용 - 클래스 파일 이름을 출력할 때 패키지 이름을 포함하라.
package com.eomcs.io.ex01;

import java.io.File;
import java.io.FileFilter;

public class Exam0731 {


  public static void main(String[] args) throws Exception {
    File dir = new File("bin/main");
    System.out.println(dir.getCanonicalPath());

    printList(dir, "");


  }// end main

  static void printList(File dir, String packageName) {

    File[] files = dir.listFiles(new FileFilter() {
      @Override
      public boolean accept(File pathname) {
        if (pathname.isHidden()) {
          return false;
        }
        if (pathname.getName().contains("$")) {
          return false;
        }
        if (pathname.isDirectory() || pathname.isFile() && pathname.getName().endsWith(".class")) {
          return true;
        }
        return false;
      }
    });

    for (File f : files) {
      if(f.isDirectory()) {
        printList(f, packageName + "." + f.getName());
      } else {
        System.out.println(packageName + "." + f.getName().replace(".class", ""));
      }
    }
  }//end printList

}//end Exam0710


