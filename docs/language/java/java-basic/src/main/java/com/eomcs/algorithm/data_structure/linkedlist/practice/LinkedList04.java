package com.eomcs.algorithm.data_structure.linkedlist.practice;

public class LinkedList04 {
  
  Node first;
  Node last;
  int size;
  
  public void add(Object value) {
    Node newNode = new Node();
    newNode.value = value;
    
    if (first == null) {
      last = first = newNode;
    } else {
      last.next = newNode;
      last = newNode;
    }
    size++;
  }
  
  static class Node {
    Object value;
    Node next;
  }
}
