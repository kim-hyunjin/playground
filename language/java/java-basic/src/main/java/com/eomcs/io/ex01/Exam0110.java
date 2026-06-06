// 폴더 정보 조회 - java.io.File 클래스
package com.eomcs.io.ex01;

import java.io.File;

public class Exam0110 {

  public static void main(String[] args) throws Exception {
    // File 클래스
    // => 파일이나 디렉토리 정보를 관리
    // => 파일이나 디렉토리를 생성,삭제,변경

    // 현재 폴더 정보 조회
    // "." : 현재 폴더
    // : 이클립스에서는 프로젝트 폴더를 가리킨다.
    // : 콘솔에서는 현재 명령어를 실행하는 위치를 가리킨다.
    // ".." - 상위 폴더
    File currentDir = new File(".");
    System.out.printf("폴더명: %s\n", currentDir.getName());
    System.out.printf("경로: %s\n", currentDir.getPath());
    System.out.printf("절대경로: %s\n", currentDir.getAbsolutePath());
    System.out.printf("계산된 절대경로: %s\n", currentDir.getCanonicalPath());

    System.out.printf("총크기: %d\n", currentDir.getTotalSpace());
    System.out.printf("남은크기: %d\n", currentDir.getFreeSpace());
    System.out.printf("가용크기: %d\n", currentDir.getUsableSpace());

    System.out.printf("디렉토리여부: %b\n", currentDir.isDirectory());
    System.out.printf("파일여부: %b\n", currentDir.isFile());
    System.out.printf("감춤폴더: %b\n", currentDir.isHidden());
    System.out.printf("존재여부: %b\n", currentDir.exists());
    System.out.printf("실행가능여부: %b\n", currentDir.canExecute());

  }

}


