package com.eomcs.algorithm.data_structure.linkedlist.practice;

public class LinkedList05 {
  Node first;
  Node last;
  int size;
  
  public void add(Object element) {
    Node newNode = new Node();
    newNode.element = element;
    
    if (first == null) {
      last = first = newNode;
    } else {
      last.next = newNode;
      last = newNode;
    }
    size++;
  }
  
  public Object get(int index) {
    if (index < 0 || index >= size) {
      return null;
    }
    Node cursor = first;
    for (int i = 0; i < index; i++) {
      cursor = cursor.next;
    }
    return cursor.element;
  }
  
  static class Node {
    Object element;
    Node next;
  }
}
