package com.eomcs.basic.ex07.assignment;

import java.util.Arrays;

public class Test03 {
  public static void main(String[] args) {
    int[] values = {34, 4, -3, 78, 12, 22, 45, 0, -22};

    // 배열의 들어 있는 값의 순서를 꺼꾸로 바꿔라. 
    values = reverseArr(values); 
    
    for (int value : values) {
      System.out.println(value);
    }
    // 출력결과:
    // -22, 0, 45, 22, 12, 78, -3, 4, 34
  }
   static int[] reverseArr(int[] arr) {
     int left = 0;
     int right = arr.length - 1;
     
     while (left < right) {
       int temp = arr[left];
       arr[left] = arr[right];
       arr[right] = temp;
       
       left++;
       right--;
     }
     return arr;
   }
  
  
}
