package com.eomcs.basic.ex05.assignment;

import java.util.Scanner;

public class Test02 {

  public static void main(String[] args) {
    System.out.println("최소값, 최대값 구하기");
    System.out.println("*********************");
    Scanner scan = new Scanner(System.in);
    int count;
    int numArr[]; 
    System.out.println("몇개의 숫자를 입력? ");
    count = scan.nextInt();
    numArr = new int[count];

    // 배열에 정수 입력받기
    for(int i = 0; i < count; i++) {
      System.out.print("정수를 입력하세요!> ");
      numArr[i] = scan.nextInt();
      System.out.println("---------------------------");
    }

    int max = numArr[0];
    int min = numArr[0];
    for(int i = 0; i < numArr.length; i++) {
      if(max < numArr[i]) {
      //max의 값보다 array[i]이 크면 max = array[i]
      max = numArr[i];
      } else if(min > numArr[i]) {
      //min의 값보다 array[i]이 작으면 min = array[i]
      min = numArr[i];
      }
  }

    System.out.printf("최소값: %d\n", min);
    System.out.printf("최대값: %d", max);



  }

}
