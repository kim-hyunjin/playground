package com.eomcs.algorithm.data_structure.stack;

public class StackTest {

  public static void main(String[] args) {
    Stack<String> stack = new Stack<String>();

    stack.push("aa");
    stack.push("bb");
    stack.push("cc");
    stack.push("dd");

    while (!stack.empty()) {
      System.out.println(stack.pop());
    }

  }
}
