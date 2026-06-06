package com.eomcs.algorithm.data_structure.linkedlist.practice;

public class LinkedList08 {
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
  
  public void add(int index, Object element) {
    if (index < 0 || index >= size) {
      return;
    }
    Node newNode = new Node();
    newNode.element = element;
    
    Node cursor = first;
    for (int i = 0; i < index - 1; i++) {
      cursor = cursor.next;
    }
    
    if (index == 0) {
      newNode.next = first;
      first = newNode;
    } else {
      newNode.next = cursor.next;
      cursor.next = newNode;
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
  
  public Object remove(int index) {
    if (index < 0 || index >= size) {
      return null;
    }
    Node cursor = first;
    for (int i = 0; i < index - 1; i++) {
      cursor = cursor.next;
    }
    Node deleteNode = null;
    if (index == 0) {
      deleteNode = first;
      first = deleteNode.next;
    } else {
      deleteNode = cursor.next;
      cursor.next = deleteNode.next;
    }
    deleteNode.next = null;
    size--;
    return deleteNode.element;
  }
  
  public Object set(int index, Object e) {
    if (index < 0 || index >= size) {
      return null;
    }
    Node cursor = first;
    for (int i = 0; i < index; i++) {
      cursor = cursor.next;
    }
    Object oldElement = cursor.element;
    cursor.element = e;
    
    return oldElement;
  }
  
  static class Node {
    Object element;
    Node next;
  }
}
