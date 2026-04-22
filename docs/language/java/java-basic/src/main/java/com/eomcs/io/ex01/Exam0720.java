// 활용 - 지정한 폴더를 삭제하라
package com.eomcs.io.ex01;

import java.io.File;

public class Exam0720 {


  public static void main(String[] args) throws Exception {

    File dir = new File("test");
    deleteFile(dir);
    System.out.println("삭제완료");

  }// end main()

  static void deleteFile(File dir) {
    if (dir.isDirectory()) {
      File[] files = dir.listFiles();
      for(File f : files) {
        deleteFile(f);
      }
    }
    dir.delete();
  }

}//end Exam0710{}


