package com.eomcs.basic.ex04;

// 배열
public class Exam61 {
  public static void main(String[] args) {
    //배열 사용전
    int kor, eng, math, sci, art;

    //배열 사용후
    int[] score = new int[5];
    // int score[] = new int[6]; C언어 방식.

    //배열에 값을 저장하는 방법
    score[0] = 100;
    score[1] = 100;
    score[2] = 100;
    score[3] = 100;
    score[4] = 100;
    
    //score[-1] = 100;  // runtime error!
    //score[5] = 100;   // runtime error!

    //배열 레퍼런스와 인스턴스를 따로 선언하기
    /*
    int[] arr1 = null;  // null : 주소가 없다는 뜻. 0이 들어간다. 메모리를 가리키지 않음.

    arr1[0] = 100;      // runtime error!  NullPointerException
    */

    int[] arr1;

    // 배열 인스턴스 생성
    arr1 = new int[5];
    arr1[0] = 100;
    arr1[1] = 100;

    // 배열 사용
    System.out.println(arr1[0]);
    System.out.println(arr1[1]);
    
    int[] arr2;

    // 배열 레퍼런스는 배열 인스턴스의 주소를 담는다.
    arr2 = arr1;  // arr1에 저장된 배열 인스턴스의 주소를 담는다.
    System.out.println(arr1[0]);    
    arr2[0] = 300;
    System.out.println(arr1[0]);
    
    // 배열 인스턴스의 각 항목은 생성되는 순간 기본 값으로 자동 초기화된다.
    // byte, short, int, long 배열 : 0
    // float, doulble : 0.0
    // boolean : false'
    // char : \u0000;
    System.out.println(arr1[2]);

    int[] arr3 = new int[3];
    arr3[0] = 30;

    arr2 = arr3;

    System.out.println(arr2[0]);

    arr1 = arr2;
    System.out.println(arr1[0]);

    // 그럼 arr1에 저장되었던 기존 배열 인스턴스에는 어떻게 해야 다시 가져올 수 있을까?
    // ==> 불가능.
    // 이렇게 주소를 잃어버려 접근할 수 없는 메모리를 garbage라 부른다.
    // ==> garbage는 JVM실행 중에 메모리가 부족할 때 garbage collector에 의해 메모리에서 해제된다.
    // JVM을 종료하면 JVM이 사용하던 모든 메모리는 OS에 반납된다.
    // 전산학에서는 garbage를 dangling object라고 부른다.

    // garbage collector 동작 : 메모리가 부족할 때, CPU가 한가할 때

    //배열 인스턴스 생성과 동시에 값 초기화 시키기
    int[] arr4 = new int[] {10, 20, 30};  //초기화 시키는 개수만큼의 크기를 가진 배열이 생성된다.

    int[] arr5 = {100, 90, 80}; //배열 선언과 동시에 초기화시킬 때는 new int[]를 생략할 수 있다.

    //레퍼런스를 생성한 다음에 값을 초기화 시킬때는 new int[] 생략할 수 없다.
    int[] arr6;
    //  arr6 = {100, 90, 80;}  컴파일오류!
    arr6 = new int[] {100, 90, 80}; //OK!
    



  }
}