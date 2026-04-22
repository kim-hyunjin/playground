// 파일 정보 조회 - java.io.File 클래스
package com.eomcs.io.ex01;

import java.io.File;

public class Exam0210 {

  public static void main(String[] args) throws Exception {
    // File 클래스
    // => 파일이나 디렉토리 정보를 관리
    // => 파일이나 디렉토리를 생성,삭제,변경

    // 현재 파일 정보 조회
    File file1 = new File("./build.gradle");
    System.out.printf("파일명: %s\n", file1.getName());
    System.out.printf("파일크기: %d\n", file1.length());
    System.out.printf("경로: %s\n", file1.getPath());
    System.out.printf("절대경로: %s\n", file1.getAbsolutePath());
    System.out.printf("계산된 절대경로: %s\n", file1.getCanonicalPath());

    System.out.printf("총크기: %d\n", file1.getTotalSpace());
    System.out.printf("남은크기: %d\n", file1.getFreeSpace());
    System.out.printf("가용크기: %d\n", file1.getUsableSpace());

    System.out.printf("디렉토리여부: %b\n", file1.isDirectory());
    System.out.printf("파일여부: %b\n", file1.isFile());
    System.out.printf("감춤여부: %b\n", file1.isHidden());
    System.out.printf("존재여부: %b\n", file1.exists());
    System.out.printf("실행가능여부: %b\n", file1.canExecute());

  }

}


