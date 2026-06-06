package com.eomcs.algorithm.data_structure.linkedlist.practice;

public class LinkedList09 {
  Node first;
  Node last;
  int size;
  
  public void add(Object element) {
    Node newNode = new Node();
    newNode.item = element;
    
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
    newNode.item = element;
    
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
    return cursor.item;
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
    return deleteNode.item;
  }
  
  public Object set(int index, Object e) {
    if (index < 0 || index >= size) {
      return null;
    }
    Node cursor = first;
    for (int i = 0; i < index; i++) {
      cursor = cursor.next;
    }
    Object oldElement = cursor.item;
    cursor.item = e;
    
    return oldElement;
  }
  
  public Object[] toArray() {
    Object[] arr = new Object[size];
    
    Node cursor = first;
    for (int i = 0; i < size; i++) {
      arr[i] = cursor.item;
      cursor = cursor.next;
    }
    return arr;
  }
  
  static class Node {
    Object item;
    Node next;
  }
}
